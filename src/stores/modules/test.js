import axios from 'axios'
const state = {
  config: {},
  count: 123,
  all: [],
  cur: ''
}

const getter = {}

const mutations = {
  setConfig (state, obj) {
    state.config = obj
  },
  increment (state) {
    state.count++
  },
  coins (state, obj) {
    state.all = obj
  }
}

const actions = {
  fetchConfig ({commit}) {
    // 如何拿到Vue实例?
    axios.get('http://ltc-bj-dev.c6396418dd7954b228d8b967c8a929103.cn-beijing.alicontainer.com/api/public/v1/url').then(res => {
      console.log('actions异步获取数据更新到state')
      commit('setConfig', res.data)
    }).catch(err => { console.log(err) })
  },
  fetchCoin ({commit}) {
    setTimeout(() => {
      console.log(123)
      commit('coins', {'abc': 1})
    }, 5000)
  }
}

export default {
  state,
  getter,
  mutations,
  actions
}
