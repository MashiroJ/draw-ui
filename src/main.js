import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/less/index.less';
import { createPinia } from 'pinia';
// 引入路由实例
import router from '@/router/index.js';

const app = createApp(App); // 传入根组件 App  
const pinia = createPinia();
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router);
app.use(createPinia)
app.use(ElementPlus);
app.use(pinia);

app.mount('#app');