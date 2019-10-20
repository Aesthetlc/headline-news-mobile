import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/date'
import './styles/index.less'
import 'amfe-flexible/index.js' // rem适配

import {
  ValidationProvider,
  ValidationObserver,
  extend
} from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载验证插件的语言包
import * as rules from 'vee-validate/dist/rules'
import fastClick from 'fastclick' // 解决手机端300ms延迟

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
  Search,
  Dialog,
  ActionSheet,
  DatetimePicker
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
  .use(Dialog)
  .use(ActionSheet)
  .use(DatetimePicker)

// 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}
// 解决手机端300ms延迟
fastClick.attach(document.body)
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
