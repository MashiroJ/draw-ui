import { resolveDirective } from "vue";
import { createRouter, createWebHistory } from "vue-router";  

// 制定路由规则  
const routes = [  
  {  
    path: "/",  
    name: "main",  
    component: () => import("../views/main.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home.vue"),
      }
    ],
  }  
];  

// 创建路由实例  
const router = createRouter({  
  history: createWebHistory(), // 确保这里调用了 createWebHistory 函数  
  routes,  
});  

// 导出路由实例  
export default router;