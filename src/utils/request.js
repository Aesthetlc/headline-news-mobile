import axios from 'axios'
import jsonBig from 'json-bigint'

// 设置baseUrl
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 处理大数字
request.defaults.transformResponse = [function (data) {
  return data ? jsonBig.parse(data) : {}
}]

export default request
