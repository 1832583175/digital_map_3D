# 数据后端（零依赖）

大屏的独立数据服务。**不需要 `npm install`**，Node ≥ 16 直接运行：

```bash
node index.js          # 或在大屏工程根目录 npm run api
```

- 数据控制台：http://localhost:8787/
- 接口文档、事件约定、鉴权、部署连法：见工程根目录 **`docs/后端接入指南.md`**

## 目录

```
server/
├── index.js               服务入口（HTTP + 静态托管 dist + SSE）
├── lib/store.js           数据仓库（读取/校验/合并/原子落盘）
├── lib/sse.js             实时推送中心
├── public/index.html      网页版数据控制台
├── scripts/build-seed.js  从 src/config 生成种子数据
└── data/
    ├── dataset.seed.json  种子（恢复默认的基准，可入库）
    └── dataset.json       运行时数据（自动生成，不入库）
```
