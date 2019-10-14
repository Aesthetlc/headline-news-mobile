import request from '@/utils/request.js'

// 获取频道信息
export function getChannels () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
