// 搜索关键词

import request from '@/utils/request'

export function getSearchSuggestion (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params
  })
}

export function getSearchText (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
