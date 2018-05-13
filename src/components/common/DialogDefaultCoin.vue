<template>
    <div class="mock-form">
        <h3>{{$t('m.dangqianmorenbizhong')}}</h3>
        <p>
            <span class="like-button">{{params_coin_type|uppercase}}</span>
        </p>
        <h3 class="mt20">{{$t('m.xiugaimorenbizhong')}}</h3>
        <el-radio v-model="selectedCoinType" :label="coin|uppercase" v-for="coin in $store.state.cur_coins" :key="coin" border>{{coin|uppercase}}</el-radio>
        <p class="mt10 color-gray">{{$t('m.tips1')}}</p>
        <div class="f-tac pt30">
            <el-button @click="parentDialog('DialogVisible2')" style="width:150px">{{$t('m.qvxiao')}}</el-button>
            <el-button type="primary" @click="updateDefaultCoin" style="width:150px">{{$t('m.queding')}}</el-button>
        </div>
    </div>
</template>

<script>
export default {
  components: {},
  props: ['params_puid', 'params_coin_type'],
  data() {
    return {
      selectedCoinType: ''
    }
  },
  computed: {},
  watch: {
    params_coin_type: function (val) {
      return (this.selectedCoinType = val.toUpperCase())
    }
  },
  mounted() {
    this.selectedCoinType = this.params_coin_type.toUpperCase()
  },
  methods: {
    init() {
      this.selectedCoinType = this.params_coin_type.toUpperCase()
    },
    updateDefaultCoin() {
      $axios
        .post(
          $store.state.common_url +
            '/subaccount/' +
            this.params_puid +
            '/update-default-coin',
          {
            coin_type: this.selectedCoinType.toLowerCase()
          }
        )
        .then(res => {
          this.$message.success(this.$t('m.tips25'))
          this.parentDialog('DialogVisible2')
        })
    },
    parentDialog: function (target) {
      this.selectedCoinType = this.params_coin_type.toUpperCase()
      this.$emit('listenDialog', target)
    }
  }
}
</script>
<style>
.el-radio.is-bordered {
  width: 95px;
}
</style>
