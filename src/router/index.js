import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    name: 'tabbar',
    path: '/',
    component: () => import('@/views/tabbar'),
    children: [{
      name: 'home',
      path: '', // 默认路由
      component: () => import('@/views/home')
    },
    {
      name: 'mine',
      path: '/mine', // 我的
      component: () => import('@/views/mine')
    }
    ]
  },
  {
    name: 'login',
    path: '/login', // 登录
    component: () => import('@/views/login')
  },
  {
    name: 'search',
    path: '/search', // 搜索
    component: () => import('@/views/search')
  },
  {
    name: 'search-result',
    path: '/search-result/:q', // 搜索结果
    component: () => import('@/views/search-result')
  },
  {
    name: 'article',
    path: '/article/:articleId', // 点击查看详情
    component: () => import('@/views/article')
  },
  {
    name: 'userinfo',
    path: '/userinfo', // 个人信息
    component: () => import('@/views/user')
  },
  {
    name: 'chat',
    path: '/chat', // 小智同学
    component: () => import('@/views/chat')
  }

  ]
})
