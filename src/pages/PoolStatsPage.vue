<!--矿池统计页面-->
<template>
  <div class="wrap pt30 pb70">
    <div v-title class="hide-title">{{$t('m.tit2')}}</div>

    <pool-stats-summary/>

    <!--统计算力图-->
    <div class="box mt40">
      <statsChart chartCoin='eth'></statsChart>
    </div>

    <pool-stats-luck/>

    <pool-stats-relayed-block/>
  </div>
</template>
<script>
  import fn from '@/assets/js/function.js';
  import { mapState } from 'vuex';
  import statsChart from "@/components/charts/statsChart.vue";
  import animatedNum from "@/components/pages/animatednum.vue";

  export default {
    name: "PoolStatsPage",
    components: {
      statsChart,
      animatedNum
    },
    data() {
      return {
        statsData: {
          total_rewards: 0,
          "shares": {
            "shares_1m": 0,
            "shares_5m": 0,
            "shares_15m": 0,
            "shares_1h": 0,
            "shares_unit": ""
          },
          "reject": {
            "1m": 0,
            "5m": 0,
            "15m": 0,
            "1h": 0
          },
          "workers": 0,
          "users": 0
        },
        lucky: {},
        mergeTableData: [],
        language: '',
        allRegions: [],
        regionsName: [],
      }
    },
    watch: {
      '$route' (to, from) {
        this.pageInitInterval()
      },
      refresh(v) {
        this.pageInitInterval()
      },
    },
    mounted() {
      this.pageInitInterval()
    },
    methods: {
      pageInitInterval() {
        let self = this;
        clearInterval(window.dingshiqi)
        self.pageInit();
        window.dingshiqi = setInterval(function () {
          self.pageInit();
        }, $store.state.refresh_time)
      },
      pageInit() {
        let self = this;
        this.language = localStorage.getItem('language');
        fn.getStats($store.state.coin_type).then(res => {
          self.statsData = res.data.data;
          //console.log('四块数据:',this.statsData)
        });
        // if ($store.state.coin_type != "dash") {
        fn.getLucky($store.state.coin_type).then(res => self.lucky = res.data.data);
        // }
        fn.getBlocks($store.state.coin_type).then(res => self.mergeTableData = res.data.data.blocks.data);
      }
    },
    computed: {
      ...mapState(["txt", "init_url", "cur_coins", "is_login"]),
      provider:function () {
        return this.$store.state.init_url.coins[this.$route.params.coin_type].render_precision;
      },
      decimal:function () {
        return this.$store.state.init_url.coins[this.$route.params.coin_type].decimal;
      },
      refresh() {
        return $store.state.refresh
      },
      result: function () {
        return this.firstNumber + this.secondNumber
      },
      computed_workers:function () {
        if(this.statsData.workers==null) {
          this.statsData.workers=0
        }
        return this.statsData.workers
      },
      computed_shares_1h:function () {
        if(this.statsData.shares.shares_1h==null) {
          this.statsData.shares.shares_1h=0
        }
        return this.statsData.shares.shares_1h
      },
      computed_total_rewards:function () {
        if(this.statsData.total_rewards==null) {
          this.statsData.total_rewards=0
        }
        return this.statsData.total_rewards
      },
      computed_total_blocks:function () {
        if(this.statsData.total_blocks==null) {
          this.statsData.total_blocks=0
        }
        return this.statsData.total_blocks;
      },
    },
  }
</script>
