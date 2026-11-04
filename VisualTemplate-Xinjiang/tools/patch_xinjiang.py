# -*- coding: utf-8 -*-
"""Patch VisualTemplate bundle: Guangdong -> Xinjiang."""
import json, math, io, os, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(ROOT, 'assets')
BUNDLE = os.path.join(ASSETS, 'index-361e7662.js')
BACKUP = BUNDLE + '.guangdong.bak'
XJ_JSON = os.path.join(ASSETS, 'json', '新疆-地州.json')

# ---- projection params (computed to keep same visual footprint as GD: w=15.17 h=13.29 @ scale38) ----
CENTER = [84.946334, 42.188608]
SCALE = 38
URUMQI = [87.617733, 43.792818]
LABEL_CENTER = [84.946334, 36.115]   # dy ~ -5.2 below map center, mirrors GD label position

# ---- population (万人, approx 2023) ----
POP = {
    '乌鲁木齐市': 408, '克拉玛依市': 49, '吐鲁番市': 69, '哈密市': 67,
    '昌吉回族自治州': 162, '博尔塔拉蒙古自治州': 48, '巴音郭楞蒙古自治州': 138,
    '阿克苏地区': 271, '克孜勒苏柯尔克孜自治州': 62, '喀什地区': 463,
    '和田地区': 253, '伊犁哈萨克自治州': 285, '塔城地区': 91, '阿勒泰地区': 66,
    '石河子市': 76, '阿拉尔市': 41, '图木舒克市': 27, '五家渠市': 13,
    '北屯市': 11, '铁门关市': 10, '双河市': 6, '可克达拉市': 8,
    '昆玉市': 6, '胡杨河市': 5,
}
EN = {
    '乌鲁木齐市': 'urumqi', '克拉玛依市': 'karamay', '吐鲁番市': 'turpan', '哈密市': 'hami',
    '昌吉回族自治州': 'changji', '博尔塔拉蒙古自治州': 'bortala', '巴音郭楞蒙古自治州': 'bayingolin',
    '阿克苏地区': 'aksu', '克孜勒苏柯尔克孜自治州': 'kizilsu', '喀什地区': 'kashgar',
    '和田地区': 'hotan', '伊犁哈萨克自治州': 'ili', '塔城地区': 'tacheng', '阿勒泰地区': 'altay',
    '石河子市': 'shihezi', '阿拉尔市': 'alar', '图木舒克市': 'tumxuk', '五家渠市': 'wujiaqu',
    '北屯市': 'beitun', '铁门关市': 'tiemenguan', '双河市': 'shuanghe', '可克达拉市': 'kokdala',
    '昆玉市': 'kunyu', '胡杨河市': 'huyanghe',
}

d = json.load(open(XJ_JSON, encoding='utf-8'))
feats = {f['properties']['name']: f['properties'] for f in d['features']}

# eD: city list used by bars / flylines / labels
eD = []
for name, p in feats.items():
    eD.append({
        'name': name,
        'enName': EN.get(name, 'xinjiang'),
        'center': p.get('center'),
        'centroid': p.get('centroid') or p.get('center'),
        'value': POP.get(name, 20),
    })

# GK: scatter points across the region (deterministic jitter around centroids)
import random
random.seed(42)
GK = []
for name, p in feats.items():
    c = p.get('centroid') or p.get('center')
    GK.append({'value': random.randint(111, 187), 'lng': c[0] + random.uniform(-0.8, 0.8), 'lat': c[1] + random.uniform(-0.6, 0.6)})

# HK: info points
HK = [
    {'name': '监测点#01', 'level': '差', 'value': 84.9, 'lng': 87.617733, 'lat': 43.792818},
    {'name': '监测点#02', 'level': '极好', 'value': 12.5, 'lng': 75.989138, 'lat': 39.467664},
    {'name': '监测点#03', 'level': '良好', 'value': 52.8, 'lng': 81.317946, 'lat': 43.92186},
    {'name': '监测点#04', 'level': '好', 'value': 32, 'lng': 93.51316, 'lat': 42.833248},
]

def fmt_arr(arr, indent=''):
    return json.dumps(arr, ensure_ascii=False, separators=(',', ':'))

src = open(BUNDLE, encoding='utf-8').read()
orig_len = len(src)

def replace_once(s, old, new, tag):
    n = s.count(old)
    assert n == 1, f'[{tag}] expected 1 occurrence, found {n}'
    print(f'ok: {tag}')
    return s.replace(old, new)

# 0. gsap lagSmoothing off (software-rendered preview + avoids stuck intro on slow frames)
src = replace_once(src, ',t=500,e=33', ',t=1e9,e=33', 'gsap-lag')

# 1. projection / camera anchors
src = replace_once(src,
    'this.geoProjectionCenter=[113.280637,23.125178],this.geoProjectionScale=120,this.flyLineCenter=[113.544372,23.329249]',
    f'this.geoProjectionCenter={json.dumps(CENTER)},this.geoProjectionScale={SCALE},this.flyLineCenter={json.dumps(URUMQI)}',
    'projection')

# 2. focus label
src = replace_once(src,
    'this.mapFocusLabelInfo={name:"广东省",enName:"GUANGDONG PROVINCE",center:[113.280637,20.625178]}',
    f'this.mapFocusLabelInfo={{name:"新疆维吾尔自治区",enName:"XINJIANG UYGUR AUTONOMOUS REGION",center:{json.dumps(LABEL_CENTER)}}}',
    'focus-label')

# 3. eD city array
start = src.index('=[{name:"广州市",enName:"guangzhou"')
open_tok = src.index('[', start)
end = src.index('value:27}]', start) + len('value:27}]')
src = src[:start] + '=' + fmt_arr(eD) + src[end:]
print('ok: eD-cities')

# 4. GK scatter array
start = src.index('=[{value:180,lng:113.79080836137965')
end = src.index('lat:22.554544085168132}]', start) + len('lat:22.554544085168132}]')
src = src[:start] + '=' + fmt_arr(GK) + src[end:]
print('ok: GK-scatter')

# 5. HK info points
start = src.index('=[{name:"监测点#01"')
end = src.index('lat:22.18083965}]', start) + len('lat:22.18083965}]')
src = src[:start] + '=' + fmt_arr(HK) + src[end:]
print('ok: HK-points')

# 6. titles
src = replace_once(src, 'title:"广东省数据可视化平台"', 'title:"新疆维吾尔自治区数据可视化平台"', 'title')
src = replace_once(src, '"sub-text":"Guangdong Economic Visualization Platform"',
                   '"sub-text":"Xinjiang Economic Visualization Platform"', 'subtitle')

# 7. skip-bar animation city (largest bar) -> now Kashgar
src = replace_once(src, 'e.userData.name==="广州市"', 'e.userData.name==="喀什地区"', 'bar-skip')

# 8. province label list entry (china map labels)
src = replace_once(src,
    '{name:"广东省",center:[113.280637,23.125178],centroid:[113.429919,23.334643],hide:!0}',
    '{name:"新疆维吾尔自治区",center:[87.617733,43.792818],centroid:[85.294711,41.371801],hide:!0}',
    'province-entry')
# show only Xinjiang neighbors; hide far ones
src = replace_once(src, '{name:"甘肃省",center:[103.823557,36.058039],centroid:[103.823557,36.058039],hide:!0}',
                        '{name:"甘肃省",center:[103.823557,36.058039],centroid:[103.823557,36.058039],blur:!0}', 'gansu-blur')
src = replace_once(src, '{name:"青海省",center:[101.778916,36.623178],centroid:[96.043533,35.726403],hide:!0}',
                        '{name:"青海省",center:[101.778916,36.623178],centroid:[96.043533,35.726403],blur:!0}', 'qinghai-blur')
src = replace_once(src, '{name:"西藏自治区",center:[91.132212,29.660361],centroid:[88.388277,31.56375],hide:!0}',
                        '{name:"西藏自治区",center:[91.132212,29.660361],centroid:[88.388277,31.56375],blur:!0}', 'xizang-blur')
src = replace_once(src, '{name:"台湾省",center:[121.509062,25.044332],centroid:[120.971485,23.749452]}',
                        '{name:"台湾省",center:[121.509062,25.044332],centroid:[120.971485,23.749452],hide:!0}', 'taiwan-hide')

# 9. decoration pin labels -> flank the Xinjiang map
src = replace_once(src, 'center:[118.280637,21.625178]', 'center:[96.946334,44.5]', 'pin-east')
src = replace_once(src, 'center:[106.280637,25.625178]', 'center:[72.946334,39.5]', 'pin-west')

# 10. geojson asset paths
src = replace_once(src, 'assets/json/广东省.json', 'assets/json/新疆-地州.json', 'map-json')
src = replace_once(src, 'assets/json/广东省-轮廓.json', 'assets/json/新疆-轮廓.json', 'map-stroke')

# 11. top-face gradient width constant (GD map width 15.78 -> XJ 15.17)
src = replace_once(src, 'vPosition.x/15.78', 'vPosition.x/15.17', 'gradient-width')

# 12. KPI numbers (2024 Xinjiang GDP / population)
src = replace_once(src, 'zh:"2024年生产总值",en:"Gross Domestic Product in 2024",value:31510',
                        'zh:"2024年生产总值",en:"Gross Domestic Product in 2024",value:20534', 'kpi-gdp')
src = replace_once(src, 'zh:"2024年常驻人数",en:"resident population in 2024",value:15e3',
                        'zh:"2024年常驻人数",en:"resident population in 2024",value:2598', 'kpi-pop')

open(BUNDLE, 'w', encoding='utf-8', newline='').write(src)
print(f'bundle: {orig_len} -> {len(src)} bytes')
print('ALL PATCHES APPLIED')
