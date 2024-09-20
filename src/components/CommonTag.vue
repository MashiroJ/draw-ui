<script setup>
import {computed} from 'vue';
import {useRoute, useRouter} from 'vue-router'
import {useAllDataStore} from '@/stores'

const store = useAllDataStore()
const tags = computed(() => store.state.tags)

const route = useRoute()
// 路由跳转
const router = useRouter()
const handleMenu = (tag) => {
  router.push(tag.name)
  store.selectMenu(tag)
}

const handleClose = (tag, index) => {
  // 使用 Pinia 状态管理库更新当前标签
  store.updateTags(tag)

  // 如果要关闭的标签名称与当前路由名称不相同，则直接返回
  if (tag.name !== route.name) return

  // 检查关闭的标签是否为最后一个标签
  if (index === store.state.tags.length) {
    // 如果是最后一个标签，选择倒数第二个标签作为当前选中的菜单
    store.selectMenu(tags.value[index - 1])
    // 路由跳转到倒数第二个标签的名称
    router.push(tags.value[index - 1].name)
  } else {
    // 如果不是最后一个标签，选择当前索引的标签作为当前选中的菜单
    store.selectMenu(tags.value[index])
    // 路由跳转到当前索引标签的名称
    router.push(tags.value[index].name)
  }
}

</script>

<template>
  <div class="tags">
    <el-tag
        v-for="(tag,index) in tags"
        :key="tag.name"
        :closable="tag.name !== 'home'"
        :effect="route.name === tag.name ? 'dark':'plain'"
        @click="handleMenu(tag)"
        @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<style lang="less" scoped>
.tags {
  margin: 20px 0 0 20px;
}

.el-tag {
  margin-right: 10px;
}
</style>