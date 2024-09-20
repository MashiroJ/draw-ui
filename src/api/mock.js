import Mock from 'mockjs'
import homeApi from './MockData/home'
import userApi from './MockData/user'

//1,拦截路径，2，方法，3，制造数据
Mock.mock(/api\/home\/getTableData/,'get',homeApi.getTableData);
Mock.mock(/api\/home\/getCountData/,'get',homeApi.getCountData);
Mock.mock(/api\/home\/getChartData/,'get',homeApi.getChartData);
Mock.mock(/user\/getUserData/,"get", userApi.getUserList);
Mock.mock(/user\/deleteUser/,"get", userApi.deleteUser);
Mock.mock(/user\/addUser/,"post", userApi.createUser);
Mock.mock(/user\/editUser/, "post",userApi.updateUser);
// Mock.mock(/permission\/getMenu/, "post",menuApi.getMenu);
