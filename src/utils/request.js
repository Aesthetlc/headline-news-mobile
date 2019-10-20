import axios from 'axios'
import jsonBig from 'json-bigint'
import store from '@/store'
import router from '@/router'

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

/**
 * 响应拦截器
 */
request.interceptors.response.use(function (response) {
  return response
}, async error => {
  if (error.response && error.response.status === 401) {
    const { user } = store.state
    if (!user) {
      // vue.toast.fail('失败文案')
      router.push({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    } else {
      try {
        // 请求获取新的token,根据refresh_token
        const { data } = await axios({
          method: 'PUT',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 将获取到的新的token存储起来vuex
        store.commit('setUser', {
          token: data.data.token,
          refresh_token: user.refresh_token
        })
        // 将原来的请求发出去
        return request(error.config)
      } catch (error) {
        console.log(error)
        router.push({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      }
    }
  }
  return Promise.reject(error)
})

export default request
