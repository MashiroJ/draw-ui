
import { defineStore } from "pinia"
import { ref, watch, reactive } from "vue"
import { ElMessage } from "element-plus"

function initState() {
  return {
    isCollapse: false,
    tags: [
      {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'home'
      }
    ],
    currentMenu: null,
    menulist: [],
    token: "",
    routerList: [],
    roleList: [],
    currentRole: {
      id: "",
      name: "",
      type: "",
      desc: "",
      createTime: ""
    }
  }
}

export const useAllDataStore = defineStore('allData', () => {
  const state = ref(initState())

  watch(
    state,
    (newObj) => {
      if (!newObj.token) return
      localStorage.setItem('store', JSON.stringify(newObj))
    },
    { deep: true }
  )

  function selectMenu(val) {
    if (val.name === 'home') {
      state.value.currentMenu = null
    } else {
      state.value.currentMenu = val
      let index = state.value.tags.findIndex((item) => item.name === val.name)
      index === -1 ? state.value.tags.push(val) : ""
    }
  }

  function updateTags(tag) {
    let index = state.value.tags.findIndex((item) => item.name === tag.name)
    state.value.tags.splice(index, 1)
  }

  function updateMenuList(val) {
    state.value.menulist = val
  }

  function addMenu(router, type) {
    if (type === 'refresh') {
      if (JSON.parse(localStorage.getItem("store"))) {
        state.value = JSON.parse(localStorage.getItem("store"))
        state.value.routerList = []
      } else {
        return
      }
    }

    const menu = state.value.menulist
    const module = import.meta.glob("../views/**/*.vue")
    const routerArr = []

    menu.forEach((item) => {
      if (item.children) {
        item.children.forEach((val) => {
          let url = `../views/${val.url}.vue`
          val.component = module[url]
          routerArr.push(...item.children)
        })
      } else {
        let url = `../views/${item.url}.vue`
        item.component = module[url]
        routerArr.push(item)
      }
    })

    state.value.routerList = []
    let routers = router.getRoutes()

    routers.forEach(item => {
      if (item.name == 'main' || item.name == 'login' || item.name == '404') {
        return
      } else {
        router.removeRoute(item.name)
      }
    })

    routerArr.forEach(item => {
      state.value.routerList.push(router.addRoute('main', item))
    })
  }

  function clean() {
    state.value.routerList.forEach((item) => {
      if (item) item()
    })
    state.value = initState()
    localStorage.removeItem('store')
  }

  const getRoleList = async (config) => {
    try {
      const { data } = await this.$api.getRoleList(config)
      state.value.roleList = data.list.map((item) => ({
        ...item,
        type: item.type === 1 ? "管理员" : "普通用户"
      }))
      config.total = data.count 
    } catch (error) {
      ElMessage({
        showClose: true,
        message: "获取角色列表失败",
        type: "error"
      })
    }
  }

  const createRole = async (formData) => {
    try {
      const { data } = await this.$api.createRole(formData)
      ElMessage({
        showClose: true,
        message: data.message,
        type: "success"
      })
      await getRoleList()
    } catch (error) {
      ElMessage({
        showClose: true,
        message: "创建角色失败",
        type: "error"
      })
    }
  }

  const updateRole = async (formData) => {
    try {
      const { data } = await this.$api.updateRole(formData)
      ElMessage({
        showClose: true,
        message: data.message,
        type: "success"
      })
      await getRoleList()
    } catch (error) {
      ElMessage({
        showClose: true,
        message: "更新角色失败",
        type: "error"
      })
    }
  }

  const deleteRole = async (id) => {
    try {
      await this.$api.deleteRole({ id })
      ElMessage({
        showClose: true,
        message: "删除角色成功",
        type: "success"
      })
      await getRoleList()
    } catch (error) {
      ElMessage({
        showClose: true,
        message: "删除角色失败",
        type: "error"
      })
    }
  }

  const setCurrentRole = (role) => {
    Object.assign(state.value.currentRole, role)
  }

  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
    addMenu,
    clean,
    getRoleList,
    createRole,
    updateRole,
    deleteRole,
    setCurrentRole
  }
})
