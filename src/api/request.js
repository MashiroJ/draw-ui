import axios from 'axios'
import { ElMessage } from 'element-plus';
import config from '@/config';

const service = axios.create({
    baseURL: config.baseApi,
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use((res)=> {
    // 对响应数据做点什么
    const {code, data, msg} = res.data
    if(code === 200){
        return data
    }else{
        ElMessage.error(msg||'Network_Error')
        return Promise.reject(msg||'Network_Error')
    }
});

function request(options) {
    options.method = options.method||'get';
    // get请求调整
    if(options.method.toLowerCase()==='get'){
        options.params = options.data;
    }
    // mock开关处理
    let isMock = config.mock;
    if (typeof options.mock != 'undefined') {
        isMock = options.mock;
    }
    // env 处理
    if (config.env === 'prod') {
        //no mock
        service.defaults.baseURL = config.baseApi;
    }else{
        service.defaults.baseURL = isMock ? config.mockApi: config.baseApi;
    }
    return service(options);
}

export default request;