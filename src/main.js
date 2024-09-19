import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/less/index.less'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import '@/api/mock.js'
import api from '@/api/api'
import { useAllDataStore } from "@/stores"

const app = createApp(App); // 传入根组件 App  
const pinia = createPinia()

app.use(router);
app.use(pinia);
app.use(ElementPlus);
// 全局挂载 api
app.config.globalProperties.$api = api

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app');