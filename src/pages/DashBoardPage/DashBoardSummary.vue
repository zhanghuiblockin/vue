<!--dashboard 摘要信息-->
<template>
  <el-row :gutter="40">
    <el-col :span="8">
      <div class="box pt30 pb30">
        <!-- <h2 class="title s3">{{init_url.coins[$route.params.coin_type]['symbol']}} {{$t('m.shishisuanli')}}</h2> -->
        <h2 class="title s3">{{ $t('dashboard.realtime-hashrate') }}</h2>
        <ul class="v-line half-height mt35" flex="box:mean">
          <li>
            <h3 class="title s6" style="color:#999">{{ $t('dashboard.realtime') }}</h3>
            <p class="f-tac mt10">
              <span class="v"><animated-num :value="suanli.shares_15m" :fixed=3 /></span>
              <span class="k">{{ suanli.shares_unit }}H/s</span>
            </p>
          </li>
          <li>
            <h3 class="title s6" style="color:#999">{{ $t('dashboard.hour24') }}</h3>
            <p class="f-tac mt10">
              <span class="v"><animated-num :value="suanli.shares_24h" :fixed=3 /></span>
              <span class="k">{{ suanli.shares_unit }}H/s</span>
            </p>
          </li>
        </ul>
      </div>
    </el-col>

    <el-col :span="8">
      <div class="box pt30 pb30" @click="goMiners" style="cursor:pointer;">
        <h2 class="title s3 f-pr">{{ $t('dashboard.miner-count') }}<br/>
          <animated-num :value="suanli.workers_total" :fixed=0 />
        </h2>
        <ul class="v-line half-height mt35" flex="box:mean">
          <li>
            <h3 class="title s6" style="color:#999">{{ $t('dashboard.active') }}</h3>
            <p class="f-tac mt10">
              <span class="v green"><animated-num :value="suanli.workers_active" :fixed=0 /></span>
            </p>
          </li>
          <li>
            <h3 class="title s6" style="color:#999">{{ $t('dashboard.inactive') }}</h3>
            <p class="f-tac mt10">
              <span class="v red"><animated-num :value="suanli.workers_inactive" :fixed=0 /></span>
            </p>
          </li>
        </ul>
      </div>
    </el-col>

    <el-col :span="8">
      <div class="box pt30 pb30" @click="goPayments" style="cursor:pointer; height:156px;">
        <h2 class="title s3">{{ $t('dashboard.income') }}</h2>
        <ul class="v-line half-height mt35" flex="box:mean">
          <li>
            <h3 class="title s6" style="color:#999">{{ $t('dashboard.today-estimate') }}</h3>
            <p class="f-tac mt10">
              <span class="v">
                <animated-num :value="(payment_stats.today_estimate) / Math.pow(10, provider)" :fixed=decimal />
              </span>
            </p>
          </li>
          <li>
            <h3 class="title s6" style="color:#999">{{ $t('dashboard.yesterday-amount') }}
              <!-- 昨日实收 -->
              <el-popover ref="popover1" placement="bottom" title="" width="250" trigger="hover" :content="$t('dashboard.income-tip')" />
              <el-button type="text" v-popover:popover1 class="gray-to-blue">
                <i class="iconfont icon-bangzhu"></i>
              </el-button>
            </h3>
            <p class="f-tac mt10">
              <span class="v">
                <animated-num :value="(payment_stats.yesterday_amount) / Math.pow(10, provider)" :fixed=decimal />
              </span>
            </p>
          </li>
        </ul>
      </div>
    </el-col>
  </el-row>
</template>
