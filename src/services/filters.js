import Vue from 'vue'

Vue.filter('date422', function (value) {
  if (!value) return ''
  value = value.toString()

  return value.slice(0, 4) + '-' + value.slice(4, 6) + '-' + value.slice(6, 8)
})

Vue.filter('uppercase', function (value) {
  if (!value) return ''
  value = value.toString()

  return value.toUpperCase()
})

Vue.filter('lowercase', function (value) {
  if (!value) { return '' }
  value = value.toString()

  return value.toLowerCase()
})

Vue.filter('formatPercent', function (value) {
  if (value == 0) {
    return '--'
  }

  return (value * 100).toFixed(2) + '%'
})

Vue.filter('formatPercent2', function (value) {
  return (value * 100).toFixed(2) + '%'
})

Vue.filter('formatStar', function (str) {
  return str.slice(0, 3) + '******' + str.slice(str.length - 3, str.length)
})

Vue.filter('formatDate', function (time) {
  let date = new Date(time * 1000)

  return formatDate(date, 'yyyy-MM-dd hh:mm')
})

Vue.filter('formatDate2', function (time) {
  if (!time) return ''

  let date = parseInt((new Date().getTime()) / 1000 - time)

  if (localStorage.getItem('language') === 'zh-CN') {
    if (date < 60) {
      return date + '秒前'
    }
    if (date >= 60 && date < 3600) {
      return parseInt(date / 60) + '分前'
    }
    if (date >= 3600 && date < (3600 * 24)) {
      return parseInt(date / 3600) + '小时前'
    }
    if (date >= (3600 * 24) && date < (3600 * 24 * 30)) {
      return parseInt(date / (3600 * 24)) + '天前'
    }
    if (date > (3600 * 24 * 30)) {
      return parseInt(date / (3600 * 24 * 30)) + '月前'
    }
  }
  if (localStorage.getItem('language') === 'en-US') {
    if (date < 60) {
      return date + 'seconds ago'
    }
    if (date >= 60 && date < 3600) {
      return parseInt(date / 60) + 'minutes ago'
    }
    if (date >= 3600 && date < (3600 * 24)) {
      return parseInt(date / 3600) + 'hours ago'
    }
    if (date >= (3600 * 24) && date < (3600 * 24 * 30)) {
      return parseInt(date / (3600 * 24)) + 'days ago'
    }
    if (date > (3600 * 24 * 30)) {
      return parseInt(date / (3600 * 24 * 30)) + 'months ago'
    }
  }
})

Vue.filter('formatDate3', function (time) {
  let date = new Date(time * 1000)

  return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
})

function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }

  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
