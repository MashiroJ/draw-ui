import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/less/index.less'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import '@/api/mock.js'
import api from './api/api'
import { useAllDataStore } from "@/stores"

/**
 * 判断目标路径是否存在于路由列表中
 * 
 * 此函数用于检查给定的路径（to.path）是否在当前应用的路由配置中出现
 * 它首先从路由器对象中获取所有的路由配置，然后通过比较路径来判断特定的路由是否存在
 * 这在导航守卫、路由动态添加或验证路由配置的正确性等方面可能非常有用
 * 
 * @param {Object} to - 目标路径对象，包含路径信息
 * @returns {boolean} - 如果目标路径存在于路由配置中，则返回true；否则返回false
 */
function isRoute(to) {
    // 从路由器中获取所有路由配置
    let res = router.getRoutes();
    // 过滤出路径与目标路径匹配的路由项，并检查其数量是否大于0
    return res.filter((item) => item.path === to.path).length > 0;
}

router.beforeEach((to, from) => {
    // 在路由跳转前检查是否需要登录
    if (to.path !== "/login" && !store.state.token) {
        // 如果未登录且目标路由不是登录页，则重定向至登录页
        return { name: "login" };
    }
    // 检查目标路由是否存在
    if (!isRoute(to)) {
        // 如果目标路由不存在，则重定向至404页面
        return { name: "404" }
    }
})

const pinia = createPinia()
const app = createApp(App)

app.config.globalProperties.$api = api
app.use(ElementPlus)
app.use(pinia)

const store = useAllDataStore()
store.addMenu(router, "refresh")
app.use(router).mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}