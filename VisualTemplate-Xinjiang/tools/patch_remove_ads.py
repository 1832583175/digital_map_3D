# -*- coding: utf-8 -*-
"""Remove the "buy source code" QR-code floating ad + its anti-debug script
from the entry bundle (App component)."""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
BUNDLE = os.path.join(ROOT, 'assets', 'index-b6e4f5db.js')

src = open(BUNDLE, encoding='utf-8').read()
before = len(src)

def replace_once(s, old, new, tag):
    n = s.count(old)
    assert n == 1, f'[{tag}] expected 1, found {n}'
    print('ok:', tag)
    return s.replace(old, new)

# 1) drop the <div class="qrcode-fixed"> node from App's render output
old_render = ('ge("div",{class:mn(["qrcode-fixed",{active:Ve(n).isHover}])},'
              '[ge("div",{class:"qrcode-fixed-btn",onMouseenter:s,onMouseleave:r},'
              '[Ve(n).mode?(dt(),Rt("svg",_u,vu)):(dt(),Rt("div",hu,mu))],32),'
              'ge("div",bu,[Ve(n).mode?(dt(),Rt("img",wu)):(dt(),Rt("img",Eu)),xu])],2)')
assert old_render in src, 'ad render block not found'
src = replace_once(src, old_render, '', 'ad-render')

# 2) drop the mounted hook that turns the ad on and runs the anti-debug trap
old_mounted = 'Jr(()=>{o(),setTimeout(()=>{n.isHover=!0,t=setTimeout(()=>{n.isHover=!1},2e3)},500)})'
src = replace_once(src, old_mounted, 'Jr(()=>{})', 'anti-debug-hook')

# 3) strip dead ad variable definitions (qrcode images, buy-btn vnode, svg icon...)
old_imgs = '),fu="assets/qrcode-42ca0273.png",au="assets/qrcode-szxs-be3deddd.png";const du'
src = replace_once(src, old_imgs, ');const du', 'dead-img-vars')
i1 = src.index('hu={key:0,class:"buy-btn"}')
i2 = src.index(',Cu={__name:"App"')
src = src[:i1] + src[i2 + 1:]
print('ok: dead-ad-vnodes')

open(BUNDLE, 'w', encoding='utf-8', newline='').write(src)
print(f'entry bundle: {before} -> {len(src)} bytes')
print('AD REMOVED')
