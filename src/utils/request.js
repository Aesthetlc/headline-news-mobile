import axios from 'axios'
import jsonBig from 'json-bigint'
import store from '@/store'

// 设置baseUrl
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 处理大数字
request.defaults.transformResponse = [function (data) {
  return data ? jsonBig.parse(data) : {}
}]

// 加载前处理(请求拦截器)
// 注入token
request.interceptors.request.use(function (config) {
  const user = store.state.user
  if (user) {
    config.headers['Authorization'] = `Bearer ${user.token}`
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

// 相应处理

export default request
