/**
 * 根组件：只负责渲染 <router-view />
 */
import { openBlock, createElementBlock, createBlock, resolveComponent } from './runtime/vue.js'

export default {
    name: 'App',
    render() {
        const RouterView = resolveComponent('router-view')
        return (openBlock(), createElementBlock('div', { class: 'root-app' }, [createBlock(RouterView)]))
    },
}
