<!--矿池幸运值-->
<template>
  <div class="bg white">
    <div class="wrap">
      <h2 class="title s5 mt50">{{ $t('home.lucky') }}</h2>

      <div class="tab-tit f-cb mt80" flex="box:mean">
        <a href="javascript:;"
           :class="luckIndex == luckyIdx?'active':''"
           v-for="(cur_coin,luckyIdx) in cur_coins"
           :key="cur_coin"
        >
          <span @click="getLucky(cur_coin, luckyIdx)">
            <img class="icon-show" :src="init_url.coins[cur_coin].icon_gray['300']" alt="">
            <img class="icon-hide" :src="init_url.coins[cur_coin].icon['300']" alt=""> </span>
           {{ $t('common.'+cur_coin) }}
          <b/>
        </a>
      </div>

      <div class="tab-con pb70" v-if="dataSource">
        <div class="tab-con-wrap">
          <ul class="f-cb v-line" flex="box:mean">
            <li>
              <h4 class="title s6">{{ $t('home.day3') }}</h4>
              <p class="mt10 f-tac">
                <span class="v percent">
                  {{ dataSource['3days'] | formatPercent }}
                </span>
              </p>
            </li>
            <li>
              <h4 class="title s6">{{ $t('home.day7') }}</h4>
              <p class="mt10 f-tac">
                <span class="v percent">
                  {{ dataSource['7days'] | formatPercent }}
                </span>
              </p>
            </li>
            <li>
              <h4 class="title s6">{{ $t('home.day30') }}</h4>
              <p class="mt10 f-tac">
                <span class="v percent">
                  {{ dataSource['30days'] | formatPercent }}
                </span>
              </p>
            </li>
            <li>
              <h4 class="title s6">{{ $t('home.day90') }}</h4>
              <p class="mt10 f-tac">
                <span class="v percent">
                  {{ dataSource['90days'] | formatPercent }}
                </span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HomePoolLuck',
    data() {
      return {
        dataSource: null,
        coinType: 'ETN',
      }
    },
    methods: {
      fetchData: function () {

      }
    }
  }
</script>
