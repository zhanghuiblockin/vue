<!--矿机详情页-->
<template>
  <div class="wrap">
    <div v-title class="hide-title">{{ $t('m.tit10') }}</div>

    <el-breadcrumb class="mt30 mb30" separator="/">
      <el-breadcrumb-item>{{$t('m.shouye')}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name: 'my_puid_cointype'}" v-if="$store.state.read_token.length==0">{{cur_account.data.name}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name: 'my_puid_cointype',query:{read_token:$store.state.read_token}}" v-else>{{cur_account.data.name}}</el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-dropdown @command="handleRegion" trigger="click">
          <span class="el-dropdown-link" style="cursor:pointer">{{$t('m.'+$route.params.region_id)}}<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="region in regions" :key="region.region_id" :command="region">
              <span>{{$t('m.'+region.region_id)}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{name: 'my_minners'}" v-if="$store.state.read_token.length==0">{{$t('m.kuangji')}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name: 'my_minners',query:{read_token:$store.state.read_token}}" v-else>{{$t('m.kuangji')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{worker_name}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="40">
      <el-col :span="8">
        <div class="box pt30 pb30">
          <h2 class="title s3">{{ $t('m.danjisuanli') }}</h2>
          <ul class="v-line full-height mt35" flex="box:mean">
            <li>
              <h3 class="title s6">{{ $t('m.shishisuanli') }}</h3>
              <p class="f-tac mt10">
                <span class="v"><animated-num :value="shares_15m" fixed=3 /></span>
                <span class="k">{{ shares_unit }}H/s</span>
              </p>
            </li>
            <li v-if="shares_24h!=null">
              <h3 class="title s6">{{$t('m.ershisixiaoshi')}}</h3>
              <p class="f-tac mt10">
                <span class="v"><animated-num :value="shares_24h" fixed=3 /></span>
                <span class="k">{{ shares_unit }}H/s</span>
              </p>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="box pt30 pb30">
          <h2 class="title s3">{{$t('m.yunxingzhuangkuang')}}</h2>
          <ul class="v-line full-height mt35" flex="box:mean">
            <li>
              <h3 class="title s6">{{$t('m.jvjuelv')}}</h3>
              <p class="f-tac mt10">
                <span class="v"><animated-num :value="reject_rate | formatPercent2" fixed=2 />%</span>
              </p>
            </li>
            <li>
              <h3 class="title s6">{{ $t('m.zhuangtai') }}</h3>
              <p class="f-tac mt10">
                <span class="v" v-show="worker_status=='ACTIVE'">{{ $t('m.huoyue') }}</span>
                <span class="v" v-show="worker_status=='INACTIVE'">{{ $t('m.buhuoyue') }}</span>
                <span class="v" v-show="worker_status=='DEAD'">{{ $t('m.shixiao') }}</span>
              </p>
            </li>
            <li>
              <h3 class="title s6">{{ $t('m.zuijintijiaoshijian') }}</h3>
              <p class="f-tac mt10">
                <span class="v">{{ last_share_time | formatDate2 }}</span>
              </p>
            </li>
            <li>
              <h3 class="title s6">{{ $t('m.zuijintijiaoip') }}</h3>
              <p class="f-tac mt10">
                <span class="v">{{ last_share_ip }}</span>
              </p>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>

    <div class="box mt40 mb70">
      <worker-chart></worker-chart>
    </div>
  </div>
</template>
<script>
  import workerChart from "@/components/charts/workerChart.vue"
  import fn from '@/assets/js/function.js'
  import { mapState } from 'vuex'
  import animatedNum from "@/components/pages/animatednum.vue"

  export default {
    name: 'MinerDetailPage',
    components: {
      workerChart,
      animatedNum
    },
    data() {
      return {
        region_id: '',
        puid: '',
        coin_type: '',
        regions: [],
        cur_region: {
          "region_id": "",
          "text_en": "",
          "text_zh-cn": "",
        },
        cur_account: {
          data: {
            name: ''
          }
        },
        api: '',
        worker_show: '',
        worker_id: '',
        worker_name: this.$route.params.worker_name,
        shares_15m: '',
        shares_24h: null,
        reject_rate: '',
        worker_status: '',
        shares_unit: '',
        last_share_time: '',
        last_share_ip: '',
        worker_history: {},
        timer: null
      }
    },
    watch: {
      '$route' (to, from) {
        this.pageInitInterval()
      },
    },
    mounted() {
      this.pageInitInterval()
    },
    methods: {
      handleRegion(command) {
        let self = this;
        $store.commit('setRegionId', command.region_id);
        this.$route.params.region_id = command.region_id
        let cur_coins = fn.getRegionCoins(command.region_id);
        $store.commit('setCurCoins', cur_coins);
        let hasCoinType = 0;
        _.each(fn.getRegionCoins(command.region_id), function (v, i) {
          if (v == self.$route.params.coin_type) {
            hasCoinType = 1
          }
        })
        // if (self.language == 'zh-CN') {
        //   self.region_name = command['text_zh-cn'];
        // }
        // if (self.language == 'en-US') {
        //   self.region_name = command['text_en'];
        // }
        if (!hasCoinType) {
          this.$route.params.coin_type = fn.getRegionCoins(command.region_id)[0];
          $store.commit("setCoinType", $store.state.cur_coins[0]);
        }
        if ($store.state.read_token.length != 0) {
          $router.replace({
            name: 'my_dashboard',
            params: this.$route.params,
            query: {
              read_token: $store.state.read_token
            }
          })
        } else {
          $router.replace({
            name: 'my_dashboard',
            params: this.$route.params
          })
        }
      },
      pageInitInterval() {
        this.timer && clearInterval(this.timer)

        this.pageInit()
        this.timer = setInterval(() => { this.pageInit() }, 10000)
      },
      async pageInit() {
        this.puid = this.$route.params.puid;
        this.coin_type = this.$route.params.coin_type;
        this.region_id = this.$route.params.region_id;
        this.worker_id = this.$route.params.worker_id;
        this.language = localStorage.getItem('language');
        if ($store.state.read_token.length != 0) {
          this.cur_account.data.name = localStorage.getItem("read_subaccount_name")
        } else {
          // 获取userName
          fn.getSubAccountById(this.puid)
            .then(res => {
              this.cur_account = res.data;
            });
        }
        // 获取所有节点
        fn.getAllRegions().then(res => {
          this.regions = res;
          // console.log("所有节点regions:", res);
        });
        // 获取当前节点
        // fn.getRegionInfo(self.region_id).then(res => {
        //   //console.log("cur_region:", res);
        //   if (self.language == 'zh-CN') {
        //     this.region_name = res['text_zh-cn'];
        //   }
        //   if (self.language == 'en-US') {
        //     this.region_name = res['text_en'];
        //   }
        // })
        // 获取矿工详情
        let url = await fn.getApiBaseUrl(self.region_id, self.coin_type)
        if (url == '') {
          this.$message.error("当前币种所在的节点不支持！");
          $router.replace("/my/" + self.puid + "/" + localStorage.getItem('coin_type'))
        }

        this.api = url;
        fn.getWorkerById(api, self.worker_id, self.puid)
          .then(res => {
            if (res.data.err_no == 0) {
              self.worker_show = res.data;
              self.worker_name = res.data.data.worker_name;
              self.shares_15m = res.data.data.shares_15m;
              if (res.data.data.hasOwnProperty('shares_24h')) {
                self.shares_24h = res.data.data.shares_24h;
              } else {
                self.shares_24h = null
              }
              self.reject_rate = res.data.data.reject_rate;
              self.worker_status = res.data.data.worker_status;
              self.last_share_time = res.data.data.last_share_time;
              self.last_share_ip = res.data.data.last_share_ip;
              self.shares_unit = res.data.data.shares_unit;
            } else {
              this.$message.error("获取矿工详情错误！")
              $router.replace({
                name: 'my_puid_cointype',
                path: '/my/' + self.$route.params.puid + '/' + self.$route.params.coin_type
              })
            }
          })
      }
    },
  }
</script>
