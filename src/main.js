import Vue from 'vue'
import App from './App'
import router from './router'
/* eslint-disable no-unused-vars */
import axios from 'axios'
import ElementUI from 'element-ui'
import VueClipboard from 'vue-clipboard2'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import langs from '@/assets/lang'
import store from '@/stores'
/* eslint-disable no-unused-vars */
import * as filters from '@/services/filters'
import * as directives from "@/services/directives"

import '@/assets/css/theme-custom/index.css'
import '@/assets/styles/site.less'
console.log(filters);

Vue.use(VueClipboard)
Vue.use(ElementUI)
Vue.use(VueRouter)

// ---vue i18n start---
Vue.use(VueI18n)

let language = localStorage.getItem('language')
if (!language) language = 'zh-CN'

const i18n = new VueI18n({
  locale: language,
  messages: {
    'zh-CN': langs.zhCN, // 中文语言包
    'en-US': langs.enUS // 英文语言包
  }
})
// ---vue i18n end---
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: {App}
})
