<!--用户首页-->
<template>
  <div class="wrap" v-loading="loading">
    <div v-title class="hide-title">{{ $t('dashboard.title') }}</div>

    <el-breadcrumb class="mt30 mb30" separator="/">
      <el-breadcrumb-item>{{ $t('common.index') }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="$store.state.read_token.length === 0" :to="{name: 'my_puid_cointype'}">
        {{ cur_account.data.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-else :to="{name: 'my_puid_cointype',query:{ read_token:$store.state.read_token }}">
        {{ cur_account.data.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-dropdown @command="handleRegion" trigger="click">
          <span class="el-dropdown-link" style="cursor:pointer">
            {{ $t('common.'+$route.params.regionId) }}
            <i class="el-icon-arrow-down el-icon--right"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="region in regions" :key="region.regionId" :command="region">
              <span>{{ $t('common.'+region.regionId) }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!--xx-->

    <div class="box mt40 mb40 pb20">
      <WorkerShareHistory1></WorkerShareHistory1>
    </div>

    <el-row :gutter="40" class="mb70">
      <!--挖矿地址-->
      <el-col :span="12">
        <div class="box p50 pt30 pb30" style="min-height:180px">
          <h2 class="title s4 mb20">{{ $t('dashboard.mining-address') }}</h2>
          <p class="mb5" v-for="(stratum,i) in stratum_url" :key="i">{{stratum.url}}</p>
          <p>{{ $t('dashboard.mining-tip') }}"{{cur_account.data.name}}.001", "{{cur_account.data.name}}.002".</p>
        </div>
      </el-col>

      <!--运营-->
      <el-col :span="12">
        <div class="box p50 pt30 pb30" style="min-height:180px">
          <h2 class="title s4 mb20">{{ $t('dashboard.operation') }}</h2>
          <p v-html="$t('dashboard.operation-text')"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import WorkerShareHistory1 from '@/components/charts/WorkerShareHistory1.vue'
import fn from '@/assets/js/function.js'
import animatedNum from '@/components/pages/animatednum.vue'
export default {
  name: 'my_dashboard',
  components: {
    WorkerShareHistory1,
    animatedNum
  },
  data () {
    return {
      regions: [],
      // cur_region: {
      //   'regionId': '',
      //   'text_en': '',
      //   'text_zh-cn': '',
      // },
      cur_account: {
        data: {
          name: ''
        }
      },
      suanli: {},
      payment_stats: {
        yesterday_amount: 0,
        today_estimate: 0
      },
      region_name: '',
      language: localStorage.getItem('language'),
      loading: true,
      stratum_url: [],
      api: '',
      timer: null
    }
  },
  watch: {
    $route (to, from) {
      this.pageInitInterval()
    }
  },
  mounted () {
    this.pageInitInterval()
  },
  methods: {
    goMiners () {},
    goPayments () {},
    handleRegion (command) {
      this.$store.commit('setRegionId', command.regionId)
      this.$route.params.regionId = command.regionId
      if (localStorage.getItem('read_token')) {
        this.$router.replace({
          name: this.$route.name,
          params: this.$route.params,
          query: {
            read_token: localStorage.getItem('read_token')
          }
        })
      } else {
        this.$router.replace({
          name: this.$route.name,
          params: this.$route.params
        })
      }
    },
    pageInitInterval () {
      this.timer && clearInterval(this.timer)
      this.pageInit()
      this.timer = setInterval(() => {
        this.pageInit()
      }, 10000)
    },
    pageInit () {
      let puid = this.$route.params.puid
      let coinType = this.$route.params.coin_type
      let regionId = this.$route.params.region_id
      this.language = localStorage.getItem('language')
      // 获取stratum_url
      fn.getStratumUrl(regionId, coinType).then(res => {
        self.stratum_url = res
      })
      if (this.$store.state.read_token.length !== 0) {
        this.cur_account.data.name = localStorage.getItem(
          'read_subaccount_name'
        )
      } else {
        // 获取userName
        fn.getSubAccountById(puid).then(res => {
          if (res.data.err_no === 0) {
            this.cur_account = res.data
          } else {
            this.$message.error(this.$t('m.tips31'))
            this.$router.replace({
              path: '/my'
            })
          }
        })
      }
      // 获取所有节点
      fn.getAllRegions().then(res => {
        this.regions = res
        // console.log('regions:', res)
      })
      // 获取当前节点信息
      // fn.getRegionInfo(regionId).then(res => {
      //   if (self.language === 'zh-CN') {
      //     this.region_name = res['text_zh-cn']
      //   }
      //   if (self.language === 'en-US') {
      //     this.region_name = res['text_en']
      //   }
      // })
      // 请求实时算力
      fn.getApiBaseUrl(regionId, coinType).then(api => {
        this.api = api
        fn.getWorkerStats(api, puid).then(res => {
          if (res.data.err_no === 0) {
            self.suanli = res.data.data
          } else {
            this.$message.error(this.$t('m.tips32'))
          }
        })
      })
      // 获取收益
      fn.getApiBaseUrl(regionId, coinType).then(api => {
        fn.getPaymentStats(api, puid).then(res => {
          if (res.data.err_no === 0) {
            self.payment_stats = res.data.data
          } else {
            this.$message.error(this.$t('m.tips33'))
          }
          self.loading = false
        })
      })
    }
  }
}
</script>
