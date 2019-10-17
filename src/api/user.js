import request from '@/utils/request'

// 登录api
export function login (data) {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}

// 获取个人信息api
export function getUserMsg () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}
