
<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {useAllDataStore} from '@/stores'

const { proxy } = getCurrentInstance();
const store = useAllDataStore();

onMounted(() => {
  store.getRoleList(config);
});

const tableLabel = reactive([
  {
    prop: "name",
    label: "角色名称",
  },
  {
    prop: "type",
    label: "角色类型",
  },
  {
    prop: "desc",
    label: "角色描述",
    width: 400,
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 200,
  },
]);

const formInline = reactive({
  keyWord: "",
});
const config = reactive({
  name: "",
  page: 1,
  limit: 10,
  total: 0,
});

const handleSearch = () => {
  config.name = formInline.keyWord;
  store.getRoleList(config);
};

const handleSizeChange = (size) => {
  config.limit = size;
  store.getRoleList(config);
};
const handleCurrentChange = (page) => {
  config.page = page;
  store.getRoleList(config);
};

const action = ref("add");
const dialogVisible = ref(false);
const formRole = reactive({});
const rules = reactive({
  name: [{ required: true, message: "角色名称是必填项", trigger: "blur" }],
  type: [{ required: true, message: "角色类型是必选项", trigger: "change" }],
  desc: [{ required: true, message: "角色描述是必填项" }],
});

const handleAdd = () => {
  action.value = "add";
  dialogVisible.value = true;
};

const handleClose = () => {
  proxy.$refs["roleForm"].resetFields();
  dialogVisible.value = false;
};

const handleCancel = () => {
  proxy.$refs["roleForm"].resetFields();
  dialogVisible.value = false;
};

const onSubmit = () => {
  proxy.$refs["roleForm"].validate(async (valid) => {
    if (valid) {
      if (action.value === "add") {
        await store.createRole(formRole);
      } else if (action.value === "edit") {
        await store.updateRole(formRole);
      }
      dialogVisible.value = false;
      proxy.$refs["roleForm"].resetFields();
    } else {
      ElMessage({
        showClose: true,
        message: "请输入正确的内容",
        type: "error",
      });
    }
  });
};

const handleEdit = (role) => {
  action.value = "edit";
  dialogVisible.value = true;
  nextTick(() => {
    Object.assign(formRole, { ...role, type: "" + role.type });
  });
  store.setCurrentRole(role);
};

const handleDelete = (role) => {
  ElMessageBox.confirm("是否删除该角色?").then(async () => {
    await store.deleteRole(role.id);
    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
    });
  });
};
</script>

<template>
  <div class="role-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-form :inline="true" :model="formInline" class="role-header-form">
      <el-form-item>
        <el-input
          placeholder="请输入角色名称"
          @keyup.enter.native="handleSearch"
          v-model="formInline.keyWord"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-table :data="store.state.roleList" style="width: 100%">
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : 125"
      />
      <el-table-column fixed="right" label="选项" min-width="120">
        <template #="scope">
          <el-button type="success" size="small" @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pager"
      size="large"
      :disabled="false"
      :background="false"
      layout="total, sizes, prev, pager, next, jumper"
      :total="config.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="action === 'add' ? '新增角色' : '编辑角色'"
    width="35%"
    :before-close="handleClose"
  >
    <el-form
      :inline="true"
      :model="store.currentRole"
      :rules="rules"
      ref="roleForm"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model="store.currentRole.name"
              placeholder="请输入角色名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="角色类型" prop="type">
            <el-select v-model="store.currentRole.type" placeholder="请选择">
              <el-option label="管理员" value="1" />
              <el-option label="普通用户" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            v-model="store.currentRole.desc"
            placeholder="请输入角色描述"
          />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="less">
.role-header {
  display: flex;
  justify-content: space-between;
}

.table {
  position: relative;
  height: 520px;

  .pager {
    position: absolute;
    right: 10px;
    bottom: 30px;
  }

  .el-table {
    width: 100%;
    height: 500px;
  }
}

.select-clearn {
  display: flex;
}
</style>
