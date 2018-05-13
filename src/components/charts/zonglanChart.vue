<template>
  <div>
    <div>
      <div class="box mt40 pl50 pr50 pb30 pt30 hover" @click="goDashboard(item.region_id)">
        <el-row>
          <el-col :span="16">
            <h2 class="title s2 mb30">{{$route.params.coin_type|uppercase}} {{$t('m.'+item.region_id)}}</h2>
            <ul flex="box:mean" class="v-line">
              <li>
                <h2 class="title s3 mb10 color-gray">{{$t('m.shishisuanli')}}</h2>
                <p class="f-tac"><span class="v"><animated-num :value="item.shares_15m" :fixed=3></animated-num></span><span class="k">{{item.shares_unit}}H/s</span></p>
              </li>
              <li>
                <h2 class="title s3 mb10 color-gray">{{$t('m.ershisixiaoshisuanli')}}</h2>
                <p class="f-tac"><span class="v"><animated-num :value="item.shares_24h" :fixed=3></animated-num></span><span class="k">{{item.shares_unit}}H/s</span></p>
              </li>
              <li>
                <h2 class="title s3 mb10 color-gray">{{$t('m.youxiaokuanggong')}}</h2>
                <p class="f-tac"><span class="v"><animated-num :value="item.workers_active" :fixed=0></animated-num></span></p>
              </li>
              <li>
                <h2 class="title s3 mb10 color-gray">{{$t('m.zuorishouyi')}}</h2>
                <p class="f-tac"><span class="v"><animated-num :value="((item.yesterday_amount)/Math.pow(10,provider)).toFixed(decimal)" :fixed=decimal></animated-num></span></p>
              </li>
            </ul>
          </el-col>
          <el-col :span="8">
            <div class="c-charts" style="width:365px;height:200px;">
              <IEcharts :option="line" style="width:365px;height:200px;"></IEcharts>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex';
  import IEcharts from 'vue-echarts-v3';
  import fn from '@/assets/js/function.js';
  import animatedNum from "@/components/pages/animatednum.vue";
  export default {
    components: {
      IEcharts,
      animatedNum
    },
    props: ['item'],
    data: () => ({
      language: localStorage.getItem('language'),
      shareHistory: {},
      shareHistoryTime: [], // 算力历史时间
      shareHistoryYes: [], // 算力历史成功
      shareHistoryNo: [], // 算力历史拒绝
      unit: '',
      maxOnOff: false,
    }),
    computed: {
      ...mapState(["txt", "init_url", "cur_coins"]),
      provider:function () {
        return this.$store.state.init_url.coins[this.$route.params.coin_type].render_precision;
      },
      decimal:function () {
        return this.$store.state.init_url.coins[this.$route.params.coin_type].decimal;
      },
      line: function () {
        let self = this;
        return {
          "color": [
            "#18a8ea",
            "#fb7778",
          ],
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              // console.log(params)
              return params[0].name + '<br/>' +
                params[0].seriesName + ' : ' + (params[0].value).toFixed(3) + ' ' + self.unit + 'H/s<br/>' +
                params[1].seriesName + ' : ' + params[1].value + '%<br/>';
            }
          },
          legend: {
            // data: ["成功率", "拒绝率"]
          },
          grid: {
            top: '15%',
            left: '3%',
            right: '5%',
            bottom: '5%',
            containLabel: true,
            show: false
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: this.shareHistoryTime,
            axisLabel: {
              formatter: function (value, idx) {
                return value.slice(value.length - 5, value.length)
              }
            },
            axisLine: {
              lineStyle: {
                color: '#999',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10
              }
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false
            },
          }],
          yAxis: [{
            type: 'value',
            name: this.$t('m.suanli')+'(' + this.unit + 'H/s)',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#999',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
          }, {
            type: 'value',
            name: this.$t('m.jvjuelv')+'(%)',
            min: 0,
            max: this.maxOnOff ? 100 : 20,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#999',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
          }],
          series: [{
              name: this.$t('m.suanli'),
              type: 'line',
              stack: '',
              symbolSize: 0,
              smooth: true,
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0,
                      color: 'rgb(170, 228, 255)' // 100% 处的颜色
                      // color: 'rgb(24, 168, 234)' // 0% 处的颜色
                    }, {
                      offset: 1,
                      color: 'rgb(239, 250, 255)' // 100% 处的颜色
                    }],
                  }
                }
              },
              data: this.shareHistoryYes
            },
            {
              name: this.$t('m.jvjuelv'),
              type: 'line',
              stack: '%',
              symbolSize: 0,
              smooth: true,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              yAxisIndex: 1,
              xAxisIndex: 0,
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0,
                      color: 'rgb(255, 172, 172)' // 0% 处的颜色
                    }, {
                      offset: 1,
                      color: 'rgb(255, 225, 225)' // 100% 处的颜色
                    }],
                  }
                }
              },
              data: this.shareHistoryNo,
            },
          ]
        }
      },
    },
    created() {
      this.pageInit(72, '1h', parseInt((new Date().getTime() - (86400000 * 3)) / 1000));
    },
    methods: {
      goDashboard(region_id) {
        $store.commit('setRegionId', region_id);
        $store.commit('setEnterPannel', true);
        if ($store.state.read_token.length != 0) {
          $router.push("/my/" + this.$route.params.puid + "/" + this.$route.params.coin_type + "/" + region_id + "/dashboard?read_token=" + localStorage.getItem('read_token'));
        } else {
          $router.push("/my/" + this.$route.params.puid + "/" + this.$route.params.coin_type + "/" + region_id + "/dashboard")
        }
      },
      pageInit(count, dimension, start) {
        let self = this;
        let puid = this.$route.params.puid;
        let coin_type = this.$route.params.coin_type;
        this.language = localStorage.getItem('language');
        //获取子帐户算力图表
        fn.getWorkerShareHistory(this.item.api_base_url, puid, count, dimension, start)
          .then(res => {
            if (res.data.err_no == 0) {
              //console.log("zonglanChartData:", res.data.data)
              self.chartData = res.data.data;
              self.shareHistory = {};
              self.shareHistoryTime = [];
              self.shareHistoryYes = [];
              self.shareHistoryNo = [];
              self.unit = res.data.data.unit;
              let hour, day;
              _.each(self.chartData.tickers, function (v, i) {
                if (self.btnIdx == 0) {
                  // day = new Date(v[0] * 1000).getDate();
                  // self.shareHistoryTime.push((Array(2).join(0) + day).slice(-2) + "日");
                  self.shareHistoryTime.push(fn.getYMD(v[0] * 1000))
                } else {
                  // hour = new Date(v[0] * 1000).getHours();
                  // self.shareHistoryTime.push((Array(2).join(0) + hour).slice(-2) + ":00");
                  self.shareHistoryTime.push(fn.getYMDHM(v[0] * 1000))
                }
                self.shareHistoryYes.push(v[1]);
                self.shareHistoryNo.push((v[2] * 100).toFixed(2));
                if ((v[2] * 100).toFixed(2) > 20) {
                  self.maxOnOff = true;
                }
              });
            } else {
              self.$message.error(this.$t('m.tips27'))
              $router.replace({
                name: 'my_puid_cointype',
                path: '/my/' + self.$route.params.puid + '/' + self.$route.params.coin_type
              })
            }
          })
      },
    },
    watch: {
      item() {
        this.pageInit(72, '1h', parseInt((new Date().getTime() - (86400000 * 3)) / 1000));
      }
    }
  }
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
