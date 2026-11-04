/**
 * ============================================================
 *  大屏主页面
 * ============================================================
 *  结构：三维地图(WebGL) + 顶部标题栏 + 左右数据面板 + 底部导航
 *  数值 / 文案 全部来自 src/config/，本文件只负责布局与图表配置。
 */
import cfg from '../../config/index.js';
import '../../styles/page.css';
import '../../styles/cards.css';
import { setupCardFocus } from '../../interactions/cardFocus.js';
import {
    $p, CQ, Co, Dd, Fn, He,
    KB, Ke, Lc, Le, MQ, Mh,
    Nw, Ow, PT, Qm, Qp, Qr,
    T$, Ta, V, Vt, We, Wn,
    _k, bk, cy, dS, dk, eC,
    ej, f0, fd, fk, h0, hr,
    ic, kQ, ll, ln, lp, mB,
    my, n6, pQ, pn, qw, rT,
    tC, tr, uy, vi, vt, wa,
    wr, ye, zs,
} from './engine.js';

const PSt = {
        class: "left-card"
    },
    RSt = {
        __name: "BulkCommoditySalesChart",
        setup(r) {
            const t = wa({
                title: {
                    text: "亿元",
                    left: "5%",
                    top: "8%",
                    textStyle: {
                        color: "#D3F8F2",
                        fontSize: 8
                    }
                },
                grid: {
                    left: "12%",
                    top: "25%",
                    width: "82%",
                    height: "55%"
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                        shadowStyle: {
                            opacity: 0
                        }
                    },
                    backgroundColor: "rgba(0,0,0,1)",
                    borderWidth: 1,
                    borderColor: "#ffffff",
                    textStyle: {
                        color: "#ffffff",
                        fontSize: 10
                    }
                },
                xAxis: [{
                    type: "category",
                    interval: 0,
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "#435459"
                        }
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !1
                    },
                    axisLabel: {
                        color: "#ffffff",
                        fontSize: 10,
                        interval: 0,
                        padding: [0, 0, 0, 0]
                    },
                    data: ["农产品", "能源", "金属", "化工", "木材"]
                }, {
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "rgba(0,0,0,0)"
                        }
                    },
                    data: []
                }],
                yAxis: {
                    type: "value",
                    axisLine: {
                        show: !1
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !0,
                        lineStyle: {
                            type: [2, 2],
                            dashOffset: 5,
                            color: ["rgba(255, 255, 255, 1)"],
                            opacity: 1,
                            width: .3
                        }
                    },
                    axisLabel: {
                        color: "#8B9EA4",
                        fontSize: 9
                    }
                },
                series: [{
                    name: "",
                    data: [100, 120, 150, 110, 100],
                    type: "bar",
                    barWidth: 4,
                    stack: "b",
                    z: 3,
                    yAxisIndex: 0,
                    showBackground: !1,
                    backgroundStyle: {
                        color: "rgba(180, 180, 180, 0.2)"
                    },
                    label: {
                        show: !0,
                        position: "top",
                        distance: 15,
                        color: "#ffffff",
                        fontSize: 10
                    },
                    itemStyle: {
                        borderRadius: 2,
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#19FFC6"
                        }, {
                            offset: 1,
                            color: "#33AAFF"
                        }])
                    }
                }, {
                    type: "custom",
                    renderItem: (e, n) => {
                        const i = n.value(0),
                            a = n.value(1),
                            o = n.coord([i, a]),
                            s = o[1];
                        return {
                            type: "image",
                            style: {
                                x: o[0] - 4.5,
                                y: s - 9,
                                width: 10,
                                height: 10,
                                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAL1JREFUOE9j/P///38GMgAjSKOMdxRJWp9sXcYA18giJMLw99MHhv9//mA1hJGZhYGZX4Dhz7s3DCgaGVlYGDjVtBi+37rO8P/PbxTNjCysDJyqWgzfb18Dy6FoBKmEKfh17wZcM0iMTUkDrgmkDkMjSJCFnZ3hwbr5KDYqBCUy/Pn5Ey6GVSMzMxPDw01LUDTK+8Uw/P37j0YayXIqWYGDHuTInsQbHeAE8PEDw/+/JCYAUtIcPDpI0QRTCwDhurXXJ/EmUwAAAABJRU5ErkJggg=="
                            }
                        }
                    },
                    xAxisIndex: 1,
                    data: [100, 120, 150, 110, 100]
                }, {
                    type: "bar",
                    barWidth: 32,
                    xAxisIndex: 1,
                    barGap: "-220%",
                    data: [150, 150, 150, 150, 150],
                    emphasis: {
                        focus: "none",
                        itemStyle: {
                            color: "rgba(255,255,255,0.8)"
                        }
                    },
                    itemStyle: {
                        color: "rgba(122,140,153,0.6)",
                        opacity: .1
                    },
                    z: 0
                }]
            });
            return (e, n) => (We(), Ke("div", PSt, [ye(ll, {
                title: "大宗商品销售额"
            }, {
                default: tr(() => [ye(Ta(ic), {
                    ref: "vChart",
                    option: t.value,
                    autoresize: !0
                }, null, 8, ["option"])]),
                _: 1
            })]))
        }
    },
    ISt = "assets/ring2-a1b91808.png",
    OSt = "assets/ring3-fe0f60d7.png",
    NSt = "assets/ring4-f2e324d6.png";
const BSt = {
        name: "ThreePie",
        props: {
            data: {
                type: Array,
                default: () => []
            },
            colors: {
                type: Array,
                default: () => [2161326, 15380744, 3122407, 65535, 16536624]
            },
            opacity: {
                type: Number,
                default: .5
            },
            delay: {
                type: Number,
                default: 5e3
            },
            loopComplete: {
                type: Function,
                default: () => {}
            }
        },
        computed: {
            currentData() {
                return {
                    ...this.data[this.activeIndex],
                    count: this.count
                }
            }
        },
        data() {
            return this.scene = null, this.camera = null, this.renderer = null, this.controls = null, this.axes = null, this.pieGroup = new pn, {
                width: 300,
                height: 200,
                activeIndex: 0,
                count: 0,
                timer: null
            }
        },
        mounted() {
            this.width = this.$refs.pieDom.offsetWidth, this.height = this.$refs.pieDom.offsetHeight, this.count = this.data.map(r => r.value).reduce((r, t) => r + t, 0), this.init()
        },
        beforeUnmount() {
            clearInterval(this.timer), this.destroy()
        },
        methods: {
            init() {
                this.scene = new KB, this.initCamera(), this.initRenderer(), this.initLight(), this.initAxes(), this.initControls(), this.createPlane({
                    url: ISt,
                    width: 5,
                    position: new V(0, 0, -.01),
                    color: "#00ffff"
                }), this.createPlane({
                    url: OSt,
                    width: 6.5,
                    position: new V(0, 0, -.02),
                    color: "#00ffff"
                }), this.createPlane({
                    url: NSt,
                    width: 5.5,
                    position: new V(0, 0, -.03),
                    animate: !0,
                    color: "#00ffff"
                }), this.createPie(), this.loop()
            },
            createPlane(r) {
                let t = {
                        url: "texture/ring1.png",
                        width: 5.5,
                        z: 0,
                        position: new V(0, 0, 0),
                        animate: !1,
                        color: null
                    },
                    e = Object.assign(t, r);
                const n = new vi(e.width, e.width),
                    i = new ln({
                        map: this.getTexture(e.url),
                        transparent: !0,
                        side: Wn,
                        depthTest: !1
                    });
                e.color && (i.color = new Vt(e.color));
                const a = new Le(n, i);
                a.position.copy(e.position), a.rotation.x = -1 * Math.PI / 2, e.animate && Fn.to(a.rotation, {
                    z: 2 * Math.PI,
                    repeat: -1,
                    ease: "none",
                    duration: 3
                }), this.scene.add(a)
            },
            getTexture(r) {
                const t = new rT().load(r);
                return t.wrapS = t.wrapT = hr, t
            },
            createPie() {
                let r = 0,
                    t = 0;
                for (var e = 0; e < this.data.length; e++) {
                    let n = this.data[e].value / this.count;
                    e == 0 ? r = 0 : r = t + 1e-4, t = t + 2 * Math.PI * n - 1e-4;
                    let i = this.addRing({
                        startAngle: r,
                        endAngle: t,
                        color: new Vt(this.colors[e % this.colors.length])
                    });
                    i.name = "ring" + e, this.pieGroup.add(i)
                }
                this.scene.add(this.pieGroup), this.chooseRing(this.activeIndex, !0), this.timer = setInterval(() => {
                    this.loopChange()
                }, this.delay)
            },
            loopChange() {
                let r = this.activeIndex + 1;
                r >= this.data.length && (r = 0, this.loopComplete && this.loopComplete()), this.chooseRing(r)
            },
            chooseRing(r = 0, t = !1) {
                let e = r - 1 < 0 ? this.data.length - 1 : r - 1,
                    n = this.pieGroup.children[e];
                this.prevMesh = n, this.activeIndex = r;
                let i = this.pieGroup.children[r];
                t || (Fn.to(n.scale, {
                    z: 1
                }), Fn.to(n.material, {
                    opacity: this.opacity
                })), Fn.to(i.scale, {
                    z: 2
                }), Fn.to(i.material, {
                    opacity: .8
                })
            },
            addRing(r = {}) {
                let t = {
                        innerRadius: 1.5,
                        outerRadius: 2,
                        thickness: .5,
                        startAngle: 0,
                        endAngle: Math.PI / 2,
                        color: 65535,
                        segments: 120
                    },
                    e = Object.assign(t, r),
                    n = new zs;
                n.arc(0, 0, e.outerRadius, e.startAngle, e.endAngle);
                let i = n.getPoints(e.segments),
                    a = new zs;
                a.arc(0, 0, e.innerRadius, e.endAngle, e.startAngle, !0);
                let o = a.getPoints(e.segments),
                    s = new zs(i.concat(o));
                const l = {
                        steps: 1,
                        depth: e.thickness,
                        bevelEnabled: !0,
                        bevelThickness: 0,
                        bevelSize: 0,
                        bevelOffset: 0,
                        bevelSegments: 0
                    },
                    u = new my(s, l);
                let c = new dS({
                    color: e.color,
                    transparent: !0,
                    opacity: this.opacity,
                    side: Wn
                });
                const h = new Le(u, c.clone());
                return h.renderOrder = 10, h.rotation.x = -1 * Math.PI / 2, h
            },
            initCamera() {
                var r = this.width / this.height;
                this.camera = new wr(30, r, .1, 1500), this.camera.position.set(6.023813305272227, 4.838542633695233, 6.111272698256137), this.camera.lookAt(0, 0, 0)
            },
            initRenderer() {
                this.renderer = new qw({
                    antialias: !0,
                    alpha: !0
                }), this.renderer.setPixelRatio(window.devicePixelRatio), this.renderer.setSize(this.width, this.height), this.$refs.pieDom.appendChild(this.renderer.domElement)
            },
            initLight() {
                let r = new Qm(16777215, 2);
                r.position.set(200, 300, 200);
                let t = new Qm(16777215, 2);
                t.position.set(-200, -300, -200);
                let e = new fk(16777215, 2);
                this.scene.add(r), this.scene.add(t), this.scene.add(e)
            },
            initAxes() {
                this.axes = new dk(0), this.scene.add(this.axes)
            },
            initControls() {
                this.controls = new bk(this.camera, this.renderer.domElement), this.controls.maxPolarAngle = Math.PI, this.controls.autoRotate = !1, this.controls.enableDamping = !0, this.controls.enabled = !1
            },
            loop() {
                this.renderer.setAnimationLoop(() => {
                    this.renderer.render(this.scene, this.camera), this.controls && this.controls.update()
                })
            },
            start() {
                this.loop(), this.controls.enabled = !0, this.timer = setInterval(() => {
                    this.loopChange()
                }, this.delay)
            },
            stop() {
                clearInterval(this.timer), this.controls && (this.controls.enabled = !1), this.renderer && this.renderer.setAnimationLoop(null)
            },
            getScene() {
                return this.scene
            },
            getRender() {
                return this.renderer
            },
            destroy() {
                this.prevMesh && (Fn.set(this.prevMesh.scale, {
                    z: 1
                }), Fn.set(this.prevMesh.material, {
                    opacity: this.opacity
                })), this.stop(), this.renderer && (_k(this.pieGroup), this.renderer.dispose(), this.renderer.forceContextLoss(), this.controls.dispose(), this.$refs.pieDom.innerHTML = "", this.scene = null, this.camera = null, this.renderer = null, this.controls = null, this.axes = null)
            }
        }
    },
    kSt = {
        class: "three-pie-wrap"
    },
    FSt = {
        class: "three-pie",
        ref: "pieDom"
    },
    USt = {
        class: "three-pie-slot"
    };

function zSt(r, t, e, n, i, a) {
    return We(), Ke("div", kSt, [vt("div", FSt, null, 512), vt("div", USt, [Mh(r.$slots, "default", {
        data: a.currentData
    })])])
}
const VSt = Qp(BSt, [
    ["render", zSt]
]);
const GSt = {
        class: "left-card"
    },
    HSt = {
        class: "pie-chat"
    },
    WSt = {
        class: "pieCanvas-content"
    },
    XSt = {
        class: "pieCanvas-content-value"
    },
    YSt = {
        class: "pieCanvas-content-name"
    },
    qSt = {
        class: "pie-legend"
    },
    $St = {
        class: "name"
    },
    ZSt = {
        class: "value"
    },
    KSt = vt("span", {
        class: "unit"
    }, "亿", -1),
    jSt = {
        __name: "YearlyEconomyTrend",
        setup(r) {
            const t = wa(null),
                e = Nw({
                    pieDataColor: ["#17E6C3", "#40CFFF", "#1979FF", "#FFC472"],
                    pieData: [{
                        name: "类型1",
                        value: 400
                    }, {
                        name: "类型2",
                        value: 250
                    }, {
                        name: "类型3",
                        value: 200
                    }, {
                        name: "类型4",
                        value: 150
                    }]
                });

            function n(i) {
                return Number((i.data.value / i.data.count * 100).toFixed(2))
            }
            return (i, a) => (We(), Ke("div", GSt, [ye(ll, {
                title: "年度经济增长点"
            }, {
                default: tr(() => [vt("div", HSt, [ye(VSt, {
                    ref_key: "pie",
                    ref: t,
                    data: e.pieData,
                    delay: 3e3,
                    colors: e.pieDataColor,
                    opacity: .6,
                    class: "pieCanvas"
                }, {
                    default: tr(o => [vt("div", WSt, [vt("div", XSt, [ye(Ta(PT), {
                        startVal: 0,
                        endVal: n(o),
                        decimals: 2,
                        duration: 1e3,
                        autoplay: !0
                    }, null, 8, ["endVal"]), Co(" % ")]), vt("div", YSt, Qr(o.data.name), 1)])]),
                    _: 1
                }, 8, ["data", "colors"])]), vt("div", qSt, [(We(!0), Ke(uy, null, cy(e.pieData, (o, s) => (We(), Ke("div", {
                    class: "pie-legend-item",
                    key: s
                }, [vt("div", {
                    class: "icon",
                    style: Dd({
                        borderColor: e.pieDataColor[s]
                    })
                }, null, 4), vt("div", $St, Qr(o.name), 1), vt("div", ZSt, [Co(Qr(o.value), 1), KSt])]))), 128))])]),
                _: 1
            })]))
        }
    },
    QSt = {
        class: "left-card"
    },
    JSt = {
        __name: "EconomicTrendChart",
        setup(r) {
            const t = wa({
                title: {
                    text: "亿元",
                    left: "5%",
                    top: "8%",
                    textStyle: {
                        color: "#D3F8F2",
                        fontSize: 8
                    }
                },
                grid: {
                    left: "12%",
                    top: "25%",
                    width: "82%",
                    height: "55%"
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                        shadowStyle: {
                            opacity: .2
                        }
                    },
                    backgroundColor: "rgba(0,0,0,1)",
                    borderWidth: 1,
                    borderColor: "#999999",
                    textStyle: {
                        color: "#ffffff",
                        fontSize: 10
                    }
                },
                color: ["#6BC7F6"],
                xAxis: [{
                    type: "category",
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "#435459"
                        }
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !1
                    },
                    axisLabel: {
                        color: "#ffffff",
                        fontSize: 10,
                        interval: 1,
                        padding: [0, 0, 0, 0]
                    },
                    data: ["2023/04", "2023/05", "2023/06", "2023/07", "2023/08", "2023/09", "2023/10", "2023/11", "2023/12", "2024/01", "2024/02", "2024/03"]
                }, {
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "rgba(0,0,0,0)"
                        }
                    },
                    data: []
                }],
                yAxis: {
                    type: "value",
                    axisLine: {
                        show: !1
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !0,
                        lineStyle: {
                            type: [2, 2],
                            dashOffset: 5,
                            color: ["rgba(255, 255, 255, 1)"],
                            opacity: 1,
                            width: .3
                        }
                    },
                    axisLabel: {
                        color: "#8B9EA4",
                        fontSize: 9
                    }
                },
                series: [{
                    data: [500, 1e3, 300, 1300, 500, 1330, 620, 400, 700, 1300, 300, 1234],
                    type: "line",
                    smooth: !0,
                    symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAQ5JREFUOE+1la1OQ0EQRs8kCFIQdVCCxIBpCK1AInkDHC+B4QkwvASub4GsaE0NGCRpKhGFVDQZ+Mjem9vNbkphmWTMfjNnd3b2x0iYuxuwH7wNbIewBfAGzORm5nG6ElfM3QU6AXZSkzXG3oEnMxO8thWgux8DR2tAsfxiZs/VYA38Jazi1NBvYCizv+HK4vCRyrfQgIsf7Nm6+bSnjwIeAGeZaGnXQDfoE+ABmGbixwKeAoeJAMHuv3w30ubATQb6KqDKjZPEuAXOMysZAncJbS7gJbCVEAdAKwP8AK4S2vJfgMVLLt6UDtAreWx0W8od7OJXryq16OPwR2j6+WpAyz2wDagape7vARt9AZ+G3HmhiKS3xwAAAABJRU5ErkJggg==",
                    symbolSize: 10,
                    showSymbol: !1,
                    yAxisIndex: 0,
                    z: 0,
                    emphasis: {
                        focus: "none",
                        itemStyle: {
                            color: "white"
                        }
                    },
                    label: {
                        show: !0,
                        position: "top",
                        distance: 10,
                        color: "#ffffff",
                        fontSize: 10
                    },
                    lineStyle: {
                        shadowColor: "rgba(0, 0, 0, 0.4)",
                        shadowBlur: 3,
                        shadowOffsetY: 10,
                        width: 3,
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "rgba(115, 208, 255, 1)"
                        }, {
                            offset: 1,
                            color: "rgba(18,60,98,1)"
                        }])
                    },
                    areaStyle: {
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "rgba(25, 255, 236, 0.4)"
                        }, {
                            color: "rgba(51, 153, 255, 0)",
                            offset: 1
                        }])
                    }
                }]
            });
            return (e, n) => (We(), Ke("div", QSt, [ye(ll, {
                title: "近年经济情况"
            }, {
                default: tr(() => [ye(Ta(ic), {
                    ref: "vChart",
                    option: t.value,
                    autoresize: !0
                }, null, 8, ["option"])]),
                _: 1
            })]))
        }
    },
    tbt = {
        class: "left-card"
    },
    ebt = {
        __name: "DistrictEconomicIncome",
        setup(r) {
            const t = wa({
                title: {
                    text: "亿元",
                    left: "5%",
                    top: "8%",
                    textStyle: {
                        color: "#D3F8F2",
                        fontSize: 8
                    }
                },
                grid: {
                    left: "12%",
                    top: "25%",
                    width: "82%",
                    height: "55%"
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                        shadowStyle: {
                            opacity: .2
                        }
                    },
                    backgroundColor: "rgba(0,0,0,1)",
                    borderWidth: 1,
                    borderColor: "#999999",
                    textStyle: {
                        color: "#ffffff",
                        fontSize: 10
                    }
                },
                color: ["#6BC7F6"],
                xAxis: [{
                    type: "category",
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "#435459"
                        }
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !1
                    },
                    axisLabel: {
                        color: "#ffffff",
                        fontSize: 10,
                        interval: 0,
                        padding: [0, 0, 0, 0]
                    },
                    data: cfg.districts
                }, {
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "rgba(0,0,0,0)"
                        }
                    },
                    data: []
                }],
                yAxis: {
                    type: "value",
                    axisLine: {
                        show: !1
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !1
                    },
                    axisLabel: {
                        color: "#8B9EA4",
                        fontSize: 9
                    }
                },
                series: [{
                    name: "",
                    type: "pictorialBar",
                    symbol: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
                    label: {
                        show: !0,
                        position: "top",
                        distance: 10,
                        color: "#ffffff",
                        fontSize: 10
                    },
                    data: [{
                        value: 8e3,
                        itemStyle: {
                            color: new He(0, 0, 0, 1, [{
                                offset: 0,
                                color: "rgba(64, 175, 255, 1)"
                            }, {
                                offset: 1,
                                color: "rgba(64, 175, 255, 0.10)"
                            }])
                        }
                    }, {
                        value: 7500,
                        itemStyle: {
                            color: new He(0, 0, 0, 1, [{
                                offset: 0,
                                color: "rgba(25, 255, 198, 1)"
                            }, {
                                offset: 1,
                                color: "rgba(0, 204, 187, 0.10)"
                            }])
                        }
                    }, {
                        value: 6e3,
                        itemStyle: {
                            color: new He(0, 0, 0, 1, [{
                                offset: 0,
                                color: "rgba(64, 175, 255, 1)"
                            }, {
                                offset: 1,
                                color: "rgba(64, 175, 255, 0.10)"
                            }])
                        }
                    }, {
                        value: 5800,
                        itemStyle: {
                            color: new He(0, 0, 0, 1, [{
                                offset: 0,
                                color: "rgba(25, 255, 198, 1)"
                            }, {
                                offset: 1,
                                color: "rgba(0, 204, 187, 0.10)"
                            }])
                        }
                    }, {
                        value: 5e3,
                        itemStyle: {
                            color: new He(0, 0, 0, 1, [{
                                offset: 0,
                                color: "rgba(64, 175, 255, 1)"
                            }, {
                                offset: 1,
                                color: "rgba(64, 175, 255, 0.10)"
                            }])
                        }
                    }]
                }, {
                    name: "",
                    type: "custom",
                    z: 3,
                    xAxisIndex: 1,
                    renderItem: (e, n) => {
                        const i = n.value(0),
                            a = n.value(1),
                            o = n.coord([i, a]),
                            s = o[1];
                        return {
                            type: "image",
                            style: {
                                x: o[0] - 5,
                                y: s - 5,
                                width: 10,
                                height: 10,
                                image: "data:image/png;base64,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"
                            }
                        }
                    },
                    data: [8e3, 7500, 6e3, 5800, 5e3]
                }]
            });
            return (e, n) => (We(), Ke("div", tbt, [ye(ll, {
                title: "各区经济收益"
            }, {
                default: tr(() => [ye(Ta(ic), {
                    ref: "vChart",
                    option: t.value,
                    autoresize: !0
                }, null, 8, ["option"])]),
                _: 1
            })]))
        }
    },
    nbt = {
        class: "right-card"
    },
    rbt = {
        __name: "PurposeSpecialFunds",
        setup(r) {
            const t = wa({
                grid: {
                    left: "5%",
                    top: "10%",
                    width: "90%",
                    height: "86%"
                },
                legend: {
                    top: "8%",
                    icon: "circle",
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        color: "#90979c",
                        fontSize: 12,
                        lineHeight: 20
                    },
                    data: ["2022年", "2023年"]
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                        shadowStyle: {
                            opacity: .2
                        }
                    },
                    backgroundColor: "rgba(0,0,0,1)",
                    borderWidth: 1,
                    borderColor: "#999999",
                    textStyle: {
                        color: "#ffffff",
                        fontSize: 10,
                        lineHeight: 156
                    }
                },
                color: ["#6BC7F6", "#44E6A2"],
                xAxis: [{
                    type: "value",
                    interval: 0,
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "#407A80"
                        }
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !1
                    },
                    axisLabel: {
                        color: "#CFDAE6",
                        fontSize: 10,
                        interval: 0
                    }
                }],
                yAxis: [{
                    type: "category",
                    inverse: !0,
                    axisLabel: {
                        color: "#CFDAE6",
                        fontSize: 10,
                        interval: 0,
                        show: !1,
                        verticalAlign: "top"
                    },
                    axisLine: {
                        show: !1
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !1
                    },
                    data: ["扶贫资金", "医疗卫生", "渔业资金", "社区改造"]
                }, {
                    inverse: !0,
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "rgba(0,0,0,0)"
                        }
                    },
                    data: []
                }],
                color: ["rgba(115,208,255,1)", "rgba(77, 255, 181, 1)", "rgba(230, 230, 230, 1)", "rgba(255, 200, 89, 1)"],
                series: [{
                    data: [{
                        value: 100,
                        itemStyle: {
                            color: new He(0, 0, 1, 1, [{
                                offset: 0,
                                color: "rgba(3,65,128,1)"
                            }, {
                                offset: 1,
                                color: "rgba(115,208,255,1)"
                            }])
                        }
                    }, {
                        value: 80,
                        itemStyle: {
                            color: new He(0, 0, 1, 1, [{
                                offset: 0,
                                color: "rgba(11, 77, 44, 1)"
                            }, {
                                offset: 1,
                                color: "rgba(77, 255, 181, 1)"
                            }])
                        }
                    }, {
                        value: 60,
                        itemStyle: {
                            color: new He(0, 0, 1, 1, [{
                                offset: 0,
                                color: "rgba(117, 117, 117, 1)"
                            }, {
                                offset: 1,
                                color: "rgba(230, 230, 230, 1)"
                            }])
                        }
                    }, {
                        value: 50,
                        itemStyle: {
                            color: new He(0, 0, 1, 1, [{
                                offset: 0,
                                color: "rgba(153, 105, 38, 1)"
                            }, {
                                offset: 1,
                                color: "rgba(255, 200, 89, 1)"
                            }])
                        }
                    }],
                    type: "bar",
                    barWidth: 7,
                    yAxisIndex: 0,
                    showBackground: !1,
                    z: 2,
                    label: {
                        show: !0,
                        position: "middle",
                        padding: [-18, 0, 0, 0],
                        color: "#16C1A6",
                        fontSize: 12,
                        formatter: "{title|{b}}                                                                              {value|{c}}  {unit|万元}",
                        rich: {
                            title: {
                                color: "#FFFFFF",
                                fontSize: 10
                            },
                            value: {
                                fontSize: 10
                            },
                            unit: {
                                color: "#717477",
                                fontSize: 10
                            }
                        }
                    },
                    itemStyle: {
                        borderRadius: 0,
                        borderWidth: 2,
                        borderColor: "rgba(26, 57, 77,1)"
                    }
                }, {
                    name: "背景",
                    type: "bar",
                    yAxisIndex: 1,
                    barGap: "-100%",
                    data: [120, 120, 120, 120],
                    barWidth: 10,
                    z: 0,
                    itemStyle: {
                        normal: {
                            color: "none",
                            borderColor: "rgba(172,191,188,0.4)",
                            borderWidth: 1,
                            borderRadius: 0
                        }
                    }
                }]
            });
            return (e, n) => (We(), Ke("div", nbt, [ye(ll, {
                title: "专项资金用途"
            }, {
                default: tr(() => [ye(Ta(ic), {
                    ref: "vChart",
                    option: t.value,
                    autoresize: !0
                }, null, 8, ["option"])]),
                _: 1
            })]))
        }
    };
const ibt = {
        class: "right-card"
    },
    abt = {
        class: "population-proportion"
    },
    obt = {
        class: "population-proportion-chart"
    },
    sbt = vt("div", {
        class: "label-name"
    }, "消费占比", -1),
    lbt = {
        class: "pie-legend"
    },
    ubt = {
        class: "name"
    },
    cbt = {
        class: "value"
    },
    hbt = vt("span", {
        class: "unit"
    }, "%", -1),
    fbt = {
        __name: "ProportionPopulationConsumption",
        setup(r) {
            const t = Nw({
                    pieDataColor: ["#17E6C3", "#40CFFF", "#1979FF", "#FFC472"],
                    pieData: [{
                        name: "类型1",
                        value: 40
                    }, {
                        name: "类型2",
                        value: 25
                    }, {
                        name: "类型3",
                        value: 20
                    }, {
                        name: "类型4",
                        value: 15
                    }]
                }),
                e = wa({
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow",
                            shadowStyle: {
                                opacity: 0
                            }
                        },
                        backgroundColor: "rgba(0,0,0,1)",
                        borderWidth: 1,
                        borderColor: "#999999",
                        textStyle: {
                            color: "#ffffff",
                            fontSize: 10
                        }
                    },
                    series: [{
                        name: "",
                        type: "pie",
                        itemStyle: {
                            borderWidth: 5,
                            borderColor: "rgba(26, 57, 77,1)"
                        },
                        label: {
                            show: !1
                        },
                        radius: ["55%", "70%"],
                        hoverAnimation: !1,
                        color: ["#c487ee", "#deb140", "#49dff0", "#034079", "#6f81da", "#00ffb4"],
                        data: [{
                            value: 40,
                            name: "曲阜师范大学",
                            itemStyle: {
                                color: new He(0, 0, 1, 1, [{
                                    offset: 0,
                                    color: "rgba(3,65,128,1)"
                                }, {
                                    offset: 1,
                                    color: "rgba(115,208,255,1)"
                                }])
                            }
                        }, {
                            value: 25,
                            name: "潍坊学院",
                            itemStyle: {
                                color: new He(0, 0, 1, 1, [{
                                    offset: 0,
                                    color: "rgba(11, 77, 44, 1)"
                                }, {
                                    offset: 1,
                                    color: "rgba(77, 255, 181, 1)"
                                }])
                            }
                        }, {
                            value: 20,
                            name: "青岛职业技术学院",
                            itemStyle: {
                                color: new He(0, 0, 1, 1, [{
                                    offset: 0,
                                    color: "rgba(117, 117, 117, 1)"
                                }, {
                                    offset: 1,
                                    color: "rgba(230, 230, 230, 1)"
                                }])
                            }
                        }, {
                            value: 15,
                            name: "淄博师范高等专科",
                            itemStyle: {
                                color: new He(0, 0, 1, 1, [{
                                    offset: 0,
                                    color: "rgba(153, 105, 38, 1)"
                                }, {
                                    offset: 1,
                                    color: "rgba(255, 200, 89, 1)"
                                }])
                            }
                        }]
                    }]
                });
            return (n, i) => (We(), Ke("div", ibt, [ye(ll, {
                title: "人群消费占比"
            }, {
                default: tr(() => [vt("div", abt, [vt("div", obt, [ye(Ta(ic), {
                    ref: "vChart",
                    option: e.value,
                    autoresize: !0
                }, null, 8, ["option"]), sbt]), vt("div", lbt, [(We(!0), Ke(uy, null, cy(t.pieData, (a, o) => (We(), Ke("div", {
                    class: "pie-legend-item",
                    key: o
                }, [vt("div", {
                    class: "icon",
                    style: Dd({
                        borderColor: t.pieDataColor[o]
                    })
                }, null, 4), vt("div", ubt, Qr(a.name), 1), vt("div", cbt, [Co(Qr(a.value), 1), hbt])]))), 128))])])]),
                _: 1
            })]))
        }
    },
    dbt = {
        class: "right-card"
    },
    pbt = {
        __name: "ElectricityUsage",
        setup(r) {
            const t = wa({
                title: {
                    text: "万度",
                    left: "5%",
                    top: "8%",
                    textStyle: {
                        color: "#D3F8F2",
                        fontSize: 8
                    }
                },
                grid: {
                    left: "12%",
                    top: "25%",
                    width: "82%",
                    height: "55%"
                },
                legend: {
                    top: "4%",
                    icon: "circle",
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        color: "#90979c",
                        fontSize: 12,
                        lineHeight: 20
                    },
                    data: ["2022年", "2023年"]
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                        shadowStyle: {
                            opacity: .2
                        }
                    },
                    backgroundColor: "rgba(0,0,0,1)",
                    borderWidth: 1,
                    borderColor: "#999999",
                    textStyle: {
                        color: "#ffffff",
                        fontSize: 10,
                        lineHeight: 156
                    }
                },
                color: ["#6BC7F6", "#44E6A2"],
                xAxis: [{
                    type: "category",
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "#435459"
                        }
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !1
                    },
                    axisLabel: {
                        color: "#ffffff",
                        fontSize: 10,
                        interval: 1,
                        padding: [0, 0, 0, 0]
                    },
                    data: ["2023/04", "2023/05", "2023/06", "2023/07", "2023/08", "2023/09", "2023/10", "2023/11", "2023/12", "2024/01", "2024/02", "2024/03"]
                }, {
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "rgba(0,0,0,0)"
                        }
                    },
                    data: []
                }],
                yAxis: {
                    type: "value",
                    axisLine: {
                        show: !1
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !0,
                        lineStyle: {
                            type: [2, 2],
                            dashOffset: 5,
                            color: ["rgba(255, 255, 255, 1)"],
                            opacity: 1,
                            width: .3
                        }
                    },
                    axisLabel: {
                        color: "#8B9EA4",
                        fontSize: 9
                    }
                },
                series: [{
                    name: "2022年",
                    data: [1200, 700, 500, 700, 1300, 500, 200, 500, 1200, 700, 400, 1100],
                    type: "line",
                    smooth: !0,
                    symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAQ5JREFUOE+1la1OQ0EQRs8kCFIQdVCCxIBpCK1AInkDHC+B4QkwvASub4GsaE0NGCRpKhGFVDQZ+Mjem9vNbkphmWTMfjNnd3b2x0iYuxuwH7wNbIewBfAGzORm5nG6ElfM3QU6AXZSkzXG3oEnMxO8thWgux8DR2tAsfxiZs/VYA38Jazi1NBvYCizv+HK4vCRyrfQgIsf7Nm6+bSnjwIeAGeZaGnXQDfoE+ABmGbixwKeAoeJAMHuv3w30ubATQb6KqDKjZPEuAXOMysZAncJbS7gJbCVEAdAKwP8AK4S2vJfgMVLLt6UDtAreWx0W8od7OJXryq16OPwR2j6+WpAyz2wDagape7vARt9AZ+G3HmhiKS3xwAAAABJRU5ErkJggg==",
                    symbolSize: 10,
                    showSymbol: !1,
                    xAxisIndex: 1,
                    z: 3,
                    emphasis: {
                        focus: "none",
                        itemStyle: {
                            color: "white"
                        }
                    },
                    label: {
                        show: !0,
                        position: "top",
                        distance: 10,
                        color: "#ffffff",
                        fontSize: 8
                    },
                    lineStyle: {
                        shadowColor: "rgba(115, 208, 255, 1)",
                        shadowBlur: 20,
                        shadowOffsetY: 0,
                        width: 1,
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "rgba(115, 208, 255, 1)"
                        }, {
                            offset: 1,
                            color: "rgba(18,60,98,1)"
                        }])
                    }
                }, {
                    name: "2023年",
                    data: [500, 900, 1100, 600, 400, 600, 1300, 900, 700, 1e3, 500, 300],
                    type: "line",
                    smooth: !0,
                    symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAQ5JREFUOE+1la1OQ0EQRs8kCFIQdVCCxIBpCK1AInkDHC+B4QkwvASub4GsaE0NGCRpKhGFVDQZ+Mjem9vNbkphmWTMfjNnd3b2x0iYuxuwH7wNbIewBfAGzORm5nG6ElfM3QU6AXZSkzXG3oEnMxO8thWgux8DR2tAsfxiZs/VYA38Jazi1NBvYCizv+HK4vCRyrfQgIsf7Nm6+bSnjwIeAGeZaGnXQDfoE+ABmGbixwKeAoeJAMHuv3w30ubATQb6KqDKjZPEuAXOMysZAncJbS7gJbCVEAdAKwP8AK4S2vJfgMVLLt6UDtAreWx0W8od7OJXryq16OPwR2j6+WpAyz2wDagape7vARt9AZ+G3HmhiKS3xwAAAABJRU5ErkJggg==",
                    symbolSize: 10,
                    showSymbol: !1,
                    xAxisIndex: 1,
                    z: 0,
                    emphasis: {
                        focus: "none",
                        itemStyle: {
                            color: "white"
                        }
                    },
                    label: {
                        show: !0,
                        position: "top",
                        distance: 10,
                        color: "#ffffff",
                        fontSize: 8
                    },
                    lineStyle: {
                        shadowColor: "rgba(69, 233, 164, 1)",
                        shadowBlur: 20,
                        shadowOffsetY: 0,
                        width: 1,
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#45E9A4"
                        }, {
                            offset: 1,
                            color: "rgba(19,99,61,1)"
                        }])
                    },
                    areaStyle: {
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "rgba(25, 255, 236, 0.4)"
                        }, {
                            color: "rgba(51, 153, 255, 0)",
                            offset: 1
                        }])
                    }
                }, {
                    name: "2022年",
                    data: [1200, 700, 500, 700, 1300, 500, 200, 500, 1200, 700, 400, 1100],
                    type: "line",
                    smooth: !0,
                    symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAQ5JREFUOE+1la1OQ0EQRs8kCFIQdVCCxIBpCK1AInkDHC+B4QkwvASub4GsaE0NGCRpKhGFVDQZ+Mjem9vNbkphmWTMfjNnd3b2x0iYuxuwH7wNbIewBfAGzORm5nG6ElfM3QU6AXZSkzXG3oEnMxO8thWgux8DR2tAsfxiZs/VYA38Jazi1NBvYCizv+HK4vCRyrfQgIsf7Nm6+bSnjwIeAGeZaGnXQDfoE+ABmGbixwKeAoeJAMHuv3w30ubATQb6KqDKjZPEuAXOMysZAncJbS7gJbCVEAdAKwP8AK4S2vJfgMVLLt6UDtAreWx0W8od7OJXryq16OPwR2j6+WpAyz2wDagape7vARt9AZ+G3HmhiKS3xwAAAABJRU5ErkJggg==",
                    symbolSize: 10,
                    showSymbol: !1,
                    yAxisIndex: 0,
                    z: 0,
                    emphasis: {
                        focus: "none",
                        itemStyle: {
                            color: "white"
                        }
                    },
                    label: {
                        show: !0,
                        position: "top",
                        distance: 10,
                        color: "#ffffff",
                        fontSize: 8
                    },
                    lineStyle: {
                        shadowColor: "rgba(0, 0, 0, 0.4)",
                        shadowBlur: 3,
                        shadowOffsetY: 10,
                        width: 3,
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "rgba(115, 208, 255, 1)"
                        }, {
                            offset: 1,
                            color: "rgba(18,60,98,1)"
                        }])
                    },
                    areaStyle: {
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "rgba(25, 255, 236, 0.4)"
                        }, {
                            color: "rgba(51, 153, 255, 0)",
                            offset: 1
                        }])
                    }
                }, {
                    name: "2023年",
                    data: [500, 900, 1100, 600, 400, 600, 1300, 900, 700, 1e3, 500, 300],
                    type: "line",
                    smooth: !0,
                    symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAQ5JREFUOE+1la1OQ0EQRs8kCFIQdVCCxIBpCK1AInkDHC+B4QkwvASub4GsaE0NGCRpKhGFVDQZ+Mjem9vNbkphmWTMfjNnd3b2x0iYuxuwH7wNbIewBfAGzORm5nG6ElfM3QU6AXZSkzXG3oEnMxO8thWgux8DR2tAsfxiZs/VYA38Jazi1NBvYCizv+HK4vCRyrfQgIsf7Nm6+bSnjwIeAGeZaGnXQDfoE+ABmGbixwKeAoeJAMHuv3w30ubATQb6KqDKjZPEuAXOMysZAncJbS7gJbCVEAdAKwP8AK4S2vJfgMVLLt6UDtAreWx0W8od7OJXryq16OPwR2j6+WpAyz2wDagape7vARt9AZ+G3HmhiKS3xwAAAABJRU5ErkJggg==",
                    symbolSize: 10,
                    showSymbol: !1,
                    yAxisIndex: 0,
                    z: 0,
                    emphasis: {
                        focus: "none",
                        itemStyle: {
                            color: "white"
                        }
                    },
                    label: {
                        show: !0,
                        position: "top",
                        distance: 10,
                        color: "#ffffff",
                        fontSize: 8
                    },
                    lineStyle: {
                        shadowColor: "rgba(0, 0, 0, 0.4)",
                        shadowBlur: 3,
                        shadowOffsetY: 10,
                        width: 3,
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#44E6A2"
                        }, {
                            offset: 1,
                            color: "rgba(19,99,61,1)"
                        }])
                    },
                    areaStyle: {
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "rgba(25, 255, 236, 0.4)"
                        }, {
                            color: "rgba(51, 153, 255, 0)",
                            offset: 1
                        }])
                    }
                }]
            });
            return (e, n) => (We(), Ke("div", dbt, [ye(ll, {
                title: "用电情况"
            }, {
                default: tr(() => [ye(Ta(ic), {
                    ref: "vChart",
                    option: t.value,
                    autoresize: !0
                }, null, 8, ["option"])]),
                _: 1
            })]))
        }
    },
    vbt = {
        class: "right-card"
    },
    gbt = {
        __name: "QuarterlyGrowthSituation",
        setup(r) {
            const t = wa({
                title: {
                    text: "亿元",
                    left: "5%",
                    top: "8%",
                    textStyle: {
                        color: "#D3F8F2",
                        fontSize: 8
                    }
                },
                grid: {
                    left: "12%",
                    top: "25%",
                    width: "82%",
                    height: "55%"
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                        shadowStyle: {
                            opacity: 0
                        }
                    },
                    backgroundColor: "rgba(0,0,0,1)",
                    borderWidth: 1,
                    borderColor: "#999999",
                    textStyle: {
                        color: "#ffffff",
                        fontSize: 10
                    }
                },
                xAxis: [{
                    type: "category",
                    interval: 0,
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "#435459"
                        }
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !1
                    },
                    axisLabel: {
                        color: "#ffffff",
                        fontSize: 10,
                        interval: 0,
                        padding: [0, 0, 0, 0]
                    },
                    data: ["一季度", "二季度", "三季度", "四季度"]
                }, {
                    axisLine: {
                        show: !1,
                        lineStyle: {
                            color: "rgba(0,0,0,0)"
                        }
                    },
                    data: []
                }],
                yAxis: {
                    type: "value",
                    axisLine: {
                        show: !1
                    },
                    axisTick: {
                        show: !1
                    },
                    splitLine: {
                        show: !0,
                        lineStyle: {
                            type: [2, 2],
                            dashOffset: 5,
                            color: ["rgba(255, 255, 255, 1)"],
                            opacity: 1,
                            width: .3
                        }
                    },
                    axisLabel: {
                        color: "#8B9EA4",
                        fontSize: 9
                    }
                },
                series: [{
                    name: "类型1",
                    data: [100, 120, 130, 110],
                    type: "bar",
                    barWidth: 4,
                    label: {
                        show: !1
                    },
                    itemStyle: {
                        borderRadius: 0,
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#79EBCF"
                        }, {
                            offset: 1,
                            color: "#0B6360"
                        }])
                    }
                }, {
                    name: "类型2",
                    data: [60, 100, 150, 90],
                    type: "bar",
                    barWidth: 4,
                    barGap: 2,
                    label: {
                        show: !1
                    },
                    itemStyle: {
                        borderRadius: 0,
                        color: new He(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#40AEFE"
                        }, {
                            offset: 1,
                            color: "#25567A"
                        }])
                    }
                }]
            });
            return (e, n) => (We(), Ke("div", vbt, [ye(ll, {
                title: "各季度增长情况"
            }, {
                default: tr(() => [ye(Ta(ic), {
                    ref: "vChart",
                    option: t.value,
                    autoresize: !0
                }, null, 8, ["option"])]),
                _: 1
            })]))
        }
    },
    fB = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD0SURBVHgB7dEBDcAgEACxZ/5NTgkg40JaC137mgesf57wDSlCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTEHKbcBaYZyb5dAAAAAElFTkSuQmCC",
    mbt = "assets/pathLine2-d4134d4b.png",
    ybt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADzSURBVHgB7dEBDcAwDMCw9vw5f4MRTTYF73/NC3bnBd+QIiRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSMwBQCIExogIrTYAAAAASUVORK5CYII=",
    _bt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMxSURBVHgB7dZBDcJQFADBB/kCuHAgAQckHAA3Tf27aIXsjIjNXv7bfgyQdB0gSwAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgbN2erwGaHACECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCErfv7M0CTA4AwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCw9fj+BmhyABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABB2Amb1BS2MWc5zAAAAAElFTkSuQmCC",
    xbt = "assets/ocean-bg-8c848b8f.png",
    Abt = "assets/rotationBorder1-2ce8e0ef.png",
    Sbt = "assets/rotationBorder2-7496b968.png",
    bbt = "assets/chinaBlurLine-1a2cbc0f.png",
    dB = "data:image/png;base64,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",
    wbt = "data:image/png;base64,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",
    Tbt = "assets/huiguang-3c5dfda5.png",
    Mbt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgB7ddhbcMwEAXglyEoBEPoGARCIYTBymBhMAgrhDFoIZTBIATC21lxtGhdYieOW7u6T7L6x5HvfPXJBpRSSj0jko2MGqWTJL7tQMkkgSN/tSiRBG5cNQadjB1KI0GfeOsDJXHVmFKjFBLseSaRM0rg2q3PAbn7c8Cn2Dn5HnwJ7p3hWuSI/QHvFiRi5xrkhv+3W59P5ITz7danRi4YdsCn5NGOGdZufRo8kgSwi6zGIPoe9oI4bzIM4tkkjngExh3wqaoYrBRTkRbbslW5bzuWnTswnRorVFiB/dPVII1rVVWvWGjxX4t9qzRIZy9rpD34vH2+zrnIaN03dtj3+zXw27TPYvrvUxcXsMH8ZjRu7pw0z2JOt9sh+MU7GJCUwdZG1ejcwg03LP8oqa9RItvew9i325P7Tf6yY3/1GdbcQymllFJKKaUy9gO4eI9ILG1riwAAAABJRU5ErkJggg==",
    Ebt = "data:image/png;base64,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",
    Cbt = "assets/flyline6-525edf67.png",
    Lbt = "data:image/png;base64,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",
    Dbt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAD/CAMAAABb2Q/2AAAAsVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+3mHKcAAAAO3RSTlMABQoPExgdISgxJTYsQDtTRUr+9vpOWXJdaWVhgIx2om2n6oiWmYTKr5G68J22eqvBfeHZ5c++1LPdxUM4ZWUAAAZvSURBVGjerdrZdpswFAXQmnk0EMB4Ajwbz2Mc1///Yb0SuLg1km66mtfsdRBXRyIP+fH205IURZZa7794h7KqKZKEkrqFCgVpOSpOKoaJljZWOm1VwUnTRUv7/0sbvc62r2FlgJOy0o6x0kVL30NJiUh0ZkfHZuLXGWj/PTNArzPu68hMr4/MVEGqMlJaWNkDKWGukM4IK70uTipq3NVBthASMoWb1CJS644cIoG2OJDIQUYlm4KDH7mWxDJoKfX+3iSyooxEMqRSyhVlJFJp9YY2SGZoiyGZkMh+YtPRN4eWDqQCckSl1CoxIxKkQTMVSWp+pyeUQY4WbSqftuG9S+kkqWupitwkgdZSe5VSo5SeMgOpiaWqmfuVb1BZUUbkU6pyHdokJSJPs0AoZcjU7WRBMhWgQjnkSqmW2dB3ailx5HAW1FJqzJRLOd3Gjo6R7cVTym+y9aecbr1KCjLdae7hMt0090yupBAq/yLld1lHapa7WMVEElqNnimnr1JiS3+Rxqal8aVCZZp3+FJ+ylnRBalSyperA1IGM7ScFwNbIJXvSSOY3/u2QaTSIKVXudp2uVIupW7Eq3kHLetMmSu3RQ8p8/XoVQJtGieVu55A0lfXHY9m6iqhQpkg5fhNtljySKSGkPNxry2SKpGdec6VciUtIvtIOV5nbQekypLKUx4ep1rKHNk9PPZIWdRSEcmTi5KDYjl0HatZSn/IO1Kag/E9E0m1kkVSSlUg++Mic02UvD8WCKkbZn/3ORVLrZSLb0kdIdf06brGkspT9tZf6T9KiSmL25Aj5Ve5Bml8VyqNUn2u8zP1cfJ2mQmlRuToeJnRp2v/TdpE+jaVKk86IH8iZfJAy/UjRcrdkUhLIC0iH1j5uMwDnFyec7TcBrYjkDrIrJI6RuYYaYK8YqRh2vvP61gkNSpPy69t0EbI9pDK+iDx5GUbU6kJ5OIyKQKc/LnZ4TKnZ5R0zHZ63qxxmatreItdkbQM011NwqPHk1WVcJIWxJ2dJzuQDl5aukjOr5O159oYOYmWT6ny5Sb6xMktSkI9fSp9jMw30VcHpCGW4QeRpki2vyM34bITtHmSFqSSPkaO8TKMvujT4WZiSZ3IYBx+XLoI6WKljZVOJQccqbxJhyeNSv4cBLRMfBnDPD8HMVIuqTQwmRjpx7BHF5GkVYoP8EZ9DyG9UkJBOdJ6le3/JB2okleA7OFlWVBmQ0C6IDfhF5UOS2oaLUjnXkqXJ+kWUTnCyTA6j7qwSSxJBw+yew8/zgmVhqaxpe91d7XUEXIQ+zRTZUnYokEpq41XBPKaVZKb2aeSbDxb0hukAzK8iCSMs5J72CS+hMzeGuSJSJsnYfAgP64nsp0Mqfwhh1Q6fDkqZTcWy1v4McHIAZWLpC5Tk4QqeThJNzP5jgzPC6iISPaTI8gpXxovstx4kYR1iiUUJDtGONnLHiDTPU/qpdx/W9KCsiQUuTuicnXqieWJyqFIxiCXYXRd0YIypUPlcBmGRMJHli+TWvIzB8liCeucLWiV2dKv5Ga2SKjUm6RGpFfJOZRJIPsZXk5LmdF7kSVJ6fbTz0p6bGnWcgu140lakPQzjCbbVCxPIEOBtF5kXhaUKeH2HA1XX7DOfLXvYeWJL6EgtewEzVKt5GJG5LiqcrM0XuWsklqjpKWjMgQ5EshsSjMPAul7IOdfUbQ5zKHKIC2uvEThBGTCl1C6LchNQWTMlynIj7DYTkG6PLmv5YAre/vVU2YCeVrlP4nMsfKep3A8GFIH2flL2oxMUuThbFzJfZ8ldQfkiMpos8tXWDkm0ufJxfwpT0J5OMM61wcoPUiDKRMiP4ic8WU3mW6pvEFBhbI4RyALjLxSOYfSs2VM5P0KTz9CQblykKQ5kdHxLpIZkVEUVrLNkC6VOyIf9y3IgCHNV7mD0nPlfjXekXUudzkcJLb0+iDXE5ycVXItkqdapgypUNk7zQ63/y2Hv+U4zVjSKmVxm8A8P29COS+Ov+WgUcog/VouK+nwJawTl0nlmitdpNRrWc8TLW2OpJOvukROh6pITZ33+q8STodpNUgFZFz2k3SenCPPfZctkOT+pKeDyCO5Q0CW/3vyJu3qZgC5Jrdi7Dram6xGT+9kuEOie135Ur4dOfLlOoOsLjCr/rzXki6U/nVBvkf0c1Qu809Z9w4+8GeYUnrqkWm+LvMXnJRTlwruvBIAAAAASUVORK5CYII=",
    Pbt = "assets/focus_bg-b6803e2d.png",
    Rbt = "data:image/png;base64,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",
    Ibt = "assets/focus_move_bg-cf41417a.png";
class Obt {
    constructor() {
        this.init()
    }
    init() {
        this.instance = new T$, this.instance.addLoader(lp, "FileLoader");
        let t = "./",
            e = [{
                type: "Texture",
                name: "flyline",
                path: fB
            }, {
                type: "Texture",
                name: "pathLine",
                path: fB
            }, {
                type: "Texture",
                name: "pathLine2",
                path: ybt
            }, {
                type: "Texture",
                name: "pathLine3",
                path: mbt
            }, {
                type: "File",
                name: "china",
                path: t + cfg.map.geojson.china
            }, {
                type: "File",
                name: "mapJson",
                path: t + cfg.map.geojson.prefectures
            }, {
                type: "File",
                name: "mapStroke",
                path: t + cfg.map.geojson.outline
            }, {
                type: "Texture",
                name: "huiguang",
                path: Tbt
            }, {
                type: "Texture",
                name: "rotationBorder1",
                path: Abt
            }, {
                type: "Texture",
                name: "rotationBorder2",
                path: Sbt
            }, {
                type: "Texture",
                name: "guangquan1",
                path: dB
            }, {
                type: "Texture",
                name: "guangquan2",
                path: wbt
            }, {
                type: "Texture",
                name: "chinaBlurLine",
                path: bbt
            }, {
                type: "Texture",
                name: "ocean",
                path: xbt
            }, {
                type: "Texture",
                name: "side",
                path: _bt
            }, {
                type: "Texture",
                name: "flyLineFocus",
                path: dB
            }, {
                type: "Texture",
                name: "mapFlyline",
                path: Cbt
            }, {
                type: "Texture",
                name: "arrow",
                path: Mbt
            }, {
                type: "Texture",
                name: "point",
                path: Ebt
            }, {
                type: "Texture",
                name: "focusArrows",
                path: Lbt
            }, {
                type: "Texture",
                name: "focusBar",
                path: Dbt
            }, {
                type: "Texture",
                name: "focusBg",
                path: Pbt
            }, {
                type: "Texture",
                name: "focusMidQuan",
                path: Rbt
            }, {
                type: "Texture",
                name: "focusMoveBg",
                path: Ibt
            }];
        this.instance.loadAll(e)
    }
}
let ZA = null,
    qp = "",
    Pw = "",
    Rw = "",
    KA = null,
    pB = null,
    Xr = 1,
    ph = !1;
const WH = {
    isAutofitRunnig: !1,
    init(r = {}, t = !0) {
        t && console.log("autofit.js is running");
        const {
            dw: e = 1920,
            dh: n = 1080,
            el: i = typeof r == "string" ? r : "body",
            resize: a = !0,
            ignore: o = [],
            transition: s = "none",
            delay: l = 0,
            limit: u = .1
        } = r;
        ZA = i;
        let c = document.querySelector(i);
        if (!c) {
            console.error(`autofit: '${i}' is not exist`);
            return
        }
        const h = document.createElement("style"),
            f = document.createElement("style");
        h.lang = "text/css", f.lang = "text/css", h.id = "autofit-style", f.id = "ignoreStyle", h.innerHTML = "body {overflow: hidden;}";
        const d = document.querySelector("body");
        d.appendChild(h), d.appendChild(f), c.style.height = `${n}px`, c.style.width = `${e}px`, c.style.transformOrigin = "0 0", c.style.overflow = "hidden", jA(e, n, c, o, u), KA = () => {
            clearTimeout(pB), l != 0 ? pB = setTimeout(() => {
                jA(e, n, c, o, u), ph && vB(qp, Rw, Pw)
            }, l) : (jA(e, n, c, o, u), ph && vB(qp, Rw, Pw))
        }, a && window.addEventListener("resize", KA), this.isAutofitRunnig = !0, setTimeout(() => {
            c.style.transition = `${s}s`
        })
    },
    off(r = "body") {
        try {
            ph = !1, window.removeEventListener("resize", KA), document.querySelector("#autofit-style").remove();
            const t = document.querySelector("#ignoreStyle");
            t && t.remove(), document.querySelector(ZA || r).style = "", ph && Nbt()
        } catch (t) {
            console.error("autofit: Failed to remove normally", t), this.isAutofitRunnig = !1
        }
        this.isAutofitRunnig && console.log("autofit.js is off")
    }
};

function vB(r, t = !0, e = 1) {
    WH.isAutofitRunnig || console.error("autofit.js：autofit has not been initialized yet"), !r && console.error(`autofit.js：bad selector: ${r}`), qp = r, Pw = e, Rw = t;
    const n = document.querySelectorAll(r);
    if (n.length == 0) {
        console.error("autofit.js：elRectification found no element");
        return
    }
    for (let i of n) {
        let a = Xr == 1 ? 1 : Xr * e;
        ph || (i.originalWidth = i.clientWidth, i.originalHeight = i.clientHeight), t ? (i.style.width = `${i.originalWidth*a}px`, i.style.height = `${i.originalHeight*a}px`) : (i.style.width = `${100*a}%`, i.style.height = `${100*a}%`), i.style.transform = `scale(${1/Xr})`, i.style.transformOrigin = "0 0"
    }
    ph = !0
}

function Nbt() {
    if (qp)
        for (let r of document.querySelectorAll(qp)) r.style.width = "", r.style.height = "", r.style.transform = ""
}

function jA(r, t, e, n, i) {
    let a = document.documentElement.clientHeight,
        o = document.documentElement.clientWidth;
    Xr = o / a < r / t ? o / r : a / t, Xr = Math.abs(1 - Xr) > i ? Xr.toFixed(2) : 1;
    let s = Math.round(a / Xr),
        l = Math.round(o / Xr);
    e.style.height = `${s}px`, e.style.width = `${l}px`, e.style.transform = `scale(${Xr})`;
    const u = document.querySelector("#ignoreStyle");
    u.innerHTML = "";
    for (let c of n) {
        let h = c.el || c.dom;
        if (typeof c == "string" && (h = c), !h) {
            console.error(`autofit: bad selector: ${h}`);
            continue
        }
        let f = c.scale ? c.scale : 1 / Xr,
            d = f != Xr ? c.fontSize : "autofit",
            p = f != Xr ? c.width : "autofit",
            g = f != Xr ? c.height : "autofit";
        new RegExp(`${h}( |{)`, "gm").test(u.innerHTML) || (u.innerHTML += `
${h} { 
      transform: scale(${f})!important;
      transform-origin: 0 0;
      width: ${p}!important;
      height: ${g}!important;
    }`, d && (u.innerHTML += `
${h} div ,${h} span,${h} a,${h} * {
        font-size: ${d}px;
      }`))
    }
}
const Bbt = {
        class: "large-screen"
    },
    kbt = {
        class: "large-screen-wrap",
        id: "large-screen"
    },
    Fbt = vt("div", {
        class: "m-header-weather"
    }, [vt("span", null, "小雨"), vt("span", null, "27℃")], -1),
    Ubt = vt("div", {
        class: "m-header-date"
    }, [vt("span", null, "2023-10-12"), vt("span", null, "17:53:16")], -1),
    zbt = {
        class: "top-menu"
    },
    Vbt = vt("div", {
        class: "top-menu-mid-space"
    }, null, -1),
    Gbt = {
        class: "top-count-card"
    },
    Hbt = {
        class: "left-wrap"
    },
    Wbt = {
        class: "left-wrap-3d"
    },
    Xbt = {
        class: "right-wrap"
    },
    Ybt = {
        class: "right-wrap-3d"
    },
    qbt = {
        class: "bottom-tray"
    },
    $bt = $p('<div class="bottom-tray-arrow"><img src="' + tC + '" alt=""><img src="' + eC + '" alt=""></div><div class="bottom-menu"><div class="bottom-menu-item is-active"><span>人口概览</span></div><div class="bottom-menu-item"><span>小标题</span></div><div class="bottom-menu-item"><span>小标题</span></div><div class="bottom-menu-item"><span>小标题</span></div></div><div class="bottom-tray-arrow is-reverse"><img src="' + tC + '" alt=""><img src="' + eC + '" alt=""></div>', 3),
    Zbt = {
        class: "bottom-radar"
    },
    Kbt = vt("div", {
        class: "large-screen-left-zsline"
    }, null, -1),
    jbt = vt("div", {
        class: "large-screen-right-zsline"
    }, null, -1),
    Qbt = {
        class: "loading"
    },
    Jbt = $p('<div class="loading-text"><span style="--index:1;">L</span><span style="--index:2;">O</span><span style="--index:3;">A</span><span style="--index:4;">D</span><span style="--index:5;">I</span><span style="--index:6;">N</span><span style="--index:7;">G</span></div>', 1),
    twt = {
        class: "loading-progress"
    },
    ewt = {
        class: "value"
    },
    nwt = vt("span", {
        class: "unit"
    }, "%", -1),
    dwt = {
        __name: "index",
        setup(r) {
            const t = fd(null),
                e = wa(null),
                n = Nw({
                    progress: 0,
                    activeIndex: "1",
                    totalView: cfg.site.kpi
                });
            Ow(() => {
                h0.$on("mapPlayComplete", s), t.value = WH.init({
                    dh: 1080,
                    dw: 1920,
                    el: "#large-screen",
                    resize: !0
                }), i(async () => {
                    h0.$emit("loadMap", t.value), setTimeout(async () => {
                        await a(), e.value.play()
                    }, 1e3)
                })
            }), mB(() => {});

            function i(l) {
                t.value = new Obt;
                let u = {
                    progress: 0
                };
                t.value.instance.on("onProgress", (c, h, f) => {
                    let d = Math.floor(h / f) * 100;
                    Fn.to(u, {
                        progress: d,
                        onUpdate: () => {
                            n.progress = Math.floor(u.progress)
                        }
                    })
                }), t.value.instance.on("onLoad", () => {
                    l && l()
                })
            }
            async function a() {
                return new Promise((l, u) => {
                    let c = Fn.timeline();
                    c.to(".loading-text span", {
                        y: "200%",
                        opacity: 0,
                        ease: "power4.inOut",
                        duration: 2,
                        stagger: .2
                    }), c.to(".loading-progress", {
                        opacity: 0,
                        ease: "power4.inOut",
                        duration: 2
                    }, "<"), c.to(".loading", {
                        opacity: 0,
                        ease: "power4.inOut",
                        onComplete: () => {
                            l()
                        }
                    }, "-=1")
                })
            }

            function o(l) {
                console.log(l), n.activeIndex = l
            }

            function s() {
                let l = Fn.timeline({
                        paused: !1
                    }),
                    u = Fn.utils.toArray(".left-card"),
                    c = Fn.utils.toArray(".right-card"),
                    h = Fn.utils.toArray(".count-card");
                l.addLabel("start", .5), l.addLabel("menu", .5), l.addLabel("card", 1), l.addLabel("countCard", 3), l.to(".m-header", {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power4.out"
                }, "start"), l.to(".bottom-tray", {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power4.out"
                }, "start"), l.to(".top-menu", {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power4.out"
                }, "-=1"), l.to(".bottom-radar", {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power4.out"
                }, "-=2"), l.to(u, {
                    x: 0,
                    opacity: 1,
                    stagger: .2,
                    duration: 1.5,
                    ease: "power4.out"
                }, "card"), l.to(c, {
                    x: 0,
                    opacity: 1,
                    stagger: .2,
                    duration: 1.5,
                    ease: "power4.out"
                }, "card"), l.to(h, {
                    y: 0,
                    opacity: 1,
                    stagger: .2,
                    duration: 1.5,
                    ease: "power4.out"
                }, "card"), setTimeout(() => setupCardFocus(Fn), 3200)
            }
            return (l, u) => (We(), Ke("div", Bbt, [ye(ej, {
                ref_key: "mapSceneRef",
                ref: e
            }, null, 512), vt("div", kbt, [ye(pQ, {
                title: cfg.site.title,
                "sub-text": cfg.site.subTitle
            }, {
                left: tr(() => [Fbt]),
                right: tr(() => [Ubt]),
                _: 1
            }), vt("div", zbt, [ye(CQ, {
                "default-active": n.activeIndex,
                onSelect: o
            }, {
                default: tr(() => [ye(Lc, {
                    index: "1"
                }, {
                    default: tr(() => [Co("经济概览")]),
                    _: 1
                }), ye(Lc, {
                    index: "2"
                }, {
                    default: tr(() => [Co("导航栏")]),
                    _: 1
                }), ye(Lc, {
                    index: "3"
                }, {
                    default: tr(() => [Co("导航栏")]),
                    _: 1
                }), Vbt, ye(Lc, {
                    index: "4"
                }, {
                    default: tr(() => [Co("导航栏")]),
                    _: 1
                }), ye(Lc, {
                    index: "5"
                }, {
                    default: tr(() => [Co("导航栏")]),
                    _: 1
                }), ye(Lc, {
                    index: "6"
                }, {
                    default: tr(() => [Co("导航栏")]),
                    _: 1
                })]),
                _: 1
            }, 8, ["default-active"])]), vt("div", Gbt, [(We(!0), Ke(uy, null, cy(n.totalView, (c, h) => (We(), n6(MQ, {
                info: c,
                key: h
            }, null, 8, ["info"]))), 128))]), vt("div", Hbt, [vt("div", Wbt, [ye(RSt), ye(jSt), ye(JSt), ye(ebt)])]), vt("div", Xbt, [vt("div", Ybt, [ye(rbt), ye(fbt), ye(pbt), ye(gbt)])]), vt("div", qbt, [ye(f0, {
                class: "bottom-svg-line-left",
                width: 721,
                height: 57,
                color: "#30DCFF",
                strokeWidth: 2,
                dir: [0, 1],
                length: 50,
                path: "M1 56.6105C1 31.5123 185.586 10.0503 451.904 1.35519C458.942 1.12543 465.781 4.00883 470.505 9.22964L484.991 25.2383C487.971 28.4775 492.938 30.4201 498.254 30.4201H720.142"
            }), ye(f0, {
                class: "bottom-svg-line-left bottom-svg-line-right",
                width: 721,
                height: 57,
                color: "#30DCFF",
                strokeWidth: 2,
                dir: [0, 1],
                length: 50,
                path: "M1 56.6105C1 31.5123 185.586 10.0503 451.904 1.35519C458.942 1.12543 465.781 4.00883 470.505 9.22964L484.991 25.2383C487.971 28.4775 492.938 30.4201 498.254 30.4201H720.142"
            }), $bt]), vt("div", Zbt, [ye(kQ)]), Kbt, jbt]), vt("div", Qbt, [Jbt, vt("div", twt, [vt("span", ewt, Qr(n.progress), 1), nwt])])]))
        }
    };
export {
    dwt as
    default
};