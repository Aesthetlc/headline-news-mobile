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
          path: '',
          component: () => import('@/views/home')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }

  ]
})
