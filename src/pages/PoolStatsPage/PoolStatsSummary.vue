<!--矿池统计-矿池统计-->
<template>
  <!--统计摘要-->
  <el-row :gutter="40">
    <!-- 算力 -->
    <el-col :span="6">
      <div class="box pt30 pb30">
        <h2 class="title s3 mb10">{{ $t('m.zongsuanli') }}</h2>
        <p class="f-tac">
          <span class="v">
            <animated-num :value="computed_shares_1h" :fixed=3 />
          </span>
          <span class="k">{{ statsData.shares.shares_unit }}H/s</span>
        </p>
      </div>
    </el-col>

    <!-- 矿机 -->
    <el-col :span="6">
      <div class="box pt30 pb30">
        <h2 class="title s3 mb10">{{$t('m.kuangjishu')}}</h2>
        <p class="f-tac">
          <span class="v">
            <animated-num :value="computed_workers" :fixed=0 />
          </span>
        </p>
      </div>
    </el-col>

    <!-- 收益 -->
    <el-col :span="6">
      <div class="box pt30 pb30">
        <h2 class="title s3 mb10">{{ $t('m.wabishuliang') }}</h2>
        <p class="f-tac">
          <span class="v">
            <animated-num :value="computed_total_rewards/Math.pow(10,provider)" :fixed=0 />
          </span>
          <span class="k">{{ init_url.coins[$store.state.coin_type]['symbol'] }}</span>
        </p>
      </div>
    </el-col>

    <!-- 区块数 -->
    <el-col :span="6">
      <div class="box pt30 pb30">
        <h2 class="title s3 mb10">{{ $t('m.zongqvkuaishu') }}</h2>
        <p class="f-tac">
          <span class="v">
            <animated-num :value="computed_total_blocks" :fixed=0 />
          </span>
        </p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'PoolStatsSummary'
  }
</script>
