# 新疆数据可视化大屏（Three.js）

基于 `sayhello8/VisualTemplate` 的二开版本：把原来的**广东省**三维地图换成了**新疆维吾尔自治区**，并移除了原项目自带的二维码广告。

---

## 一、怎么运行（三步）

> ⚠️ 必须用本地 HTTP 服务打开，**直接双击 index.html 会白屏**（浏览器禁止 `file://` 协议下加载 ES Module 和 fetch 数据）。

### 方式 A：一键启动（推荐，Windows）

双击目录里的 **`启动大屏.bat`**，浏览器会自动打开
`http://localhost:8080/index.html#/gdMap`

关掉黑色命令行窗口即停止服务。

### 方式 B：手动起服务

在**本目录**（能看到 index.html 的那一层）打开命令行，任选一条：

```bash
# 有 Python（3.7+）
python -m http.server 8080

# 有 Node.js
npx http-server -p 8080 -c-1

# macOS / Linux 有 Python3
python3 -m http.server 8080
```

然后浏览器访问：

```
http://localhost:8080/index.html#/gdMap
```

### 方式 C：用 VS Code

装 **Live Server** 插件 → 右键 `index.html` → Open with Live Server。

---

## 二、打开后是什么

- 顶部：新疆维吾尔自治区数据可视化平台
- 中间：新疆 24 个地州市的 3D 地图，带立体柱状图（Top7 人口）、飞线、散点、监测点、旋转光环
- 左右：各类 ECharts 图表面板
- 页面加载后有约 5 秒的入场动画，动画结束面板才会滑入，属正常现象

低配电脑/无独显时 WebGL 可能较卡，入场动画会变慢。

---

## 三、目录结构

```
VisualTemplate-Xinjiang/
├── 启动大屏.bat              # Windows 一键启动
├── index.html                # 入口页
├── vite.svg
├── assets/
│   ├── index-b6e4f5db.js     # 入口 bundle（Vue 运行时 + App 组件）
│   ├── index-361e7662.js     # 主页面 bundle（Three.js 场景 + 所有业务代码）
│   ├── index-10b50214.css
│   ├── index-3dd937ec.css
│   ├── json/
│   │   ├── 新疆-地州.json     # 新疆 24 个地州市边界（DataV 数据）
│   │   ├── 新疆-轮廓.json     # 新疆整体轮廓
│   │   └── 中华人民共和国.json # 全国底图
│   └── *.png / *.svg          # 光环、雷达、扫光、边框等特效贴图
├── draco/gltf/                # Three.js Draco 解码器
├── tools/
│   ├── patch_xinjiang.py      # 广东 → 新疆 的改动补丁（22 处，可重跑）
│   └── patch_remove_ads.py    # 移除二维码广告 + 反调试
└── backup/                    # 改造前的原始 bundle，可回滚
```

---

## 四、这个版本改了什么

### 1. 广东 → 新疆

| 项目 | 原值（广东） | 现值（新疆） |
|---|---|---|
| 投影中心 | `[113.280637, 23.125178]` | `[84.946334, 42.188608]` |
| 投影缩放 | `120` | `38` |
| 飞线中心 | 广州 | 乌鲁木齐 `[87.617733, 43.792818]` |
| 地图数据 | 21 个地市 | 24 个地州市 |
| 柱状图数据 | 广东各市（万人） | 新疆各地州人口（万人） |
| KPI | GDP 31510 亿元 / 15000 万人 | GDP 20534 亿元 / 2598 万人 |
| 左下区县图 | 南山、天河、福田… | 天山区、沙依巴克区、新市区… |

缩放值 38 是算出来的：新疆投影后宽 15.17、高 13.29，和广东原来的 15.79 × 12.06 基本一致，所以**光环大小、相机动画、网格背景都不用改**。

### 2. 去广告

- 删除右下角二维码悬浮广告（含「购买/源码」按钮、二维码卡片、文案）
- 删除广告里夹带的反调试代码（禁右键 / 屏蔽 F12 / `debugger` 死循环），现在可以正常打开 DevTools
- 删除二维码图片资源，清理死代码

---

## 五、想再改（换成别的省 / 改数据）

### 换成其他省份

1. **下边界数据**：阿里 DataV，把 `{adcode}` 换成目标省编码
   - 地级市数据：`https://geo.datav.aliyun.com/areas_v3/bound/650000_full.json`
   - 省轮廓：`https://geo.datav.aliyun.com/areas_v3/bound/650000.json`
   - （650000=新疆，440000=广东，320000=江苏…）
2. **算投影参数**：地图中心取经纬度包围盒中心，缩放值按 `38 × (目标省经度跨度 / 22.88)` 估算，或参考 `tools/patch_xinjiang.py` 里的注释
3. **替换数据**：改 `tools/patch_xinjiang.py` 里的 `CENTER`、`SCALE`、`URUMQI`（飞线中心）、`POP`（各市数值）、`EN`（拼音），然后重跑脚本

> 脚本用 `assert` 校验每处替换都只命中一次，改不动会直接报错而不是悄悄改坏。

### 改标题 / 文案

搜索 `新疆维吾尔自治区数据可视化平台`、`Xinjiang Economic Visualization Platform` 直接替换即可（在 `assets/index-361e7662.js` 中）。

### 改路由名

`#/gdMap` 这个路径名还保留着原名，想改成 `#/xjMap`：
在 `assets/index-b6e4f5db.js` 里把 `/gdMap` 全部替换为 `/xjMap`（共 2 处）。

### 回滚

`backup/` 里是改造前的原始文件，覆盖回 `assets/` 即恢复广东版：

```bash
cp backup/index-361e7662.js.bak assets/index-361e7662.js
cp backup/index-b6e4f5db.js.bak assets/index-b6e4f5db.js
```

---

## 六、常见问题

**Q：双击 index.html 白屏 / 一堆 CORS 报错？**
A：必须走 HTTP 服务，见第一节。

**Q：页面卡在 99% 或者地图不出现？**
A：多半是 WebGL 没启用。Chrome 地址栏输入 `chrome://gpu` 检查；远程桌面/无显卡环境容易出这个问题。

**Q：改完 js 没生效？**
A：浏览器缓存。`Ctrl + F5` 强刷，或 DevTools → Network 勾选 Disable cache。

**Q：控制台报 `draco_wasm_wrapper.js 404`？**
A：`draco/gltf/` 目录没跟着复制过来，或者服务启动的目录层级不对（必须在 index.html 那层）。

**Q：为什么面板里有些图标/背景是空的？**
A：原项目部署时就缺了这些图（原站请求也是 404），不是这次改动造成的。

---

## 七、版权说明

地图边界数据来自阿里 DataV（公开接口）；原始可视化工程版权归原作者所有。本版本仅供学习研究，**商用请自行联系原作者获取授权**。
