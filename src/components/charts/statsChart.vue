<template>
  <div>
    <h2 class="title s4 pl50 pr50 pt30">
        <span>{{$t('m.'+ chartCoin)}} {{$t('m.suanlitubiao')}}</span>
    </h2>
    <p class="mt30 pl50 pr50 mb20">
      <button class="btn sm" :class="btnIdx===1?'active':''" @click=getHour(1)>{{$t('m.yixiaoshi')}}</button>&nbsp;&nbsp;&nbsp;&nbsp;
      <button class="btn sm" :class="btnIdx===0?'active':''" @click="getDay(0)">{{$t('m.yitian')}}</button>
    </p>
    <div class="c-charts">
      <IEcharts :option="line"></IEcharts>
    </div>
  </div>
</template>
<script>
import fn from '@/assets/js/function.js'
import { mapState } from 'vuex'
import IEcharts from 'vue-echarts-v3'

export default {
  components: {
    IEcharts
  },
  props: ['chartCoin'],
  data: () => ({
    stats: {}, // 实时算力
    shareHistory: {},
    // shareHistory: {
    //     'err_no': 0,
    //     'data': {
    //         'unit': 'T',
    //         'tickers': [
    //             [1513159200, 1.8, 0.0065],
    //             [1513162800, 1.8, 0.0063],
    //             [1513166400, 1.8, 0.0078],
    //             [1513170000, 1.8, 0.0047],
    //             [1513173600, 1.8, 0.0076],
    //             [1513177200, 1.8, 0.006],
    //             [1513180800, 1.8, 0.0066],
    //             [1513184400, 1.8, 0.0068],
    //             [1513188000, 1.8, 0.0069],
    //             [1513191600, 1.8, 0.0062],
    //             [1513195200, 1.8, 0.0068],
    //             [1513198800, 1.8, 0.0081],
    //             [1513202400, 1.8, 0.0078],
    //             [1513206000, 1.8, 0.0076],
    //             [1513209600, 1.8, 0.0062],
    //             [1513213200, 1.8, 0.0039],
    //             [1513216800, 1.8, 0.0045],
    //             [1513220400, 1.8, 0.0045],
    //             [1513224000, 1.8, 0.0048],
    //             [1513227600, 1.8, 0.0047],
    //             [1513231200, 1.8, 0.0038],
    //             [1513234800, 1.8, 0.0042],
    //             [1513238400, 1.9, 0.0047],
    //             [1513242000, 1.9, 0.0046],
    //             [1513245600, 1.8, 0.0063],
    //             [1513249200, 1.8, 0.0072],
    //             [1513252800, 1.8, 0.0081],
    //             [1513256400, 1.8, 0.0083],
    //             [1513260000, 1.8, 0.0108],
    //             [1513263600, 1.8, 0.0106],
    //             [1513267200, 1.8, 0.0092],
    //             [1513270800, 1.8, 0.0109],
    //             [1513274400, 1.8, 0.0105],
    //             [1513278000, 1.8, 0.0082],
    //             [1513281600, 1.8, 0.0079],
    //             [1513285200, 1.8, 0.0105],
    //             [1513288800, 1.8, 0.0119],
    //             [1513292400, 1.8, 0.0092],
    //             [1513296000, 1.8, 0.0106],
    //             [1513299600, 1.8, 0.0101],
    //             [1513303200, 1.8, 0.0096],
    //             [1513306800, 1.8, 1],
    //             [1513310400, 1.8, 0.0097],
    //             [1513314000, 1.8, 0.0088],
    //             [1513317600, 1.8, 0.0091],
    //             [1513321200, 1.8, 0.0099],
    //             [1513324800, 1.8, 0.009],
    //             [1513328400, 1.8, 0.0101],
    //             [1513332000, 1.8, 0.0098],
    //             [1513335600, 1.8, 0.0078],
    //             [1513339200, 1.8, 0.0098],
    //             [1513342800, 1.8, 0.0104],
    //             [1513346400, 1.8, 0.0102],
    //             [1513350000, 1.8, 0.0096],
    //             [1513353600, 1.8, 0.0113],
    //             [1513357200, 1.8, 0.0099],
    //             [1513360800, 1.8, 0.0118],
    //             [1513364400, 1.8, 0.0105],
    //             [1513368000, 1.8, 0.013],
    //             [1513371600, 1.8, 0.0098],
    //             [1513375200, 1.8, 0.0084],
    //             [1513378800, 1.8, 0.0091],
    //             [1513382400, 1.8, 0.0087],
    //             [1513386000, 1.8, 0.0101],
    //             [1513389600, 1.8, 0.0094],
    //             [1513393200, 1.8, 0.0106],
    //             [1513396800, 1.8, 0.0099],
    //             [1513400400, 1.8, 0.0108],
    //             [1513404000, 1.8, 0.0102],
    //             [1513407600, 1.8, 0.0069],
    //             [1513411200, 1.8, 0.0129],
    //             [1513414800, 1.8, 0.0111]
    //         ]
    //     }
    // },
    shareHistoryTime: [], // 算力历史时间
    shareHistoryYes: [], // 算力历史成功
    shareHistoryNo: [], // 算力历史拒绝
    unit: '',
    btnIdx: 1,
    language: ''
  }),
  computed: {
    ...mapState(['init_url', 'cur_coins']),
    line: function () {
      let self = this
      return {
        color: ['#18a8ea', '#fb7778'],
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            // console.log(params)
            return (
              params[0].name +
              '<br/>' +
              params[0].seriesName +
              ' : ' +
              params[0].value +
              ' ' +
              self.unit +
              'H/s'
            )
          }
        },
        legend: {
          // data: ['成功率', '拒绝率']
        },
        grid: {
          top: '9%',
          left: '3%',
          right: '5%',
          bottom: '5%',
          containLabel: true,
          show: false
        },
        xAxis: [
          {
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
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$t('m.suanli') + '(' + this.unit + 'H/s)',
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
            }
          }
          // , {
          //     type: 'value',
          //     name: '拒绝率(%)',
          //     min: 0,
          //     max: 100,
          //     axisLine: {
          //         show: true,
          //         lineStyle: {
          //             color: '#999',
          //             shadowColor: 'rgba(0, 0, 0, 0.3)',
          //             shadowBlur: 10
          //         }
          //     },
          //     splitLine: {
          //         show: false
          //     },
          //     axisTick: {
          //         show: false
          //     },
          // }
        ],
        series: [
          {
            name: this.$t('m.suanli'),
            type: 'line',
            stack: '',
            smooth: true,
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgb(170, 228, 255)' // 100% 处的颜色
                      // color: 'rgb(24, 168, 234)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgb(239, 250, 255)' // 100% 处的颜色
                    }
                  ]
                }
              }
            },
            data: this.shareHistoryYes
          }
          // {
          //     name: '拒绝率',
          //     type: 'line',
          //     stack: '%',
          //     smooth: true,
          //     lineStyle: {
          //         normal: {
          //             width: 1
          //         }
          //     },
          //     yAxisIndex: 1,
          //     xAxisIndex: 0,
          //     areaStyle: {
          //         normal: {
          //             color: {
          //                 type: 'linear',
          //                 x: 0,
          //                 y: 0,
          //                 x2: 0,
          //                 y2: 1,
          //                 colorStops: [{
          //                     offset: 0,
          //                     color: 'rgb(255, 172, 172)' // 0% 处的颜色
          //                 }, {
          //                     offset: 1,
          //                     color: 'rgb(255, 225, 225)' // 100% 处的颜色
          //                 }],
          //             }
          //         }
          //     },
          //     data: this.shareHistoryNo,
          // },
        ]
      }
    },
    refresh () {
      return this.$store.state.refresh
    }
  },
  created: function () {
    this.pageInit()
  },
  methods: {
    pageInit () {
      this.btnIdx = 1
      this.language = localStorage.getItem('language')
      this.getStats(
        '/pool/stats/merge' + '?coin_type=' + this.$route.params.coin_type
      )
      this.getShareHistory(
        '/pool/share-history/merge' +
          '?count=72&dimension=1h&coin_type=' +
          this.$route.params.coin_type
      )
    },
    getStats: function (url) {
      // 获取矿池实时算力
      this.$axios(this.$store.state.common_url + url).then(res => {
        this.stats = res.data
      })
    },
    getShareHistory: function (url) {
      // 获取矿池算力历史
      var self = this
      this.$axios(this.$store.state.common_url + url).then(res => {
        this.shareHistory = {}
        this.shareHistoryTime = []
        this.shareHistoryYes = []
        this.shareHistoryNo = []
        this.shareHistory = res.data
        this.unit = this.shareHistory.data.unit
        _.each(this.shareHistory.data.tickers, function (v, i) {
          if (self.btnIdx === 0) {
            self.shareHistoryTime.push(fn.getYMD(v[0] * 1000))
          } else {
            // 小时
            self.shareHistoryTime.push(fn.getYMDHM(v[0] * 1000))
          }
          self.shareHistoryYes.push(v[1])
          self.shareHistoryNo.push((v[2] * 100).toFixed(2))
        })
      })
    },
    getDay: function (idx) {
      this.btnIdx = idx
      // 获取矿池算力历史-合并
      this.getShareHistory(
        '/pool/share-history/merge' +
          '?count=30&dimension=1d&coin_type=' +
          this.$route.params.coin_type
      )
    },
    getHour: function (idx) {
      this.btnIdx = idx
      this.getShareHistory(
        '/pool/share-history/merge' +
          '?count=72&dimension=1h&coin_type=' +
          this.$route.params.coin_type
      )
    }
  },
  watch: {
    $route (to, from) {
      this.pageInit()
    },
    refresh (v) {
      this.pageInit()
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
