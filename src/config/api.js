/**
 * 后端数据源配置
 *
 * 后端是一个独立的小服务（见 server/ 目录，node server/index.js 启动）。
 * 大屏启动时会尝试从这里拉取数据，失败则无缝回退到 src/config 里的本地值，
 * 所以「没开后端」和「部署成纯静态」都不影响使用。
 *
 * 后端地址的解析优先级（高 → 低）：
 *   1. window.__API_BASE__            （在 index.html 里写死，或控制台里 window.__API_BASE__='http://x' 后刷新）
 *   2. URL 参数 ?api=http://x:8787    （会自动记住到 localStorage）
 *   3. localStorage['dashboard.apiBase']
 *   4. 环境变量 VITE_API_URL          （npm run build 前设置，如 VITE_API_URL=http://192.168.1.10:8787）
 *   5. 本地开发默认 http://localhost:8787（页面本身不在 localhost 时视为未部署后端，直接关闭连接）
 */
export default {
    /** 本地开发默认地址 */
    defaultBase: 'http://localhost:8787',
    /** 启动拉取数据的超时（毫秒）：后端没开时保证大屏不被拖慢 */
    timeout: 1200,
    /** 是否订阅实时推送（结构变更 → 自动刷新；KPI → 原地滚动数字） */
    live: true,
}
