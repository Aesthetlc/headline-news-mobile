import request from '@/utils/request.js'

// 获取文章列表
export function getArticles (params) {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}

// 获取文章详情
export function getArticleMsgById (articleId) {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

// 点赞
export function addLike (articleId) {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/likings`,
    data: {
      target: articleId
    }
  })
}

// 取消点赞
export function deleteAddLike (articleId) {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${articleId}`
  })
}

// 喜欢
export function deleteDislike (articleId) {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/article/dislikes/' + articleId
  })
}

// 不喜欢
export function addDislike (articleId) {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/dislikes`,
    data: {
      target: articleId
    }
  })
}
