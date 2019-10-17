import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'tabbar',
      path: '/',
      component: () => import('@/views/tabbar'),
      children: [
        {
          name: 'home',
          path: '', // 默认路由
          component: () => import('@/views/home')
        },
        {
          name: 'mine',
          path: '/mine', // 我的
          component: () => import('@/views/user')
        },
        {
          name: 'userinfo',
          path: '/userinfo', // 个人信息
          component: () => import('@/views/user/userinfo')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    },
    {
      name: 'search',
      path: '/search',
      component: () => import('@/views/search')
    },
    {
      name: 'search-result',
      path: '/search-result/:q',
      component: () => import('@/views/search-result')
    }

  ]
})
