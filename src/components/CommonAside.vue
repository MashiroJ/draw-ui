<script setup>
import { ref, computed } from 'vue'
import { useAllDataStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'

const list = computed(()=>store.state.menulist)
const noChildren = computed(() => list.value.filter(item => !item.children));
const hasChildren =computed(() => list.value.filter(item => item.children));

const store = useAllDataStore()
const isCollapse = computed(()=>store.state.isCollapse);
//width
const width = computed(()=>store.state.isCollapse ? '64px':'180px');

// 当用户点击某个菜单项时，使用 router.push 方法将页面导航到指定的路径。
const router = useRouter()
const handleMenu = (item)=>{
  router.push(item.path)
  store.selectMenu(item)
}

//当用户选中菜单时，高亮显示菜单
const route = useRoute()
const activeMenu = computed(()=>route.path)
</script>

<template>
  <el-aside :width="width">
    <el-menu
        background-color="#545c64"
        text-color="#fff"
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activeMenu"
    >
      <h3 v-show="!isCollapse">Draw-Ai后台管理</h3>
      <h3 v-show="isCollapse">Draw</h3>
      <el-menu-item
          v-for="item in noChildren"
          :index="item.path"
          :key="item.path"
          @click="handleMenu(item)"
      >
        <component  class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-sub-menu
          v-for="item in hasChildren"
          :index="item.path"
          :key="item.path"
      >
        <template #title>
          <component  class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
              v-for="(subitem, subindex) in item.children"
              :index="subitem.path"
              :key="subitem.path"
              @click="handleMenu(subitem)"
          >
            <component  class="icons" :is="subitem.icon"></component>
            <span>{{ subitem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<style lang="less" scoped>
    .icons{
        width: 18px;
        height: 18px;
        margin-right: 5px;
    }
    .el-menu{
        border-right: none;
        h3{
            line-height: 48px;
            color: #fff;
            text-align: center;
        }
    }
    .el-aside{
        height: 100vh;
        background-color: #545c64;
    }
</style>