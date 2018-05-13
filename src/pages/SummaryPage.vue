<!--总览界面-->
<template>
  <div class="wrap pb70">
    <div v-title class="hide-title">{{ $t('m.tit7') }}</div>

    <el-breadcrumb separator="/" class="mt30">
      <el-breadcrumb-item>{{ $t('common.index') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ cur_account.data.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div v-show='show === 1'>
      <div class="box mt30 pl50 pr50 pb40 minners-add">
        <h2 class="title s4 mt30"><span class="iconfont icon-tips" style="font-size: 30px; color: #0082E6;"></span>
          {{$t('m.tips11')}}</h2>
        <div class="txt">
          <p v-html="$t('m.tips7')"></p>
          <p>
            {{ $t('m.tips8') }}{{ cur_account.data.name }}{{ $t('m.tips9') }}{{ cur_account.data.name }}.001、{{ cur_account.data.name }}.002{{ $t('m.tips10') }}</p>
        </div>
        <h2 class="title s3 mt30">{{ $t('m.kuangjipeizhishili') }}</h2>
        <div class="minners-tabs mt40">
          <div class="tab-tit f-cb">
            <li 
              v-for="(demo,idx) in demoData" 
              :key="demo.region_id" 
              @click="demoIdx=idx"
              :class="demoIdx==idx?'active':''">
              <b>{{ $t('m.' + demo.region_id) }}</b>
            </li>
          </div>
          <div class="tab-con">
            <form action="#" onsubmit="return false;">
              <ul>
                <li v-for="(stratum_url,urlIdx) in demoData[demoIdx].coin_info.stratum_url" :key="stratum_url.url">
                  <label for="">url{{ urlIdx+1 }}</label>
                  <input type="text" :value="stratum_url.url" :model="message[urlIdx]=stratum_url.url" class="eq-font"
                         disabled=""/>
                  <button class="btn active" v-clipboard:copy="message[urlIdx]" v-clipboard:success="onCopy"
                          v-clipboard:error="onError">{{$t('m.copy')}}
                  </button>
                </li>
                <li>
                  <label for="">worker</label>
                  <input type="text" :value="cur_account.data.name+'.001'" class="eq-font" disabled=""/>
                </li>
                <li>
                  <label for="">password</label>
                  <input type="text" value="123" class="eq-font" disabled=""/>
                  <!-- <span style="color: #999;">建议不填</span> --></li>
              </ul>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-show="show === 2">
      <div v-for="(item,i) in list" :key="i">
        <zonglan-chart :item="item" />
      </div>
    </div>
  </div>
</template>
<script>
import fn from '@/assets/js/function.js'
import zonglanChart from '@/components/charts/zonglanChart.vue'
// import { mapState } from 'vuex'

export default {
  name: 'ConnectPoolPage',
  components: {
    zonglanChart
  },
  data() {
    return {
      puid: '',
      cur_account: {
        data: {
          name: '' // 面包屑name
        }
      },
      show: 0, // 显示哪个区块1:无矿机,2:有矿机
      list: [],
      itemIdx: 0,
      demoData: [
        {
          region_id: '',
          text_en: '',
          'text_zh-cn': '',
          coin_info: {
            coin_type: '',
            stratum_url: [],
            api_base_url: '',
            merge_mining_coins: [
              {
                coin_type: ''
              }
            ]
          }
        }
      ],
      demoIdx: 0,
      message: [],

      timer: null
    }
  },
  watch: {
    $route(to, from) {
      this.pageInitInterval()
    }
  },
  mounted () {
    this.pageInitInterval()
  },
  beforeDestroy () {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    onCopy: function (e) {
      alert(this.$t('m.tips75') + e.text)
    },
    onError: function (e) {
      alert(this.$t('m.tips68'))
    },
    pageInitInterval () {
      this.timer && clearInterval(this.timer)

      this.pageInit()
      this.timer = setInterval(() => {
        this.pageInit()
      }, 10000)
    },
    pageInit () {
      this.puid = this.$route.params.puid
      this.coin_type = this.$route.params.coin_type
      // 获取userName
      if (this.$store.state.read_token.length !== 0) {
        this.cur_account.data.name = localStorage.read_subaccount_name
      } else {
        fn.getSubAccountById(this.puid).then(res => {
          if (res.data.err_no === 0) {
            this.cur_account = res.data
          } else {
            this.$message.error(this.$t('m.tips73'))
            $router.replace({
              path: '/my'
            })
          }
        })
      }
      fn.getSummary(self.puid, self.coin_type).then(res => {
        if (res.data.err_no === 0) {
          if (res.data.data.length > 0) {
            self.show = 2
            _.each(res.data.data, function (v, i) {
              _.each(this.$store.state.init_url.regions, function (v1, k1) {
                if (v.region_id === v1.region_id) {
                  v['text_zh-cn'] = v1['text_zh-cn']
                  v['text_en'] = v1['text_en']
                  _.each(v1.supported_coin_types, function (v2, k2) {
                    if (v2.coin_type === self.coin_type) {
                      v['api_base_url'] = v2.api_base_url
                    }
                  })
                }
              })
            })
            self.list = res.data.data
          } else {
            self.show = 1
            // 获取支持当前币种的节点信息和当前币种信息
            fn.getStratumUrls(self.coin_type).then(res => {
              self.demoData = res
            })
          }
        } else {
          this.$message.error(this.$t('m.tips74'))
        }
      })
    }
  }
}
</script>
