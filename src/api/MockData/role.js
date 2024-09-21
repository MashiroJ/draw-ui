
import Mock from 'mockjs'

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
	const search = url.split('?')[1]
	if (!search) {
		return {}
	}
	return JSON.parse(
		'{"' +
		decodeURIComponent(search)
			.replace(/"/g, '\\"')
			.replace(/&/g, '","')
			.replace(/=/g, '":"') +
		'"}'
	)
}

let RoleList = []
const count = 100
//模拟100条角色数据
for (let i = 0; i < count; i++) {
	RoleList.push(
		Mock.mock({
			id: Mock.Random.guid(),
			name: Mock.Random.cword(2, 6),
			type: Mock.Random.integer(0, 1),
			desc: Mock.Random.csentence(10, 20),
			createTime: Mock.Random.datetime()
		})
	)
}

export default {
	/**
	 * 获取角色列表
	 * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
	 * @param name, page, limit
	 * @return {{code: number, count: number, data: *[]}}
	 */
	getRoleList: config => {
		const {name, page = 1, limit = 10} = param2Obj(config.url)
		
		const mockList = RoleList.filter(role => {
			if (name && role.name.indexOf(name) === -1) return false
			return true
		})
		
		const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
		return {
			code: 200,
			data: {
				list: pageList,
				count: mockList.length,
			}
		}
	},
	/**
	 * 删除角色
	 * @param id
	 * @return {*}
	 */
	deleteRole: config => {
		const {id} = param2Obj(config.url)
		
		if (!id) {
			return {
				code: -999,
				message: '参数不正确'
			}
		} else {
			RoleList = RoleList.filter(r => r.id !== id)
			return {
				code: 200,
				message: '删除成功'
			}
		}
	},
	/**
	 * 新增角色
	 * @param config
	 * @returns {{code: number, data: {message: string}}}
	 */
	createRole: config => {
		const {name, type, desc} = JSON.parse(config.body)
		RoleList.unshift({
			id: Mock.Random.guid(),
			name: name,
			type: type,
			desc: desc,
			createTime: Mock.Random.datetime()
		})
		return {
			code: 200,
			data: {
				message: '添加成功'
			}
		}
	},
	/**
	 * 修改角色
	 * @param id, name, type, desc
	 * @return {{code: number, data: {message: string}}}
	 */
	updateRole: config => {
		const {id, name, type, desc} = JSON.parse(config.body)
		RoleList.some(r => {
			if (r.id === id) {
				r.name = name
				r.type = type
				r.desc = desc
				return true
			}
		})
		return {
			code: 200,
			data: {
				message: '编辑成功'
			}
		}
	},
	
}
