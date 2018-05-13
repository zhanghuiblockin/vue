<!--首页-->
<template>
  <div>
    <div v-title class="hide-title">{{$t('m.tit1')}}</div>
    <div class="index" v-if="!is_login">
      <div class="polin">
        <i></i>
        <i></i>
        <i></i>
        <b></b>
        <b></b>
        <b></b>
        <b></b>
        <div class="txt">
          <h2>{{$t('m.slogen1')}}</h2>
          <p v-html="$t('m.slogen2')"></p>
          <div class="f-tac mt30">
            <el-button @click="goReg" round type="primary" style="transform:scale(1.2)">&nbsp;&nbsp;&nbsp;{{$t('m.zhuce')}}&nbsp;&nbsp;&nbsp;</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button @click="goLogin" round type="primary" style="transform:scale(1.2)">&nbsp;&nbsp;&nbsp;{{$t('m.denglu')}}&nbsp;&nbsp;&nbsp;</el-button>
          </div>
        </div>
      </div>

      <div class="bg dot">
        <div class="wrap pb70">
          <div class="box mt65 f-pr" v-for="coin in cur_coins" :key="coin">
            <div class="help-menu">
              <a href="https://blockin.zendesk.com/hc/zh-cn/categories/360000299971-%E6%8C%96%E7%9F%BF%E6%95%99%E7%A8%8B"
              target="_blank"><i class="iconfont icon-shezhi" style="font-size:18px;"></i> 挖矿设置&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
              <i class="iconfont icon-bangzhu"></i> 如何卖币</a></div>
            <indexChart :params_coin=coin></indexChart>
          </div>
        </div>
      </div>

      <home-pool-luck/>

      <div class="bg blue-black">
        <h2>{{$t('m.slogen1')}}</h2>
        <p><img src="../assets/img/index-bo.png"/></p>
      </div>

      <home-relayed-blocks/>

    </div>
  </div>
</template>

<script>
import HomeRelayedBlocks from './HomePage/HomeRelayedBlocks'
import HomeChart from './HomePage/HomeChart'
import HomePoolLuck from './HomePage/HomePoolLuck'
import fn from '@/assets/js/function.js'
import { mapState } from 'vuex'
import indexChart from '@/components/charts/indexChart.vue'

export default {
  name: 'HomePage',
  components: {
    HomeChart,
    HomePoolLuck,
    HomeRelayedBlocks,
    indexChart
  },
  data() {
    return {
      coin_type: '',
      params_coin: '', //等待传递的币种参数
      luckIndex: 0, //幸运值初始索引
      luckData: {
        '3days': '--',
        '7days': '--',
        '30days': '--',
        '90days': '--'
      },
      mergeIndex: 0, //广播区块初始索引
      mergeTableData: [], //广播区块表格数据
      prizeList: [
        {
          name: 0
        },
        {
          name: 1
        },
        {
          name: 2
        },
        {
          name: 3
        },
        {
          name: 4
        }
      ],
      activeIndex: 0,
      language: localStorage.getItem('language')
    }
  },
  computed: {
    ...mapState(['txt', 'init_url', 'cur_coins', 'is_login']),
    provider: function() {
      return this.$store.state.init_url.coins[this.coin_type].render_precision
    },
    decimal: function() {
      return this.$store.state.init_url.coins[this.coin_type].decimal
    },
    top() {
      return -this.activeIndex * 61 + 'px'
    }
  },
  mounted() {
    this.pageInit()
  },
  methods: {
    // pageInitInterval() {
    //   let self = this
    //   clearInterval(window.dingshiqi)
    //   self.pageInit()
    //   window.dingshiqi = setInterval(function () {
    //     self.pageInit()
    //   }, $store.state.refresh_time)
    // },
    goLogin() {
      const params = {
        client_id: this.$store.state.client_id,
        response_type: 'token id_token',
        redirect_uri: this.$store.state.redirect_uri,
        scope: 'openid profile email phone write read',
        state: Date.now(),
        nonce: Date.now()
      }
      const url =
        this.$store.state.uc_url +
        '/oauth/v1/authorize?' +
        Object.keys(params)
          .map(k => `${k}=${params[k]}`)
          .join('&')
      window.location.href = url
    },
    goReg() {
      const params = {
        client_id: this.$store.state.client_id,
        response_type: 'token id_token',
        redirect_uri: this.$store.state.redirect_uri,
        scope: 'openid profile email phone write read',
        state: Date.now(),
        nonce: Date.now(),
        signup: 1
      }
      const url =
        this.$store.state.uc_url +
        '/oauth/v1/authorize?' +
        Object.keys(params)
          .map(k => `${k}=${params[k]}`)
          .join('&')
      window.location.href = url
    },
    pageInit() {
      this.language = localStorage.getItem('language')
      setInterval(_ => {
        if (this.activeIndex < this.prizeList.length - 1) {
          this.activeIndex += 1
        } else {
          this.activeIndex = 0
        }
      }, 3000)
      let is_login = $store.state.is_login
      if (is_login) {
        let local_puid = localStorage.getItem('puid')
        let local_coin_type = localStorage.getItem('coin_type')
        let local_region_id = localStorage.getItem('region_id')
        if (local_puid && local_coin_type && local_region_id) {
          $router.replace(
            '/my/' +
              local_puid +
              '/' +
              local_coin_type +
              '/' +
              local_region_id +
              '/dashboard'
          )
        } else {
          $router.replace('/my/welcome')
        }
      } else {
        this.getLucky($store.state.cur_coins[0], this.luckIndex)
        this.getBlocks($store.state.cur_coins[0], this.mergeIndex)
      }
    },
    getLucky: function(coin_type, idx) {
      let self = this
      fn.getLucky(coin_type).then(res => {
        self.luckData = res.data.data
        self.luckIndex = idx
      })
    },
    getBlocks: function(coin_type, idx) {
      let self = this
      self.coin_type = coin_type
      fn.getBlocks(coin_type).then(res => {
        if (res.data.err_no === 0) {
          self.mergeTableData = res.data.data.blocks.data
          self.mergeIndex = idx
        } else {
          this.$message.error('获取区块数据错误！')
        }
      })
    }
  }
}
</script>

<style lang="less">
.scroll-wrap {
  height: 61px;
  overflow: hidden;
}

.scroll-content {
  position: relative;
  transition: top 0.5s;
  li {
    line-height: 61px;
    a {
      color: #fff;
    }
  }
}

.help-menu {
  position: absolute;
  right: 0;
  top: -40px;
  a:hover {
    color: #18a8ea;
  }
}
</style>
