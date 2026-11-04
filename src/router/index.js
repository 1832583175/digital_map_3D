/**
 * 路由表
 * 想改地址（例如 /gdMap -> /xjMap），只改这里即可。
 */
import { createRouter, createWebHashHistory } from '../runtime/vue.js'

const routes = [
    { path: '/', redirect: '/gdMap' },
    /** 大屏主页面（懒加载，首次进入时才下载三维引擎与图表代码） */
    { path: '/gdMap', component: () => import('../views/gd-map/index.js') },
    { path: '/:pathMatch(.*)', redirect: '/' },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
