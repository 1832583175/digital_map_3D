# 新疆数据可视化大屏（Vite 工程版）

基于 Three.js + ECharts + GSAP 的三维地图数据可视化大屏。
本项目已从"打包产物"重构为**标准 Vite 工程**，可以直接 `npm run dev` 二开。

---

## 一、快速开始

```bash
npm install     # 首次：安装 vite（只需一次，装过的可跳过）
npm run dev     # 开发：http://localhost:8080  改代码实时热更新
npm run build   # 打包：输出到 dist/
npm run preview # 预览打包结果：http://localhost:8081
```

> 页面打开后约有 5 秒入场动画，播完左右面板才滑入，属正常现象。

## 二、目录结构（二开看这里）

```
xinjiang-dashboard/
├── index.html                 入口 HTML（挂载点 #app）
├── vite.config.js             Vite 配置（端口/base/打包目录）
├── public/                    静态资源（原样拷贝，改了立即生效）
│   ├── assets/                贴图、SVG 装饰
│   │   └── json/              地图边界 geojson（中国/新疆）
│   └── draco/gltf/            3D 解码器
└── src/
    ├── main.js                应用入口：createApp + 路由
    ├── App.js                 根组件（只有 <router-view/>）
    ├── router/index.js        ★ 路由表（想改 /gdMap 路径改这里）
    ├── runtime/vue.js         框架运行时（Vue3+vue-router，一般不动）
    ├── styles/                全部样式
    │   ├── base.css           全局/框架样式
    │   └── page.css           大屏页面样式
    ├── config/                ★★★ 业务配置（90% 的改动在这里）
    │   ├── index.js           汇总出口
    │   ├── site.js            标题 / 副标题 / 顶部 KPI 卡片
    │   ├── map.js             投影中心 / 缩放 / 飞线中心 / 中央大字 / geojson 路径
    │   ├── cities.js          地图立体柱数据（24 地州市）
    │   ├── points.js          散点 + 信息监测点
    │   ├── districts.js       左下角区县柱状图分类
    │   ├── performance.js     渲染性能开关（卡顿就调这里）
    │   └── api.js             后端数据源地址（不开后端可无视）
    ├── services/
    │   └── live.js            后端数据接入：启动拉取 + SSE 实时推送
    ├── interactions/
    │   └── cardFocus.js       左右卡片悬浮聚焦交互（正面/放大/光效）
    └── views/gd-map/
        ├── index.js           ★ 页面组件：布局 + 全部图表配置（约 2100 行）
        └── engine.js          三维引擎层（Three.js 场景/基础组件，一般不动）
```

另有独立数据后端 `server/`（零依赖，`npm run api` 启动，带网页版数据控制台），
详见 **`docs/后端接入指南.md`**。

**分层原则**：`config/` 是数据 → `views/gd-map/index.js` 是图表与布局 → `engine.js` 是渲染引擎。
改数字、改文字、换省份 → 只碰 `config/`；调图表样式 → `index.js`；动 3D 效果 → 才去 `engine.js`。

## 三、常见修改示例

### 1. 改标题 / KPI 数字
`src/config/site.js`：
```js
title: '新疆维吾尔自治区数据可视化平台',
kpi: [{ zh: '2024年生产总值', value: 20534, unit: '亿元', ... }]
```

### 2. 改柱状图数据
`src/config/cities.js`：每项 `{ name, enName, center, centroid, value }`。
`name` 必须与 geojson 中的地名**完全一致**，否则柱子落不到对应城市。

### 3. 改图表样式（颜色、字号、系列）
`src/views/gd-map/index.js`：每个面板是一个组件（`__name` 标明了用途，
如 `BulkCommoditySalesChart`、`DistrictEconomicIncome`、`ElectricityUsage`），
ECharts option 就写在对应组件的 `setup()` 里。

### 4. 换省份（三步）
1. 下载边界数据：`https://geo.datav.aliyun.com/areas_v3/bound/{adcode}_full.json`
   存入 `public/assets/json/`，并在 `config/map.js` 更新 geojson 文件名；
2. `config/map.js`：重新计算 `projectionCenter`（省份经纬度中心）与
   `projectionScale`（控制地图大小），`flyLineCenter` 填省会坐标；
3. `config/cities.js` / `points.js` / `districts.js`：换成新省份的城市与数据。

### 5. 改路由地址
`src/router/index.js` 里把 `path: '/gdMap'` 改掉即可（两处：redirect 与 path）。

### 6. 卡片悬浮效果（科技感）
鼠标悬浮任意左右卡片：卡片沿 Z 轴探出、转正面向镜头、放大，四角亮起光标 +
扫描光 + 边缘霓虹，同侧其余卡片自动压暗。实现位置：
- 交互逻辑：`src/interactions/cardFocus.js`（GSAP 补间）
- 光效样式：`src/styles/cards.css`（纯 CSS 动画，零 JS 开销）
- 弹出幅度：改 `cardFocus.js` 里的 `popZ` / `inward`；颜色改 `cards.css` 顶部的 `--fx`

### 7. 接后端推送数据（不改代码）
```bash
npm run api        # 启动数据后端（零依赖）
# 打开 http://localhost:8787/ 就能在网页上改数据、一键推送
```
大屏启动时自动连接 localhost:8787；完整接口说明与部署连法见
**`docs/后端接入指南.md`**。不开后端时一切照旧。

### 8. 卡顿调优（不吃画质）
`src/config/performance.js`：
```js
pixelRatio: 1,     // 原版硬编码 2：1080p 窗口实际渲染 3840×2160（830 万像素/帧）
antialias: true,   // 抗锯齿
```
改成 `pixelRatio: 1` 后每帧像素量降为原来的 **1/4**，核显轻薄本帧率提升非常明显，肉眼几乎看不出画质差别。

## 四、运行方式怎么选

| 场景 | 用什么 | 说明 |
|---|---|---|
| 改代码 | `npm run dev` | 热更新，但每次启动要处理 2.8MB 引擎文件，稍慢属正常 |
| 只看效果 / 演示 | `npm run start` | 先 build 再本地预览，加载和渲染都比 dev 流畅 |
| 部署给别人看 | `npm run build` | `dist/` 是纯静态文件，扔到任何静态托管即可 |

## 五、免费部署（不用买服务器）

`npm run build` 产物是纯静态文件，以下方案全部 **0 成本**：

- **Cloudflare Pages**：免费、国内可直连、自带 CDN。创建项目 → 构建命令 `npm run build` → 输出目录 `dist`
- **GitHub Pages**：仓库已内置 `.github/workflows/deploy.yml`，push 到 `main` 就自动 build + 上线，**零手动操作**。手把手步骤见 [`docs/GitHub自动部署指南.md`](docs/GitHub自动部署指南.md)（注意：国内访问 `github.io` 偏慢，且免费版要求仓库必须 public）
- **Netlify Drop**：最省事，把 `dist` 文件夹直接拖进网页就上线
- **腾讯云 COS**：国内速度最好，一年几块钱。**注意 2024 年后新建的桶默认域名会强制下载文件、必须绑已备案的自定义域名**——完整手把手流程（含坑位清单、费用估算、命令行上传）见 [`docs/COS部署指南.md`](docs/COS部署指南.md)
- **国内正式上线（COS + 备案域名）**：含买域名/买备案服务器/ICP 备案/公安备案全流程、真实费用与时间线、页脚备案号挂法，见 [`docs/COS+备案完整方案.md`](docs/COS+备案完整方案.md)。`index.html` 已预置左下角备案号占位（默认隐藏）

## 六、引擎层速查（engine.js 里的压缩变量对照）

| 变量 | 含义 | 变量 | 含义 |
|---|---|---|---|
| `vt` | createElementVNode | `ye` | createVNode |
| `We` / `Ke` | openBlock / createElementBlock | `Co` | createTextVNode |
| `Qr` | toDisplayString | `tr` | withCtx |
| `Qp` | defineComponent | `uy` / `cy` | Fragment / renderList |
| `wa` / `fd` / `Nw` | ref / shallowRef / reactive | `Ow` / `mB` | onMounted / onUnmounted |
| `Fn` | gsap | `n6` | createBlock |

三维场景主类是 `$K`（约 26970 行起），投影与标签配置已接到 `cfg.map`。

## 七、注意事项

- **Vue 运行时在 `src/runtime/vue.js` 里**（原项目打包时内联），没有从 npm 安装
  `vue` 依赖。**不要**再 `npm i vue` 并在业务代码里 import 它——会出现两份 Vue
  实例导致渲染异常。需要 Vue API 时从 `runtime/vue.js` 导入。
- 打包时控制台会提示若干 `assets/bg-3acb94e3.png ... didn't resolve` 警告：
  这些 13 张图在**原站上就不存在**（404），不影响使用。
- `public/assets/json/广东省*.json` 是原版残留，可删可留。
