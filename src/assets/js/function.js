import Vue from 'vue'
import Vuex from 'vuex'
// import mock from '@/assets/js/mock.js'

export default {
  getYMDHM (nS) {
    // return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
    // return new Date(parseInt(nS) * 1000).toLocaleString().substr(0, 17)
    // return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, '-').replace(/日/g, ' ')
    var date = new Date(nS)
    var Y = date.getFullYear() + '/'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
    var D = (date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ')
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    var s = date.getSeconds()
    return (Y + M + D + h + m)
  },
  getYMD (nS) {
    var date = new Date(nS)
    var Y = date.getFullYear() + '/'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
    return (Y + M + D)
  },
  /**
   * [getLucky 获取矿池幸运值]
   * @Author   Zhanghui
   * @DateTime 2017-12-08
   * @param    {[type]}   coin_type [description]
   * @return   {[type]}             [description]
   */
  getLucky (coin_type) {
    return this.$axios(this.this.$store.state.common_url + '/pool/lucky?coin_type=' + coin_type)
  },
  /**
   * [getBlocks 获取矿池出块数据]
   * @Author   Zhanghui
   * @DateTime 2017-12-08
   * @param    {[type]}   coin_type [description:order_by/page_size]
   * @return   {[type]}             [description]
   */
  getBlocks (coin_type) {
    return this.$axios(this.this.$store.state.common_url + '/pool/blocks/merge?coin_type=' + coin_type)
  },
  /**
   * [getStats 获取矿池实时算力-合并]
   * @Author   Zhanghui
   * @DateTime 2017-12-08
   * @param    {[type]}   coin_type [description]
   * @return   {[type]}             [description]
   */
  getStats (coin_type) {
    return this.$axios(this.this.$store.state.common_url + '/pool/stats/merge?coin_type=' + coin_type)
  },
  /**
   * [getShareHistory 获取矿池算力历史-合并]
   * @Author   Zhanghui
   * @DateTime 2017-12-08
   * @param    {[type]}   count     [description：1-720]
   * @param    {[type]}   dimension [description：1h/1d]
   * @param    {[type]}   coin_type [description]
   * @return   {[type]}             [description]
   */
  getShareHistory (count, dimension, coin_type) {
    return this.$axios(this.$store.state.common_url + '/pool/share-history/merge?count=' + count + '&dimension=' + dimension + '&coin_type=' + coin_type)
  },
  /**
   * [getSubAccount 获取子账户列表]
   * @Author   Zhanghui
   * @DateTime 2017-12-08
   * @return   {[type]}   [description]
   */
  getSubAccount () {
    return this.$axios(this.$store.state.common_url + '/subaccount')
  },
  /**
   * [getSubAccountById 获取子账户详情]
   * @Author   Zhanghui
   * @DateTime 2017-12-08
   * @param    {[type]}   puid [description]
   * @return   {[type]}        [description]
   */
  getSubAccountById (puid) {
    return new Promise(function (relsove, reject) {
      if (!this.$store.state.SubAccount) this.$store.state.SubAccount = {}
      if (this.$store.state.SubAccount['SubAccount' + puid]) {
        relsove(this.$store.state.SubAccount['SubAccount' + puid])
      } else {
        this.$axios(this.$store.state.common_url + '/subaccount/' + puid).then(function (res) {
          this.$store.state.SubAccount['SubAccount' + puid] = res
          relsove(this.$store.state.SubAccount['SubAccount' + puid])
        })
      }
    })
  },
  /**
   * [createAccount 创建子账户]
   * @Author   Zhanghui
   * @DateTime 2017-12-10
   * @param    {[type]}   params [description]
   * @return   {[type]}          [description]
   */
  createAccount (params) {
    return this.$axios.post(this.$store.state.common_url + '/subaccount/create', params)
  },
  /**
   * [getUrl 获取初始接口]
   * 调用方法:fn.getUrl().then(res=>{console.log(res.data)})
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @return   {[type]}   [description]
   */
  getUrl () {
    //console.log('getUrl')
    return this.$axios(this.$store.state.base_url)
    // .then(res => { return mock.getUrl })
  },
  /**
   * [getCoins 获取初始接口所有币种信息中英文名称等]
   * 调用方法:fn.getCoins().then(res=>{console.log(res)})
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @return   {[type]}   [description]
   */
  getCoins () {
    // console.log('getCoins')
    new Promise((resolve, reject) => {
      resolve(this.$store.state.init_url.coins)
    })
    // return this.$axios(this.$store.state.base_url).then(res => { return res.data.coins })
  },
  /**
   * [getAllRegions 获取初始接口的所有节点]
   * 调用方法:fn.getAllRegions().then(res=>{console.log(res)})
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @return   {[type]}   [description]
   */
  getAllRegions () {
    // console.log('getAllRegions')
    // return new Promise((resolve, reject) => {
    //   resolve(this.$store.state.init_url.regions)
    // })
    let coin_type = localStorage.getItem('coin_type')
    let regions = []
    let obj = {}
    return new Promise((resolve, reject) => {
      _.each(this.$store.state.init_url.regions, function (v, k) {
        _.each(v.supported_coin_types, function (v1, k1) {
          if (v1.coin_type == coin_type) {
            obj = { region_id: v.region_id, text_en: v.text_en, 'text_zh-CN': v['text_zh-CN'] }
            regions.push(obj)
          }
        })
      })
      resolve(regions)
    })
  },
  /**
   * [getRegionInfo 获取某个节点的信息]
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   region_id [某个节点]
   * @return   {[type]}             [{}]
   */
  getRegionInfo (region_id) {
    // console.log('getRegionInfo')
    return new Promise((resolve, reject) => {
      let cur_region
      _.each(this.$store.state.init_url.regions, function (v, k) {
        if (v.region_id == region_id) {
          cur_region = v
        }
      })
      resolve(cur_region)
    })
  },
  /**
   * [getUserList 获取帐户列表]
   * 调用方法:fn.getUserList().then(res=>{console.log(res.data)})
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @return   {[type]}   {err,data}
   */
  getUserList () {
    // console.log('getUserList')
    return this.$axios(this.$store.state.common_url + '/subaccount')
  },
  /**
   * [getUser 获取当前帐户信息]
   * 调用方法:fn.getUser(33).then(res=>{console.log(res.data)})
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   puid [description]
   * @return   {[type]}        {err,data}
   */
  getUser (puid) {
    // console.log('getUser')
    return this.$axios(this.$store.state.common_url + '/subaccount/' + puid)
  },
  /**
   * [getZonglanList 获取单个币种多个节点数据]
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   url      [拿到的入口数据]
   * @param    {[type]}   cointype [description]
   * @return   {[type]}            [{region_id,text_en,text_zh-CN,coin_type,api_base_url,coins:{'symbol': 'BTC','text_zh-CN': '比特币','text_en': 'Bitcoin'}}]
   */
  getZonglanList (url, cointype) {
    // console.log('getZonglanList')
    let list = []
    _.each(url.regions, function (v, i) {
      _.each(v.supported_coin_types, function (v1, i1) {
        if (v1.coin_type == cointype) {
          list.push({ 'region_id': v.region_id, 'text_en': v.text_en, 'text_zh-CN': v['text_zh-CN'], 'coin_type': cointype, 'api_base_url': v1.api_base_url, 'coins': url.coins[cointype] })
        }
      })
    })
    return list
  },
  /**
   * [getApiBaseUrl 获取单个节点对应币种的api_base_url]
   * 调用方法:fn.getApiBaseUrl('hangzhou','ltc').then(api=>{console.log(api)})
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   region_id [description]
   * @param    {[type]}   cointype  [description]
   * @return   {[type]}             [返回具体的url:'http://sssss.ssss/']
   */
  getApiBaseUrl (region_id, cointype) {
    // console.log('getApiBaseUrl')
    return new Promise((resolve, reject) => {
      let api_base_url = ''
      _.each(this.$store.state.init_url.regions, function (v, k) {
        if (v.region_id == region_id) {
          _.each(v.supported_coin_types, function (v1, k1) {
            if (v1.coin_type == cointype) {
              api_base_url = v1.api_base_url
            }
          })
        }
      })
      resolve(api_base_url)
    })
  },
  /**
   * [getWorkerStats 获取节点对应币种的api_base_url和实时算力，需要getApiBaseUrl()的支持]
   * 调用方法：fn.getApiBaseUrl('hangzhou','ltc').then(api=>{fn.getWorkerStats(api,33).then(res=>{console.log(res)})})
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   puid       [description]
   * @return   {[type]}              [description]
   */
  getWorkerStats (apiBaseUrl, puid) {
    // console.log('getWorkerStats')
    return this.$axios(apiBaseUrl + '/worker/stats?puid=' + puid)
      .then(res => { return res })
    // .then(res => { return mock.getWorkerStats })
  },
  /**
   * [getPaymentStats 获取支付状态]
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   puid       [description]
   * @return   {[type]}              [description]
   */
  getPaymentStats (apiBaseUrl, puid) {
    // console.log('getPaymentStats')
    return this.$axios(apiBaseUrl + '/payment/stats?puid=' + puid)
      .then(res => { return res })
    // .then(res => { return mock.getPaymentStats })
  },
  /**
   * [getWorkerShareHistory 获取子账户算力图表 worker/share-history/?puid=17&count=72&dimension=1h&start_ts=1506672000]
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   apiBaseUrl [计算所得]
   * @param    {[type]}   puid       [子账户id]
   * @param    {[type]}   count      [显示数量]
   * @param    {[type]}   dimension  [1h,1d]
   * @param    {[type]}   start      [开始的时间戳]
   * @return   {[type]}              [description]
   */
  getWorkerShareHistory (apiBaseUrl, puid, count, dimension, start) {
    // console.log('getWorkerShareHistory')
    return this.$axios(apiBaseUrl + '/worker/share-history?puid=' + puid + '&count=' + count + '&dimension=' + dimension + '&start_ts=' + start)
      .then(res => { return res })
    // .then(res => { return mock.WorkerShareHistory })
  },
  /**
   * [getPaymentHistory 支付历史的表格数据]
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   puid       [description]
   * @return   {[type]}              [description]
   */
  getPaymentHistory (apiBaseUrl, puid, page) {
    // console.log('getPaymentHistory')
    return this.$axios(apiBaseUrl + '/payment/history?puid=' + puid + '&page=' + page)
      .then(res => { return res })
    // .then(res => { return mock.getPaymentHistory })
  },
  /**
   * [getPaymentHistoryReason description]
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   tableData [依赖getPaymentHistory()来获取的数据]
   * @return   {[type]}             [返回一个数组，描述每条记录的原因]
   */
  getPaymentHistoryReason (tableData) {
    // console.log('getPaymentHistoryReason')
    let reason = []
    _.each(tableData, function (v, i) {


      if (v.payment_status == 'DELAYED') {
        if (v.unpaid_reason.code == 'ERR_EMPTY_ADDRESS') {
          // if (localStorage.getItem('language') == 'zh-CN') reason.push('未设定收款地址')
          // if (localStorage.getItem('language') == 'en-US') reason.push('en未设定收款地址')
          reason.push(vue.$t('m.reason1'))
        }
        if (v.unpaid_reason.code == 'ERR_ADDRESS_CHANGED') {
          let address_created_at = new Date(v.unpaid_reason.params.address_created_at) //修改地址时间
          let cooldown = v.unpaid_reason.params.cooldown //修改地址后停止发款时间
          // if (localStorage.getItem('language') == 'zh-CN') reason.push('您已更换新收款地址，新收款地址暂未生效!')
          // if (localStorage.getItem('language') == 'en-US') reason.push('en您已更换新收款地址，新收款地址暂未生效!')
          reason.push(vue.$t('m.reason2'))
        }
        if (v.unpaid_reason.code == 'ERR_BALANCE_TOO_LOW') {
          let minimum_payment_threshold = v.unpaid_reason.params.minimum_payment_threshold //最小起付金额
          let balance = v.unpaid_reason.params.balance //当前余额
          // if (localStorage.getItem('language') == 'zh-CN') reason.push('不足起付额' + minimum_payment_threshold)
          // if (localStorage.getItem('language') == 'en-US') reason.push('en不足起付额' + minimum_payment_threshold)
          // reason.push(vue.$t('m.reason3') + minimum_payment_threshold)
          reason.push(vue.$t('m.reason3'))
        }
      } else {
        reason.push(vue.$t('m.reason4'))
      }
    })
    return reason
  },
  /**
   * [createGroup 建立分组的post请求]
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   puid       [description]
   * @return   {[type]}              [description:null]
   */
  createGroup (apiBaseUrl, puid, params) {
    // console.log('createGroup')
    return this.$axios.post(apiBaseUrl + '/group/create?puid=' + puid, params)
      .then(res => { return res })
  },
  /**
   * [getGroup 获取分组]
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   puid       [description]
   * @return   {[type]}              [{'group_id': 14,'name': '2232312312'},{'group_id': 14,'name': '2232312312'}]
   */
  getGroup (apiBaseUrl, puid) {
    // console.log('getGroup')
    return this.$axios(apiBaseUrl + '/group?puid=' + puid)
      .then(res => { return res.data })
  },
  /**
   * [delGroup 删除分组]
   * @Author   Zhanghui
   * @DateTime 2017-12-06
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   group_id   [description：当前分组的id]
   * @param    {[type]}   puid       [description]
   * @return   {[type]}              [description:null]
   */
  delGroup (apiBaseUrl, group_id, puid) {
    // console.log('delGroup')
    return this.$axios.post(apiBaseUrl + '/group/' + group_id + '/delete?puid=' + puid)
  },
  /**
   * [getWorker 获取矿工列表]
   * @Author   Zhanghui
   * @DateTime 2017-12-07
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   puid       [description:子账户id]
   * @param    {[type]}   group      [description:当前分组的id]
   * @param    {[type]}   status     [description:ALL、ACTIVE、INACTIVE、DEAD]
   * @return   {[type]}              [description]
   */
  getWorker (apiBaseUrl, puid, group, status, page_size) {
    // console.log('getWorker')
    if (group == 0) {
      return this.$axios(apiBaseUrl + '/worker?puid=' + puid + '&status=' + status + '&pagesize=' + page_size)
    } else {
      return this.$axios(apiBaseUrl + '/worker?puid=' + puid + '&group=' + group + '&status=' + status + '&pagesize=' + page_size)
    }
    // .then(res => { return mock.worker })
  },
  /**
   * [searchWorker 搜索矿机]
   * @Author   Zhanghui
   * @DateTime 2017-12-07
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   puid       [description]
   * @param    {[type]}   group      [description]
   * @param    {[type]}   keyword    [description:关键词]
   * @return   {[type]}              [description]
   */
  searchWorker (apiBaseUrl, puid, group, keyword, page_size) {
    // console.log('searchWorker')
    if (group == 0) {
      return this.$axios(apiBaseUrl + '/worker?puid=' + puid + '&keyword=' + keyword + '&pagesize=' + page_size)
    } else {
      return this.$axios(apiBaseUrl + '/worker?puid=' + puid + '&group=' + group + '&keyword=' + keyword + '&pagesize=' + page_size)
    }
  },
  /**
   * [sortWorkder 排序接口]
   * @Author   Zhanghui
   * @DateTime 2017-12-07
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   puid       [description]
   * @param    {[type]}   group      [description]
   * @param    {[type]}   status     [description:ALL、ACTIVE、INACTIVE、DEAD]
   * @param    {[type]}   order_by   [description:worker_name,shares_15m,缺失,reject_rate,last_share_time]
   * @param    {[type]}   sort       [description:asc/desc]
   * @return   {[type]}              [description]
   */
  sortWorkder (apiBaseUrl, puid, group, status, order_by, sort, page, page_size) {
    // console.log('sortWorkder')
    if (group == 0) {
      return this.$axios(apiBaseUrl + '/worker?puid=' + puid + '&status=' + status + '&order_by=' + order_by + '&sort=' + sort + '&page=' + page + '&pagesize=' + page_size)
    } else {
      return this.$axios(apiBaseUrl + '/worker?puid=' + puid + '&group=' + group + '&status=' + status + '&order_by=' + order_by + '&sort=' + sort + '&page=' + page + '&pagesize=' + page_size)
    }
  },
  /**
   * [getWorkerById 获取矿工详情]
   * @Author   Zhanghui
   * @DateTime 2017-12-07
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   worker_id  [description]
   * @param    {[type]}   puid       [description]
   * @return   {[type]}              [description]
   */
  getWorkerById (apiBaseUrl, worker_id, puid) {
    // console.log('getWorkerById')
    return this.$axios(apiBaseUrl + '/worker/' + worker_id + '?puid=' + puid)
    // .then(res => { return mock.workerShow })
  },
  /**
   * [getWorkerIdShareHistory 获取矿工算力历史]
   * @Author   Zhanghui
   * @DateTime 2017-12-07
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   worker_id  [description]
   * @return   {[type]}              [description]
   */
  getWorkerIdShareHistory (apiBaseUrl, worker_id, puid, count, dimension, start_ts) {
    // console.log('getWorkerIdShareHistory')
    return this.$axios(apiBaseUrl + '/worker/' + worker_id + '/share-history?puid=' + puid + '&count=' + count + '&dimension=' + dimension + '&start_ts=' + start_ts)
  },
  /**
   * [getRegionCoins 获取当前节点所有币种]
   * @Author   Zhanghui
   * @DateTime 2017-12-24
   * @param    {[type]}   region_id [description]
   * @return   {[type]}             [description:数组[ltc,dash..]]
   */
  getRegionCoins (region_id) {
    let arr_coins = []
    _.map(this.$store.state.init_url.regions, function (v, i, o) {
      if (v.region_id == region_id) {
        _.map(v.supported_coin_types, function (v1, i1, o1) {
          arr_coins.push(v1.coin_type)
        })
      }
    })
    return arr_coins
  },
  /**
   * [modifyWorkerGroup 修改矿机分组/100分组不存在]
   * @Author   Zhanghui
   * @DateTime 2017-12-25
   * @param    {[type]}   apiBaseUrl [description]
   * @param    {[type]}   puid       [description]
   * @param    {[type]}   params     [description:{worker_ids: [1,2,3,4],group_id: 5}]
   * @return   {[type]}              [description:null]
   */
  modifyWorkerGroup (apiBaseUrl, puid, params) {
    return this.$axios.post(apiBaseUrl + '/worker/group/update?puid=' + puid, params)
  },
  /**
   * [getStratumUrl 获取一个挖矿地址]
   * @Author   Zhanghui
   * @DateTime 2017-12-27
   * @param    {[type]}   region_id [description]
   * @param    {[type]}   coin_type [description]
   * @return   {[type]}             [description:[{url:'stratm+tcp://xxxxx:8080'},{},{}]]
   */
  getStratumUrl (region_id, coin_type) {
    return new Promise((resolve, reject) => {
      let stratum_url = ''
      _.each(this.$store.state.init_url.regions, function (v, k) {
        if (v.region_id == region_id) {
          _.each(v.supported_coin_types, function (v1, k1) {
            if (v1.coin_type == coin_type) {
              stratum_url = v1.stratum_url
            }
          })
        }
      })
      resolve(stratum_url)
    })
  },
  /**
   * [getStratumUrls 根据币种获取所以支持的节点和当前币种的信息]
   * @Author   Zhanghui
   * @DateTime 2017-12-27
   * @param    {[type]}   coin_type [description]
   * @return   {[type]}             [description]
   */
  getStratumUrls (coin_type) {
    // mock.getUrl.data
    // this.$store.state.init_url
    let data = []
    return new Promise((resolve, reject) => {
      let stratum_url = ''
      _.each(this.$store.state.init_url.regions, function (v, k) {
        _.each(v.supported_coin_types, function (v1, k1) {
          if (v1.coin_type == coin_type) {
            data.push({ region_id: v.region_id, text_en: v.text_en, 'text_zh-CN': v['text_zh-CN'], coin_info: v1 })
          }
        })
      })
      resolve(data)
    })
  },
  /**
   * [getSummary 子账户概览列表]
   * @Author   Zhanghui
   * @DateTime 2017-12-27
   * @param    {[type]}   puid       [description]
   * @param    {[type]}   coin_typ   [description]
   * @return   {[type]}              [description]
   */
  getSummary (puid, coin_type) {
    return this.$axios(this.$store.state.common_url + '/subaccount/summary?puid=' + puid + '&coin_type=' + coin_type)
  },
  /**
   * [getApiBaseUrls 根据币种获取到所有节点的api_base_url]
   * @Author   Zhanghui
   * @DateTime 2017-12-27
   * @param    {[type]}   coin_type [description]
   * @return   {[type]}             [description]
   */
  getAllRegionByCoin (coinType) {
    let regions = []
    let obj = {}
    return new Promise((resolve, reject) => {
      _.each(this.$store.state.init_url.regions, function (v, k) {
        _.each(v.supported_coin_types, function (v1, k1) {
          if (v1.coin_type === coinType) {
            obj = { region_id: v.region_id, text_en: v.text_en, 'text_zh-CN': v['text_zh-CN'] }
            regions.push(obj)
          }
        })
      })
      resolve(regions)
    })
  },
  /**
   * 创建 token
   */
  createToken (puid, params) {
    return this.$axios.post(this.$store.state.common_url + '/watcher/token/create?puid=' + puid, params)
  },
  /**
   * 列出 token
   */
  listToken (puid, coin) {
    return this.$axios(this.$store.state.common_url + '/watcher/token?puid=' + puid + '&coin_type=' + coin)
  },
  /**
   * 获取 token 详情
   */
  getTokenInfo (token) {
    return this.$axios(this.$store.state.common_url + '/watcher/token/info?token=' + token)
  },
  /**
   * 移除 token
   */
  delToken (puid, params) {
    return this.$axios.post(this.$store.state.common_url + '/watcher/token/delete?puid=' + puid, params)
  },
  /**
   * 获取所支持币种
   */
  getCoinsOnly (obj) {
    console.log(obj)
    let arrCoins = []
    _.map(obj.coins, function (value, key, object) {
      var isShow = value.available
      var order = value.order
      if (isShow) {
        arrCoins[order] = key
      }
    })

    arrCoins = _.filter(arrCoins, function (v, i, o) {
      return v !== undefined
    })
    return arrCoins
  }

}
