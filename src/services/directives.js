import Vue from "vue"
Vue.directive("title", {
  inserted: function(el) {
    document.title = el.innerHTML
    el.remove()
  }
})
