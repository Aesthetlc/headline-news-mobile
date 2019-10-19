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

// 关注
export function FollowUser (userId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 取消关注
export function unFollowUser (userId) {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

// 获取用户个人资料
export function getUserProfile () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

// 保存用户头像的方法
export function saveUserPhoto (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}

// 更新用户头像的方法
export function updateUserPhoto (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}

// 更新用户基本信息的方法
export function updateUserMsg (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}
