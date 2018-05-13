<!--支付页面->
<template>
  <div class="wrap pb70">
    <div v-title class="hide-title">{{$t('m.tit11')}}</div>
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
      <el-breadcrumb-item>{{$t('m.shouyi')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="40">
      <el-col :span="12">
        <div class="box pt30 pb30">
          <ul class="v-line full-height" flex="box:mean">
            <li>
              <h2 class="title s3">{{$t('m.leijiyizhifu')}}</h2>
              <p class="f-tac mt20">
                <span class="v"><animated-num :value="PaymentStats.total_paid_amount/Math.pow(10,provider)" :fixed=decimal></animated-num></span>
                <span class="k">{{init_url.coins[$store.state.coin_type]['symbol']}}</span></p>
            </li>
            <li>
              <h2 class="title s3">{{$t('m.yue')}}
                <el-popover ref="popover2" placement="bottom" title="" width="250" trigger="hover" :content="$t('m.tips50')"></el-popover>
                <el-button type="text" v-popover:popover2 class="gray-to-blue"><i class="iconfont icon-bangzhu"></i></el-button>
              </h2>
              <p class="f-tac mt20">
                <span class="v"><animated-num :value="PaymentStats.balance/Math.pow(10,provider)" :fixed=decimal></animated-num></span>
                <span class="k">{{init_url.coins[$store.state.coin_type]['symbol']}}</span>
              </p>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="12" class="f-pr">

        <div style="position:absolute;right:20px; top:-40px" v-show="cur_account.data.default_coin_type==='ltc'">
          <el-popover ref="popover3" placement="bottom" title="" width="250" trigger="hover" :content="$t('m.tips83')"></el-popover>
          <el-button type="text" v-popover:popover3 class="gray-to-blue" @click="DialogVisible3=true"><i class="iconfont icon-bangzhu"></i> {{$t('m.tips82')}}</el-button>
        </div>
        <el-dialog custom-class="my-dialog" :title="$t('m.dogobutiedizhizhezhi')" :visible.sync="DialogVisible3" :lock-scroll="false" :before-close="d3Close">
          <dialog-doge-address ref="d3" :params_puid="cur_account.data.puid" :params_coin_type="cur_account.data.default_coin_type" :params_user_info="cur_account.data" v-on:listenDialog="closeDialog"></dialog-doge-address>
        </el-dialog>

        <div class="box pt30 pb30">
          <ul class="v-line full-height" flex="box:mean">
            <li>
              <h2 class="title s3">{{$t('m.jinriyugu')}}
                <el-button type="text" class="gray-to-blue"><i class="iconfont icon-jisuanqi"></i></el-button>
              </h2>
              <p class="f-tac mt20">
                <span class="v"><animated-num :value="PaymentStats.today_estimate/Math.pow(10,provider)" :fixed=decimal></animated-num></span>
                <span class="k">{{init_url.coins[$store.state.coin_type]['symbol']}}</span>
              </p>
            </li>
            <li>
              <h2 class="title s3">{{$t('m.zuorishouyi')}}
                <el-popover ref="popover1" placement="bottom" title="" width="250" trigger="hover" :content="$t('m.tips28')"></el-popover>
                <el-button type="text" v-popover:popover1 class="gray-to-blue"><i class="iconfont icon-bangzhu"></i></el-button>
              </h2>
              <p class="f-tac mt20">
                <span class="v"><animated-num :value="PaymentStats.yesterday_amount/Math.pow(10,provider)" :fixed=decimal></animated-num></span>
                <span class="k">{{init_url.coins[$store.state.coin_type]['symbol']}}</span>
              </p>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <div class="box mt40">
      <el-table :data="PaymentHistory.data" style="width: 100%" v-loading="loading" :empty-text="$t('m.nodata')">
        <el-table-column prop="date" :label="$t('m.wakuangriqi')" align="center">
          <template slot-scope="scope">
                {{scope.row.date|date422}}
</template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('m.shouyishue')" align="right">
<template slot-scope="scope">
  <span>{{(scope.row.amount/Math.pow(10,provider)).toFixed(decimal)}}</span>
</template>
        </el-table-column>
        <el-table-column prop="change" :label="$t('m.ribiandong')" align="right">
<template slot-scope="scope">
  <b class="color-red" v-if="scope.row.change>0" style="font-weight:normal">+{{scope.row.change|formatPercent}}</b>
  <b class="color-green" v-else style="font-weight:normal">{{scope.row.change|formatPercent}}</b>
</template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('m.zhifushijian')" width=200 align="center">
<template slot-scope="scope">
  <span v-if="scope.row.created_at">{{scope.row.created_at|formatDate}}</span>
  <span v-else>--</span>
</template>
        </el-table-column>
        <el-table-column prop="address" :label="$t('m.zhifudizhi')" width=320 align="center">
<template slot-scope="scope">
  <p class="eq-font">
    <a target="_blank" :href="'https://s.blockin.com/explorer-redirect/index.html?coin='+$route.params.coin_type+'&type=tx&key='+scope.row.txhash">{{scope.row.address}}</a>
    <!-- {{scope.row.address}} -->
</p>
<!-- <p class="f-tac color-blue" style="font-size:12px;">判断标准??新地址已生效</p> -->
</template>
</el-table-column>
<el-table-column prop="payment_status" :label="$t('m.zhifuzhuangtai')" width=180 align="center">
  <template slot-scope="scope">
    <!-- {{scope.$index}} -->
    <span v-if="scope.row.payment_status=='PAID'"><el-button type="text" size="mini" style="color:#666;cursor:default;">{{$t('m.yizhifu')}}</el-button></span>
    <span v-if="scope.row.payment_status=='PENDING'"><el-button type="text" size="mini"
                                                                style="color:#666;cursor:default;">{{$t('m.daizhifu')}}</el-button></span>
    <span v-if="scope.row.payment_status=='DELAYED'"><el-button type="text" size="mini"
                                                                style="color:#fa5943;cursor:default;">{{$t('m.cunruyue')}}</el-button><i
      style="font-family:simsun;color:#ccc; padding-left: 5px; padding-right: 5px;">|</i><el-tooltip class="item"
                                                                                                     effect="dark"
                                                                                                     :content="reason[scope.$index]"
                                                                                                     placement="top"><el-button
      type="text" size="mini">{{$t('m.yuanyin')}}</el-button></el-tooltip></span>
  </template>
</el-table-column>
</el-table>
<div class="f-tac pt20 pb20">
  <el-pagination background layout="prev, pager, next" :total="PaymentHistory.total"
                 :page-size="PaymentHistory.per_page" @current-change="handleCurrentChange"></el-pagination>
</div>
</div>
</div>
</template>

<script>
  import DialogDogeAddress from "@/components/common/DialogDogeAddress";
  import fn from '@/assets/js/function.js';
  import {
    mapState
  } from 'vuex';
  import animatedNum from "@/components/pages/animatednum.vue";

  export default {
    name: "my_payments",
    components: {
      animatedNum,
      DialogDogeAddress
    },
    data() {
      return {
        DialogVisible3: false,
        reason: "",
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
        PaymentStats: {
          total_paid_amount: 0,
          balance: 0,
          today_estimate: 0,
          yesterday_amount: 0
        },
        PaymentHistory: {},
        language: localStorage.getItem('language'),
        region_name: '',
        loading: true,
        api: ''
      }
    },
    methods: {
      d3Close: function (done) {
        this.$refs.d3.init(); // 对DOGE收款地址子组件进行初始化
        done();
      },
      closeDialog: function (payload) {
        this.DialogVisible3 = false;
        this.pageInit()
      },
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
      handleCurrentChange(v) {
        self = this;
        let puid = this.$route.params.puid;
        let coin_type = this.$route.params.coin_type;
        let region_id = this.$route.params.region_id;
        // 获取支付历史
        fn.getApiBaseUrl(region_id, coin_type)
          .then(api => fn.getPaymentHistory(api, puid, v))
          .then(res => {
            self.PaymentHistory = res.data.data;
            self.reason = fn.getPaymentHistoryReason(res.data.data.data);
          })
      },
      pageInitInterval() {
        let self = this;
        clearInterval(window.dingshiqi)
        self.pageInit();
        window.dingshiqi = setInterval(function () {
          self.pageInit();
        }, $store.state.refresh_time)
      },
      pageInit() {
        self = this;
        let puid = this.$route.params.puid;
        let coin_type = this.$route.params.coin_type;
        let region_id = this.$route.params.region_id;
        this.language = localStorage.getItem('language');
        if ($store.state.read_token.length != 0) {
          this.cur_account.data.name = localStorage.getItem('read_subaccount_name')
        } else {
          // 获取userName
          fn.getSubAccountById(puid)
            .then(res => {
              self.cur_account = res.data;
            });
        }
        // 获取所有节点
        fn.getAllRegions().then(res => {
          this.regions = res;
          // console.log("所有节点regions:", res);
        });
        // 获取支付状态
        fn.getApiBaseUrl(region_id, coin_type).then(api => {
          this.api = api;
          fn.getPaymentStats(api, puid).then(res => {
            if (res.data.err_no == 0) {
              this.PaymentStats = res.data.data;
            } else {
              this.$message.error(this.$t('m.tips51'))
              $router.replace({
                name: 'my_puid_cointype',
                path: '/my/' + self.$route.params.puid + '/' + self.$route.params.coin_type
              })
            }
            self.loading = false;
          });
        })
      },
      refreshPaymentHistory() {
        self = this;
        let puid = this.$route.params.puid;
        let coin_type = this.$route.params.coin_type;
        let region_id = this.$route.params.region_id;
        fn.getApiBaseUrl(region_id, coin_type).then(api => {
          fn.getPaymentHistory(api, puid, 1).then(res => {
            self.PaymentHistory = res.data.data;
            self.reason = fn.getPaymentHistoryReason(res.data.data.data);
            self.loading = false;
          })
        })
      }
    },
    computed: {
      ...mapState(["init_url", "cur_coins", "is_login"]),
      refresh(v) {
        return $store.state.refresh;
      },
      provider: function () {
        return this.$store.state.init_url.coins[this.$route.params.coin_type].render_precision;
      },
      decimal: function () {
        return this.$store.state.init_url.coins[this.$route.params.coin_type].decimal;
      },
    },
    watch: {
      '$route'(to, from) {
        this.pageInitInterval();
        this.refreshPaymentHistory()
      },
      refresh(v) {
        this.pageInitInterval()
        this.refreshPaymentHistory()
      }
    },
    mounted() {
      this.pageInitInterval();
      // 获取支付历史
      this.refreshPaymentHistory()
    }
  };
</script>
