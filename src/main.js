/**
 * 应用入口
 *
 * 启动顺序：
 *   1. bootstrap() —— 若配置了后端（src/config/api.js），先拉一次数据合并进 cfg
 *   2. createApp(App) —— 挂载大屏（首屏即使用后端数据）
 *   3. connectLive() —— 订阅后端实时推送（KPI 滚动 / 数据变更自动刷新）
 */
import { createApp } from './runtime/vue.js'
import App from './App.js'
import router from './router/index.js'
import { bootstrap, connectLive } from './services/live.js'
import cfg from './config/index.js'

import './styles/base.css'

bootstrap().finally(() => {
    createApp(App).use(router).mount('#app')
    connectLive()
    // 暴露调试口：控制台里可以 window.__DASHBOARD__.cfg 直接看当前生效数据
    window.__DASHBOARD__ = { cfg }
})
