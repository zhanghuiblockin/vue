const state = {
  count: 123,
  all: [],
  cur: ''
}

const getter = {}

const mutations = {
  increment (state) {
    state.count++
  },
  coins (state, obj) {
    state.all = obj
  }
}

const actions = {
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
