/**
 * 顶部「特效控制」工具条（驾驶舱风格）
 *
 * 依赖 engine.js 暴露的 window.__MAP_SCENE__。
 * 开关：光柱 / 飞线 / 散点 / 监测点（默认关）/ 人口标签，另有一键全部显示。
 * 偏好写入 window.__MAP_FX_PREFS__，入场动画结束时引擎会读取它，避免被重新打开。
 */
const POLL_INTERVAL = 800
const POLL_MAX = 90

// 默认偏好：监测点默认关闭（关掉就不要显示）
window.__MAP_FX_PREFS__ = window.__MAP_FX_PREFS__ || { infoPoint: false }

const ICONS = {
    bar: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 13V8M8 13V3M13 13V10"/></svg>',
    flyLine:
        '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12c4.5 0 4.5-7 9-7h2"/><path d="M10.5 2.5 13 5l-2.5 2.5"/></svg>',
    scatter:
        '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><circle cx="4" cy="11" r="1.7"/><circle cx="8.5" cy="4.5" r="1.7"/><circle cx="12.5" cy="9" r="1.7"/><circle cx="6.5" cy="6.5" r="1.1"/></svg>',
    infoPoint:
        '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 14.2S3.2 9.8 3.2 6.4a4.8 4.8 0 1 1 9.6 0c0 3.4-4.8 7.8-4.8 7.8Z"/><circle cx="8" cy="6.4" r="1.7" fill="currentColor" stroke="none"/></svg>',
    barLabel:
        '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M2.5 3.5h11v7h-6L4 13.5V10.5H2.5Z"/><path d="M5.5 6.5h5M5.5 8.5h3" stroke-linecap="round"/></svg>',
    reset:
        '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 2.5v5"/><path d="M4.2 4.8a5.4 5.4 0 1 0 7.6 0"/></svg>',
}

function collectCategories(scene) {
    return [
        { key: 'bar', label: '光柱', objs: [scene.barGroup, ...(Array.isArray(scene.allGuangquan) ? scene.allGuangquan : [])].filter(Boolean) },
        { key: 'flyLine', label: '飞线', objs: [scene.flyLineGroup, scene.flyLineFocusGroup].filter(Boolean) },
        { key: 'scatter', label: '散点', objs: [scene.scatterGroup].filter(Boolean) },
        { key: 'infoPoint', label: '监测点', objs: [scene.InfoPointGroup].filter(Boolean) },
        { key: 'barLabel', label: '人口标签', objs: Array.isArray(scene.allProvinceLabel) ? scene.allProvinceLabel.filter(Boolean) : [] },
    ].filter((c) => c.objs.length > 0)
}

function injectStyles() {
    if (document.getElementById('map-fx-style')) return
    const style = document.createElement('style')
    style.id = 'map-fx-style'
    style.textContent = `
@keyframes fxBrittle{0%{opacity:0;transform:translate(-50%,16px)}100%{opacity:1;transform:translate(-50%,0)}}
@keyframes fxBtnIn{0%{opacity:0;transform:translateY(-8px)}100%{opacity:1;transform:translateY(0)}}
@keyframes fxScan{0%{left:-30%}100%{left:130%}}
@keyframes fxDotPulse{0%,100%{opacity:1}50%{opacity:.35}}
#map-fx-toolbar{position:fixed;bottom:112px;left:50%;transform:translateX(-50%);z-index:9998;
padding:1px;clip-path:polygon(14px 0,calc(100% - 14px) 0,100% 100%,0 100%);
background:linear-gradient(90deg,rgba(56,189,255,.05),rgba(120,220,255,.75) 18%,rgba(120,220,255,.75) 82%,rgba(56,189,255,.05));
animation:fxBrittle .5s cubic-bezier(.22,.9,.34,1) .15s backwards;user-select:none}
#map-fx-toolbar .fx-bar{position:relative;overflow:hidden;display:flex;align-items:stretch;height:38px;
clip-path:polygon(14px 0,calc(100% - 14px) 0,100% 100%,0 100%);
background:linear-gradient(180deg,rgba(9,26,50,.94),rgba(3,10,22,.92));
backdrop-filter:blur(6px)}
#map-fx-toolbar .fx-bar::after{content:'';position:absolute;top:0;bottom:0;width:22%;pointer-events:none;
background:linear-gradient(100deg,transparent,rgba(140,225,255,.14),transparent);
animation:fxScan 5.5s linear infinite}
#map-fx-toolbar .fx-title{display:flex;align-items:center;gap:8px;padding:0 16px;margin-right:2px;
font-size:12px;letter-spacing:4px;color:#9fdcff;text-shadow:0 0 10px rgba(80,200,255,.55);
border-right:1px solid rgba(96,190,255,.22);white-space:nowrap}
#map-fx-toolbar .fx-title::before{content:'';width:6px;height:6px;border-radius:50%;background:#37e0ff;
box-shadow:0 0 10px #37e0ff;animation:fxDotPulse 2.2s ease-in-out infinite}
#map-fx-toolbar .fx-btn{position:relative;display:flex;align-items:center;gap:7px;padding:0 15px;margin:0;
background:transparent;border:none;border-right:1px solid rgba(96,190,255,.14);cursor:pointer;
color:#9fdcff;font-size:12px;letter-spacing:2px;font-family:inherit;white-space:nowrap;
transition:color .25s,background .25s,text-shadow .25s;animation:fxBtnIn .4s ease backwards}
#map-fx-toolbar .fx-btn:last-child{border-right:none}
#map-fx-toolbar .fx-btn svg{display:block;transition:filter .25s}
#map-fx-toolbar .fx-btn .dot{width:5px;height:5px;border-radius:50%;background:#37e0ff;
box-shadow:0 0 7px #37e0ff;transition:all .25s;flex:none}
#map-fx-toolbar .fx-btn::after{content:'';position:absolute;left:12px;right:12px;bottom:4px;height:1px;
background:linear-gradient(90deg,transparent,#5fd8ff,transparent);
transform:scaleX(0);transition:transform .3s cubic-bezier(.22,.9,.34,1)}
#map-fx-toolbar .fx-btn:hover{color:#e4f8ff;text-shadow:0 0 10px rgba(120,220,255,.9);
background:linear-gradient(180deg,rgba(64,180,255,.16),rgba(64,180,255,.03))}
#map-fx-toolbar .fx-btn:hover::after{transform:scaleX(1)}
#map-fx-toolbar .fx-btn:hover svg{filter:drop-shadow(0 0 4px rgba(120,220,255,.9))}
#map-fx-toolbar .fx-btn:active{transform:scale(.96)}
#map-fx-toolbar .fx-btn.is-off{color:#54697f;text-shadow:none;background:none}
#map-fx-toolbar .fx-btn.is-off .dot{background:#3d4f63;box-shadow:none}
#map-fx-toolbar .fx-btn.is-off svg{opacity:.55;filter:none}
#map-fx-toolbar .fx-btn.fx-reset{color:#ffc46b}
#map-fx-toolbar .fx-btn.fx-reset .dot{background:#ffb84d;box-shadow:0 0 7px rgba(255,184,77,.8)}
#map-fx-toolbar .fx-btn.fx-reset:hover{color:#ffe2ae;background:linear-gradient(180deg,rgba(255,184,77,.14),rgba(255,184,77,.02))}
#map-fx-toolbar .fx-btn.fx-reset::after{background:linear-gradient(90deg,transparent,#ffc46b,transparent)}
`
    document.head.appendChild(style)
}

function buildToolbar(categories) {
    injectStyles()

    const wrap = document.createElement('div')
    wrap.id = 'map-fx-toolbar'
    const bar = document.createElement('div')
    bar.className = 'fx-bar'
    wrap.appendChild(bar)

    const title = document.createElement('span')
    title.className = 'fx-title'
    title.textContent = '特效控制'
    bar.appendChild(title)

    let nth = 0
    categories.forEach((cat) => {
        const btn = document.createElement('button')
        btn.className = 'fx-btn'
        btn.style.animationDelay = `${0.25 + nth * 0.06}s`
        nth += 1
        btn.innerHTML = `<i class="dot"></i>${ICONS[cat.key] || ''}<span>${cat.label}</span>`

        // 初始状态：读偏好（监测点默认关）
        let on = !(window.__MAP_FX_PREFS__[cat.key] === false)
        applyCat(cat, on)
        btn.classList.toggle('is-off', !on)

        btn.addEventListener('click', () => {
            on = !on
            window.__MAP_FX_PREFS__[cat.key] = on
            applyCat(cat, on)
            btn.classList.toggle('is-off', !on)
            syncMaster()
        })
        bar.appendChild(btn)
    })

    // 一键总开关：全部开着时点它=一键关闭；有关闭项时点它=一键打开
    const master = document.createElement('button')
    master.className = 'fx-btn fx-reset'
    master.style.animationDelay = `${0.25 + nth * 0.06}s`
    const syncMaster = () => {
        const allOn = categories.every((cat) => window.__MAP_FX_PREFS__[cat.key] !== false)
        master.innerHTML = `<i class="dot"></i>${ICONS.reset}<span>${allOn ? '一键关闭' : '一键打开'}</span>`
        return allOn
    }
    syncMaster()
    master.addEventListener('click', () => {
        // 目标状态：当前全开 → 关；否则 → 开
        const target = syncMaster() ? false : true
        categories.forEach((cat) => {
            window.__MAP_FX_PREFS__[cat.key] = target
            applyCat(cat, target)
        })
        bar.querySelectorAll('.fx-btn').forEach((b) => {
            if (!b.classList.contains('fx-reset')) b.classList.toggle('is-off', !target)
        })
        syncMaster()
    })
    bar.appendChild(master)

    document.body.appendChild(wrap)
}

function applyCat(cat, on) {
    cat.objs.forEach((o) => {
        o.visible = on
    })
}

export function setupMapFxToolbar() {
    let tries = 0
    const timer = setInterval(() => {
        tries += 1
        const scene = window.__MAP_SCENE__
        if (!scene) {
            if (tries >= POLL_MAX) {
                clearInterval(timer)
                console.warn('[mapFx] 未找到三维地图场景，特效工具条未创建')
            }
            return
        }
        // 等地图入场动画播完（progress 达到 1）再创建工具条，
        // 让工具条在地图完全出来之后才动画展示，避免和入场抢注意力
        const tl = scene.animateTl
        const ready = tl && typeof tl.progress === 'function' ? tl.progress() >= 1 : tries >= POLL_MAX
        if (!ready) return
        clearInterval(timer)
        const categories = collectCategories(scene)
        console.log('[mapFx] 特效开关：', categories.map((c) => c.label).join('、') || '（未识别到特效分组）')
        if (categories.length) buildToolbar(categories)
    }, POLL_INTERVAL)
}
