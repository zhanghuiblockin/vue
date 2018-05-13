<template>
  <div>
    <h2 class="title s4 pl50 pr50 pt30">
                <span>{{$t('m.suanlitubiao')}}</span>
            </h2>
    <p class="mt30 pl50 pr50 mb20">
      <button class="btn sm" :class="btnIdx==1?'active':''" @click=getHour(1)>{{$t('m.yixiaoshi')}}</button>&nbsp;&nbsp;&nbsp;&nbsp;
      <button class="btn sm" :class="btnIdx==0?'active':''" @click="getDay(0)">{{$t('m.yitian')}}</button>
    </p>
    <div class="c-charts">
      <IEcharts :option="line"></IEcharts>
    </div>
  </div>
</template>
<script>
import fn from '@/assets/js/function.js'
import { mapState } from 'vuex';
import IEcharts from 'vue-echarts-v3';

export default {
  components: {
    IEcharts,
  },
  data: () => ({
    region_id: '',
    puid: '',
    coin_type: '',
    worker_id: '',
    api: '',

    stats: {}, // 实时算力
    shareHistory: {},
    shareHistoryTime: [], // 算力历史时间
    shareHistoryYes: [], // 算力历史成功
    shareHistoryNo: [], // 算力历史拒绝

    btnIdx: 1,
    language: localStorage.getItem('language'),
    unit: ''
  }),
  computed: {
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
          top: '9%',
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
          max: 100,
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
    refresh(v) {
      return $store.state.refresh;
    }
  },
  created: function () {
    self = this;
    this.puid = this.$route.params.puid;
    this.coin_type = this.$route.params.coin_type;
    this.region_id = this.$route.params.region_id;
    this.worker_id = this.$route.params.worker_id;

    this.pageInit(72, '1h', parseInt((new Date().getTime() - (86400000 * 3)) / 1000));
  },
  methods: {
    pageInit(count, dimension, start) {
      let self = this;
      let puid = this.$route.params.puid;
      let coin_type = this.$route.params.coin_type;
      let region_id = this.$route.params.region_id;
      let worker_id = this.$route.params.worker_id;
      this.language = localStorage.getItem('language');
      // 获取子帐户算力图表
      fn.getApiBaseUrl(region_id, coin_type)
        .then(api => {
          if (api == "") {
            this.$message.error(this.$t('m.tips48'));
            $router.replace("/my/" + puid + "/" + localStorage.getItem('coin_type'))
          } else {
            fn.getWorkerIdShareHistory(api, worker_id, puid, count, dimension, start)
              .then(res => {
                if (res.data.err_no == 0) {
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
                  });
                } else {
                  self.$message.error(this.$t('m.tips49'))
                }
              })
          }
        })

    },
    getDay: function (idx) {
      this.btnIdx = idx;
      this.pageInit(30, '1d', parseInt((new Date().getTime() - (86400000 * 30)) / 1000));
    },
    getHour: function (idx) {
      this.btnIdx = idx;
      this.pageInit(72, '1h', parseInt((new Date().getTime() - (86400000 * 3)) / 1000));
    },
  },
  watch: {
    '$route' (to, from) {
      this.btnIdx = 1;
      this.pageInit(72, '1h', parseInt((new Date().getTime() - (86400000 * 3)) / 1000));
    },
    refresh(v) {
      this.btnIdx = 1;
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
