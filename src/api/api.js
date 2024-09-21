import request from "./request";

export default {
    getTableData() {
        return request({
            url: '/home/getTableData',
            method: 'get',
            // mock: false,
        });
    },
    getCountData() {
        return request({
            url: '/home/getCountData',
            method: 'get',
            // mock: false,
        });
    },
    getChartData() {
        return request({
            url: '/home/getChartData',
            method: 'get',
            // mock: false,
        });
    },
    getUserData(params) {
        return request({
            url: '/user/getUserData',
            method: 'get',
            data: params
        })
    },
    deleteUser(params) {
        return request({
            url: '/user/deleteUser',
            method: 'get',
            data: params
        })
    },
    addUser(params) {
        return request({
            url: '/user/addUser',
            method: 'post',
            data: params
        })
    },
    editUser(params) {
        return request({
            url: '/user/editUser',
            method: 'post',
            data: params
        })
    },
    getRoleData(params) {
        return request({
            url: '/role/getRoleData',
            method: 'get',
            data: params
        })
    },
    deleteRole(params) {
        return request({
            url: '/role/deleteRole',
            method: 'get',
            data: params
        })
    },
    addRole(params) {
        return request({
            url: '/role/addRole',
            method: 'post',
            data: params
        })
    },
    editRole(params) {
        return request({
            url: '/role/editRole',
            method: 'post',
            data: params
        })
    },
    getPermission(params) {
        return request({
            url: '/permission/getPermission',
            method: 'post',
            data: params
        })
    },
    getMenu(params) {
        return request({
            url: '/permission/getMenu',
            method: 'post',
            data: params
        })
    }
};
