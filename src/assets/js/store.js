import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state = {
  refresh_time: 10000, // 定时刷新
  is_login: false,
  init_url: {}, // 全站入口信息
  cur_coins: [], // 获取支持的币种
  language: 'zh-CN', // 采用标准语言包命名,从localStorage中取;
  coin_type_show: false, // 是否显示币种切换
  enter_panel: false, // 是否从子账户面板进来的

  puid: '',
  coin_type: '',
  region_id: '',
  refresh: '',
  observer: false,
  read_puid: '',
  read_token: '',

  //github配置
  // base_url: "BASE_URL",
  // common_url: "COMMON_URL",
  // uc_url: "UC_URL",
  // client_id: "CLIENT_ID",
  // redirect_uri: "REDIRECT_URL",

  //本地配置
  base_url: "http://ltc-bj-dev.c6396418dd7954b228d8b967c8a929103.cn-beijing.alicontainer.com/api/public/v1/url",
  common_url: "http://ltc-bj-dev.c6396418dd7954b228d8b967c8a929103.cn-beijing.alicontainer.com/api/public/v1",
  uc_url: "https://account.blockin.com",
  client_id: "poolin-web",
  redirect_uri: "http://localhost:8080/jump",

}
const mutations = {
  setEnterPannel(state, v) {
    state.enter_panel = v;
    localStorage.setItem("enter_panel", v);
  },
  setRefresh(state) {
    state.refresh = new Date().getTime();
  },
  setInitUrl(state, v) {
    state.init_url = v;
  },
  setCurCoins(state, v) {
    state.cur_coins = v
  },
  setCoinType(state, v) {
    state.coin_type = v;
    localStorage.setItem("coin_type", v);
  },
  setRegionId(state, v) {
    state.region_id = v
    localStorage.setItem("region_id", v);
  },
  setPuid(state, v) {
    state.puid = v
    localStorage.setItem("puid", v);
  },
  setLanguage(state, v) {
    state.language = v
    localStorage.setItem("language", v);
  }

}
const getters = {
  // count: function (state) {
  //     return state.count += 100;
  // }
}
const actions = {
  // addAction(context) {
  //     context.commit('add', 10)
  // }
}
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
