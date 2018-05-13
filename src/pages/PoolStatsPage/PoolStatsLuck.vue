<!--矿池统计-矿池幸运值-->
<template>
  <!--统计幸运值-->
  <div
    class="box mt40 p50 pt30"
    v-show="coinType !== 'xmr' && coinType !== 'xmc'&& coinType !== 'etn'"
  >
    <h2 class="title s2">{{ $t(`common.${coinType}`) }} {{ $t('pool-stats.lucky') }}</h2>

    <ul class="v-line mt40" flex="box:mean">
      <li>
        <h3 class="title s6">{{ $t('pool-stats.day3') }}</h3>
        <p class="f-tac mt10">
          <span class="v percent">{{ dataSource['3days'] | formatPercent }}</span>
        </p>
      </li>
      <li>
        <h3 class="title s6">{{ $t('pool-stats.day7') }}</h3>
        <p class="f-tac mt10">
          <span class="v percent">{{ dataSource['7days'] | formatPercent }}</span>
        </p>
      </li>
      <li>
        <h3 class="title s6">{{ $t('pool-stats.day30') }}</h3>
        <p class="f-tac mt10">
          <span class="v percent">{{ dataSource['30days'] | formatPercent }}</span>
        </p>
      </li>
      <li>
        <h3 class="title s6">{{ $t('pool-stats.day90') }}</h3>
        <p class="f-tac mt10">
          <span class="v percent">{{ dataSource['90days'] | formatPercent }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { API } from '@/services/api'

  export default {
    name: 'PoolStatsLuck',
    data() {
      return {
        dataSource: null
      }
    },
    computed: {
      ...mapState({
        coinList: state => state.coins.all,
        coinType: state => state.coins.current
      })
    },
    mounted: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {

      },
    }
  }
</script>
