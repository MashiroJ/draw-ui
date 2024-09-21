<template>
    <div class="header">
        <!--面包屑-->
        <div class="l-content">
            <el-button size="small" @click="handleCollapse">
                <component class="icon" is="menu"></component>
            </el-button>
            <el-breadcrumb separator="/" class="bread">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <!-- 面包屑实现 -->
                <el-breadcrumb-item v-if="current" :to="current.path">{{current.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--右侧下拉菜单 -->
        <div class="r-content">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img :src="getImageUrl('user')" class="user" />
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAllDataStore } from '@/stores'
import { useRouter } from 'vue-router'
const store = useAllDataStore()
const handleCollapse=()=>{
    store.state.isCollapse = !store.state.isCollapse 
}
const getImageUrl = (user) => {
    return new URL('@/assets/images/user.png', import.meta.url).href
}

const router = useRouter()
const handleLoginOut=()=>{
    store.clean()
    router.push('/login')
}

const current = computed(()=>store.state.currentMenu)

</script>

<style lang="less" scoped>
.header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    width:100%;
    height:100%;
    background-color:#333;
}
.icon{
    width:20px;
    height:20px;

}

.l-content{
    display:flex;
    align-items:center;
    .el-button{
        margin-right:20px;
    }
}
.r-content{
    .user{
        width:40px;
        height:40px;
        border-radius:50%;
    }
}
:deep(.bread span){
    color:#fff !important;
    cursor:pointer !important;
}
</style>