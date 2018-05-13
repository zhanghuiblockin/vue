<!--矿池统计-矿池出块-->
<template>
  <!--统计广播区块-->
  <div
    class="box mt40 p50 pt30"
    v-show="coinType !== 'xmr' && coinType !== 'xmc'&& coinType !== 'etn'"
  >
    <h2 class="title s2">{{ $t('m.guangboqvkuai') }}</h2>

    <el-table
      :data="dataSource"
      stripe
      style="width: 100%"
      :empty-text="$t('m.nodata')"
    >
      <!-- 高度 -->
      <el-table-column
        prop="height"
        :label="$t('m.gaodu')"
        align="center"
      />
      <!-- 时间 -->
      <el-table-column
        :label="$t('m.shijian')"
        align="center"
        width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.created_at | formatDate3 }}
        </template>
      </el-table-column>
      <!-- hash -->
      <el-table-column
        :label="$t('m.qvkuaihaxi')"
        width="600"
        align="center"
      >
        <template slot-scope="scope">
          <!--<a :href="'https://s.blockin.com/explorer-redirect/index.html?coin='+$store.state.cur_coins[mergeIndex]+'&type=hash&key=' +scope.row.hash"-->
          <a
            target="_blank">
            <span class="eq-font">{{ scope.row.hash }}</span>
          </a>
        </template>
      </el-table-column>
      <!-- 爆块区 -->
      <el-table-column
        prop="region_id"
        :label="$t('m.baokuaidiqv')"
        align="center"
      >
        <template slot-scope="scope">
          {{ $t('common.' + scope.row.region_id) }}
        </template>
      </el-table-column>
      <!-- 块奖励 -->
      <el-table-column
        prop="rewards"
        :label="$t('m.qvkuaijiangli')"
        align="center"
        width=150
       >
        <template slot-scope="scope">
          <span>{{ (scope.row.rewards / Math.pow(10, provider)).toFixed(decimal) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { API } from '@/services/api'

  export default {
    name: 'PoolStatsRelayedBlock',
    data() {
      return {
        dataSource: null
      }
    },
    computed: {
      ...mapState({
        coinType: state => state.coins.current
      })
    },
    mounted: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        this.loading = true
        let res = await API.getBlocks(this.coin)

        this.loading = false
        if (res.data.err_no === 0) {
          this.dataSource = res.data.data.blocks.data;
        } else {
          this.$message.error('获取区块数据错误！')
        }
      },
    }
  }
</script>
