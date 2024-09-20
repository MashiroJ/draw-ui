<script setup>
import {getCurrentInstance, onMounted, reactive, ref} from 'vue';

const {proxy} = getCurrentInstance();

const tableData = ref([]);
const getUserData = async () => {
  const data = await proxy.$api.getUserData(config);
  tableData.value = data.list.map(item => ({
    ...item,
    sex: item.sex === 1 ? '男' : '女'
  }))
  config.total = data.count
  config.size = data.size
}
const taleLabel = reactive([
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'age',
    label: '年龄',
  },
  {
    prop: 'sex',
    label: '性别',
  },
  {
    prop: 'birth',
    label: '出生日期',
    width: 200,
  },
  {
    prop: 'addr',
    label: '地址',
    width: '400',
  },
]);

const fromInline = reactive({
  keyWord: ''
})
const config = reactive({
  name: '',
  total: 0,
  page: '1',
  size: '1'
})
const handleSearch = () => {
  config.name = fromInline.keyWord
  getUserData()
}
const handleSizeChange = (size) => {
  config.size = size
  getUserData()
}

const handleCurrentChange = (page) => {
  config.page = page
  getUserData()
}

onMounted(() => {
  getUserData();
});
</script>

<template>
  <div class="user-header">
    <el-button type="primary">新增</el-button>
    <el-form :inline="true" :model="fromInline" class="user-header-form">
      <el-form-item>
        <el-input placeholder="请输入用户名"
                  @keyup.enter.native="handleSearch"
                  v-model="fromInline.keyWord"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
          v-for="item in taleLabel"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : 125"/>
      <el-table-column fixed="right" label="选项" min-width="120">
        <template #default>
          <el-button type="success" size="small" @click="handleClick">
            修改
          </el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pager"
                   size=large
                   :disabled=false
                   :background=false
                   layout="total, sizes, prev, pager, next, jumper"
                   :total=config.total
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<style scoped lang="less">
.user-header{
  display:flex;
  justify-content:space-between;
}
.table{
  position:relative;
  height:520px;
  .pager{
    position:absolute;
    right:10px;
    bottom:30px;
  }
  .el-table{
    width:100%;
    height:500px;
  }
}
.select-clearn{
  display:flex;
}
</style>
