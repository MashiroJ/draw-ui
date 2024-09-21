import { defineStore } from "pinia"
import { ref,watch } from "vue"

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
	}
}

export const useAllDataStore = defineStore('allData', () => {

	const state = ref(initState());

	watch(
		state,
		(newObj) => {
			if (!newObj.token) return;
			localStorage.setItem('store', JSON.stringify(newObj));
		},
		{ deep: true }
	)

	function selectMenu(val) {
		if (val.name === 'home') {
			state.value.currentMenu = null
		} else {
			// state.value.currentMenu = val
			let index = state.value.tags.findIndex((item) => item.name === val.name);
			index === -1 ? state.value.tags.push(val) : "";
		}
	};

	function updateTags(tag) {
		let index = state.value.tags.findIndex((item) => item.name === tag.name);
		state.value.tags.splice(index, 1);
	};

	function updateMenuList(val) {
		state.value.menulist = val;
	}

	function addMenu(router, type) {
		// 检查类型是否为 'refresh'  
		if (type === 'refresh') {
			// 从 localStorage 中获取存储的状态  
			if (JSON.parse(localStorage.getItem("store"))) {
				// 解析存储的状态并赋值给 state.value  
				state.value = JSON.parse(localStorage.getItem("store"));
				// 清空状态中的 routerList  
				state.value.routerList = [];
			} else {
				// 如果没有存储的状态，退出函数  
				return;
			}
		}

		// 从状态中获取菜单列表  
		const menu = state.value.menulist;
		// 导入 views 目录下的所有 Vue 组件  
		const module = import.meta.glob("../views/**/*.vue");
		// 初始化一个数组以保存路由配置  
		const routerArr = [];

		// 遍历每个菜单项  
		menu.forEach((item) => {
			// 检查菜单项是否有子项  
			if (item.children) {
				// 遍历每个子项  
				item.children.forEach((val) => {
					// 构造子组件的 URL  
					let url = `../views/${val.url}.vue`;
					// 将导入的组件赋值给子项  
					val.component = module[url];
					// 将所有子项添加到路由数组中  
					routerArr.push(...item.children);
				});
			} else {
				// 如果没有子项，构造菜单项的 URL  
				let url = `../views/${item.url}.vue`;
				// 将导入的组件赋值给菜单项  
				item.component = module[url];
				// 将菜单项添加到路由数组中  
				routerArr.push(item);
			}
		});

		// 清空状态中的 routerList  
		state.value.routerList = [];
		// 获取当前路由  
		let routers = router.getRoutes();

		// 遍历现有路由  
		routers.forEach(item => {
			// 检查路由是否为主路由之一  
			if (item.name == 'main' || item.name == 'login' || item.name == '404') {
				return; // 跳过这些路由  
			} else {
				// 从路由中移除该路由  
				router.removeRoute(item.name);
			}
		});

		// 将新路由添加到路由中  
		routerArr.forEach(item => {
			// 将每个项添加到 'main' 路由下  
			state.value.routerList.push(router.addRoute('main', item));
		});
	};
	function clean() {
		state.value.routerList.forEach((item) => {
			if (item) item();
		});
		state.value = initState();
		localStorage.removeItem('store');
	};
	return {
		state,
		selectMenu,
		updateTags,
		updateMenuList,
		addMenu,
		clean,
	}
})