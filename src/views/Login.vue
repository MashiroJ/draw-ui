<script setup>  
import { reactive,getCurrentInstance } from 'vue'
import {useAllDataStore} from '@/stores'
import { useRouter } from 'vue-router'


const { proxy } = getCurrentInstance();
const store = useAllDataStore()
const router = useRouter()
// 登录表单数据  
const formLogin = reactive({  
  username: '',  
  password: ''  
})

  // 提交逻辑  
const onSubmit = async () => {  
  const res = await proxy.$api.getMenu(formLogin)
  console.log(res)
  store.updateMenuList(res.menuList)  
  store.state.token=res.token
  router.push('/home')
}  


</script>  

<template>  
  <div class="body-login">  
    <el-form :model="formLogin" class="login-container">  
      <h1>欢迎登陆</h1>  
      <el-form-item>  
        <el-input type="input" placeholder="请输入用户名" v-model="formLogin.username"></el-input>  
      </el-form-item>  
      <el-form-item>  
        <el-input type="password" placeholder="请输入密码" v-model="formLogin.password"></el-input>  
      </el-form-item>  
      <el-form-item> 
        <el-button type="success" round size="large" @click="onSubmit">登陆</el-button>
      </el-form-item>  
    </el-form>  
  </div>  
</template>  

<style scoped lang="less">  
@keyframes grow {   
  0% {   
    transform: scale(0);   
  }   
  80% {   
    transform: scale(1.1); /* 弹跳效果 */   
  }   
  100% {   
    transform: scale(1);   
  }   
}  

.body-login {   
  display: flex;   
  justify-content: flex-start; /* 左侧对齐 */   
  align-items: center; /* 垂直居中 */   
  width: 100%;   
  height: 100vh; /* 使用 vh 使其覆盖整个视口高度 */   
  background-image: url("../assets/images/background.png");   
  background-size: cover; /* 确保背景图覆盖整个区域 */   
  overflow: hidden;   
}  

.login-container {   
  position: relative;
  width: 350px; /* 设置宽度 */   
  height: 350px; /* 设置高度为相等，以形成圆形 */
  box-shadow: inset 20px 20px rgba(0, 0, 0, 0.05),
  25px 35px 20px rgba(0, 0, 0, 0.05),
  25px 30px 30px rgba(0, 0, 0, 0.05),
  inset -20px -20px 25px rgba(255, 255, 255, 0.9);
  animation: grow 1s ease-out; /* 添加动画效果 */
  display: flex; /* 使用 flexbox 使内容居中 */   
  justify-content: center; /* 垂直居中内容 */ 
  align-items: center; /* 水平居中内容 */
  flex-direction: column; /* 垂直排列内容 */
  margin-left: 150px; /* 左侧留出空白 */    
  background: rgba(255, 255, 255, 0.4); /* 更高的透明度 */   
  border-radius: 52% 48% 33% 67% /38% 45% 55% 62%; /* 边框样式 */
  

  h1 {   
    text-align: center;   
    margin-bottom: 20px;   
    color: #505450;   
  }   

  :deep(.el-form-item__content) {   
    justify-content: center;   
  }   
} 
login-container::hover{
  border-radius: 50%;
}
.login-container::before {  
  content: '';  
  position: absolute;  
  top: 50px; /* 从顶部距离 */  
  left: 85px; /* 从左边距离 */  
  width: 35px; /* 圆形宽度 */  
  height: 35px; /* 圆形高度 */  
  border-radius: 50%; /* 设置为圆形 */  
  background: #fff;
  opacity: 0.9;
}  
.login-container::after {  
  content: '';  
  position: absolute;  
  top: 90px; /* 从顶部距离 */  
  left: 110px; /* 从左边距离 */  
  width: 15px; /* 圆形宽度 */  
  height: 15px; /* 圆形高度 */  
  border-radius: 50%; /* 设置为圆形 */  
  background: #fff;
  opacity: 0.9;
}  
</style>