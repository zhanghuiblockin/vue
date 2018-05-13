<template>
  <div>
    <h2 class="title s5 mt50 mb30">{{$t('m.' + params_coin)}} {{$t('m.suanlitubiao')}}</h2>
    <p class="f-tac">
      <span class="v"><animated-num :value="shares_1h" :fixed=2></animated-num></span><span class="k">{{shares_unit}}H/s</span><span class="blank"></span>
      <span class="v"><animated-num :value="workers" :fixed=0></animated-num></span><span class="k">{{$t('m.zaixiankuangji')}}</span><span class="blank"></span>
      <span class="v">{{feilv}}&nbsp;&nbsp;&nbsp;PPS</span><span class="k">{{$t('m.tips78')}}</span>
    </p>
    <div class="c-charts">
      <IEcharts :option="line"></IEcharts>
    </div>
  </div>
</template>

<script>
  import fn from "@/assets/js/function.js";
  import {
    mapState
  } from "vuex";
  import IEcharts from "vue-echarts-v3";
  import animatedNum from "@/components/pages/animatednum.vue";
  export default {
    components: {
      IEcharts,
      animatedNum
    },
    props: ["params_coin"],
    data() {
      return {
        shares_1h: 0,
        shares_unit: "",
        workers: 0,
        shareHistoryTime: [], // 算力历史时间
        shareHistoryYes: [], // 算力历史成功
        shareHistoryNo: [], // 算力历史拒绝
        language: localStorage.getItem("language"),
        unit: ""
      };
    },
    computed: {
      ...mapState(["init_url", "cur_coins"]),
      params_coin_com: function () {
        return this.params_coin.toUpperCase();
      },
      feilv: function () {
        return this.$store.state.init_url.coins[this.params_coin].fee
      },
      line: function () {
        let self = this;
        return {
          color: ["#18a8ea"],
          title: {
            text: ""
          },
          tooltip: {
            trigger: "axis",
            formatter: function (params) {
              // console.log(params)
              return (
                params[0].name +
                "<br/>" +
                params[0].seriesName +
                " : " +
                params[0].value.toFixed(2) +
                " " +
                self.unit +
                "H/s"
              );
            }
          },
          legend: {},
          grid: {
            top: "9%",
            left: "3%",
            right: "5%",
            bottom: "5%",
            containLabel: true,
            show: false
          },
          xAxis: [{
            type: "category",
            boundaryGap: false,
            data: this.shareHistoryTime,
            axisLabel: {
              formatter: function (value, idx) {
                return value.slice(value.length - 5, value.length);
              }
            },
            axisLine: {
              lineStyle: {
                color: "#999",
                shadowColor: "rgba(0, 0, 0, 0.3)",
                shadowBlur: 10
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }],
          yAxis: [{
            type: "value",
            name: this.$t('m.suanli') + '(' + this.unit + 'H/s)',
            axisLine: {
              show: true,
              lineStyle: {
                color: "#999",
                shadowColor: "rgba(0, 0, 0, 0.3)",
                shadowBlur: 10
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }],
          series: [{
            name: this.$t('m.suanli'),
            type: "line",
            // stack: '总量',
            smooth: true,
            areaStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                      offset: 0,
                      color: "rgb(170, 228, 255)" // 100% 处的颜色
                      // color: 'rgb(24, 168, 234)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgb(239, 250, 255)" // 100% 处的颜色
                    }
                  ]
                }
              }
            },
            data: this.shareHistoryYes
          }]
        };
      }
    },
    created() {
      this.pageInitInterval();
    },
    methods: {
      pageInitInterval() {
        let self = this;
        clearInterval(window.dingshiqi);
        self.pageInit();
        window.dingshiqi = setInterval(function () {
          self.pageInit();
        }, $store.state.refresh_time);
      },
      pageInit() {
        let self = this;
        this.language = localStorage.getItem("language");
        fn.getStats(self.params_coin).then(res => {
          if (res.data.err_no == 0) {
            self.shares_1h = res.data.data.shares.shares_1h;
            self.shares_unit = res.data.data.shares.shares_unit;
            self.workers = res.data.data.workers;
          } else {
            this.$message.error(this.$t('m.txtError'));
          }
        });
        fn.getShareHistory(72, "1h", self.params_coin).then(res => {
          let hour;
          self.shareHistoryTime = [];
          self.shareHistoryYes = [];
          self.shareHistoryNo = [];
          if (res.data.err_no == 0) {
            self.unit = res.data.data.unit;
            _.each(res.data.data.tickers, function (v, i) {
              // 时间戳转小时
              self.shareHistoryTime.push(fn.getYMDHM(v[0] * 1000));
              self.shareHistoryYes.push(v[1]);
              self.shareHistoryNo.push(v[2]);
            });
          } else {
            this.$message.error(this.$t('m.txtError1'));
          }
        });
      }
    }
  };
</script>


<style scoped>
  .el-col {
    margin-bottom: 16px;
  }
  .material-icons {
    font-size: 80px;
    color: #ddd;
  }
  .cart-string {
    height: 100px;
    padding-top: 10px;
    font-size: 1.1rem;
  }
  .c-charts {
    height: 400px;
    width: 100%;
  }
</style>
