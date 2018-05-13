<!--广播区块-->
<template>
  <div class="bg dot pb70">
    <div class="wrap">
      <h2 class="title s5 mt50">{{ $t('home.relayed-block') }}</h2>

      <div class="mb30 mt60">
        <el-button
          size="small"
          v-for="(item, key) in coinList"
          @click="handleChangeCoin(item, key)"
          :type="coin == item ? 'primary' : ''"
          :key="item"
          v-show="item!='xmr' && item !== 'xmc'&& item !== 'etn'"
        >
          <span> {{ $t('common.' + item) }} </span>
        </el-button>
      </div>

      <div class="box">
        <el-table
          :data="dataSource"
          stripe
          style="width: 100%"
          :empty-text="$t('home.nodata')"
          v-loading="loading"
        >
          <!--高度-->
          <el-table-column
            prop="height"
            :label="$t('home.height')"
            align="center"/>
          <!--时间-->
          <el-table-column
            :label="$t('home.time')"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.created_at| formatDate }}
            </template>
          </el-table-column>
          <!--区块hash-->
          <el-table-column
            :label="$t('home.block-hash')"
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
          <!--爆块地区-->
          <el-table-column
            prop="region_id"
            :label="$t('home.region')"
            align="center"
          >
            <template slot-scope="scope">
              {{ $t('common.'+scope.row.region_id) }}
            </template>
          </el-table-column>
          <!--区块奖励-->
          <el-table-column
            prop="rewards"
            :label="$t('home.reward')"
            align="center"
            width=150
          >
            <template slot-scope="scope">
              <span>{{ ((scope.row.rewards) / Math.pow(10, provider)).toFixed(decimal) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { mapState } from 'vuex'
  import { API } from '@/services/api'

  export default {
    name: 'HomeRelayedBlocks',
    data() {
      return {
        loading: false,
        coin: this.coinType,
        dataSource: null
      }
    },
    computed: {
      ...mapState({
        coinList: state => state.coins.all,
        coinType: state => state.coins.current
      })
    },
    methods: {
      fetchData: async function () {
        this.loading = true
        let res = await API.getBlocks(this.coin)

        this.loading = false
        if (res.data.err_no === 0) {
          this.dataSource = res.data.data.blocks.data;
        } else {
          this.$message.error('获取区块数据错误！')
        }
      },
      handleChangeCoin: function (item, index) {
        this.coin = item
        this.fetchData()
      }
    },
    // component Lifecycle hooks
    mounted() {
      this.fetchData()
    },
  };
</script>
