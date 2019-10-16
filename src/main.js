import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/date'
import './styles/index.less'

import {
  ValidationProvider,
  ValidationObserver,
  extend
} from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载验证插件的语言包
import * as rules from 'vee-validate/dist/rules'

// import './vant'
import {
  Button,
  NavBar,
  Field,
  Cell,
  CellGroup,
  Toast,
  NoticeBar,
  Popup,
  Loading,
  Icon,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  List,
  PullRefresh,
  Image,
  Grid,
  GridItem,
  Lazyload,
  Search
} from 'vant'
Vue
  .use(Button)
  .use(NavBar)
  .use(Field)
  .use(Cell)
  .use(CellGroup)
  .use(Toast)
  .use(NoticeBar)
  .use(Popup)
  .use(Loading)
  .use(Icon)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(PullRefresh)
  .use(Image)
  .use(Grid)
  .use(GridItem)
  .use(Lazyload)
  .use(Search)

// 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}

// 注册为全局组件
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

// 配置验证信息
// 手机号验证
extend('phone', {
  validate: function (value) {
    return /^1[3456789]\d{9}$/.test(value)
  },
  message: '手机号格式错误'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
