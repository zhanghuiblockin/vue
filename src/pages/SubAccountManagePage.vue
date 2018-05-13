<!--管理子账户-->
<template>
  <div class="wrap pb70">
    <div v-title class="hide-title">{{$t('m.tit4')}}</div>
    <el-breadcrumb separator="/" class="mt30 mb30">
      <el-breadcrumb-item>{{$t('m.shouye')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('m.zizhanghuguanli')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="18" :offset="3">
        <div class="box p30">
          <h2 class="title s2">{{$t('m.xuanzehuozhe')}} <button class="btn active" @click="goMyNew">{{$t('m.chuangjianzizhanghu')}}</button></h2>
          <!-- <h3 class="title s7 mt30">{{$t('m.zezhanghulibiao')}}</h3> -->
          <ul class="v-line-list">
            <li class="f-cb" v-for="user in sub_accounts.data" :key="user.puid">
              <div class="row" @click="goMyPuidCointype(sub_accounts, user.puid)">
                <span>{{user.name}}</span>
                <span>{{$t('m.morenbizhong')}}:<b class="icon-54 mr10"><img :src="init_url.coins[user.default_coin_type].icon['54']" alt=""></b><b style="font-weight:normal;">{{user.default_coin_type|uppercase}}</b></span>
                <el-button type="text">{{$t('m.chakan')}} <i class="iconfont icon-iconset0416"></i></el-button>
              </div>
              <el-dropdown @command="setDropMenu" trigger="click">
                <span class="el-dropdown-link" style="color:#20a0ff">{{$t('m.shezhi')}}</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="address" :user="user">{{$t('m.shoukuandizhixiugai')}}</el-dropdown-item>
                  <el-dropdown-item command="doge" :user="user" v-show="user.default_coin_type=='ltc'">{{$t('m.dogobutiedizhixiugai')}}</el-dropdown-item>
                  <el-dropdown-item command="coin_type" :user="user">{{$t('m.morenbizhongxiugai')}}</el-dropdown-item>
                  <el-dropdown-item command="share" :user="user">{{$t('m.gongxiangshuju')}}</el-dropdown-item>
                  <!-- <el-dropdown-item command="noticeSetting" :user="user">{{$t('m.noticeSetting')}}</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <!-- 弹层-修改地址 -->
    <el-dialog custom-class="my-dialog" :title="$t('m.shoukuandizhixiugai')" :visible.sync="DialogVisible1" :lock-scroll="false" :before-close="d1Close">
      <dialog-address-edit ref="d1" :params_puid="cur_user_info.puid" :params_coin_type="cur_user_info.default_coin_type" :params_user_info="cur_user_info" v-on:listenDialog="closeDialog"></dialog-address-edit>
    </el-dialog>
    <!-- 弹层-修改DOGE地址 -->
    <el-dialog custom-class="my-dialog" :title="$t('m.dogobutiedizhizhezhi')" :visible.sync="DialogVisible3" :lock-scroll="false" :before-close="d3Close">
      <dialog-doge-address ref="d3" :params_puid="cur_user_info.puid" :params_coin_type="cur_user_info.default_coin_type" :params_user_info="cur_user_info" v-on:listenDialog="closeDialog"></dialog-doge-address>
    </el-dialog>
    <!-- 弹层-修改默认币种 -->
    <el-dialog custom-class="my-dialog" :title="$t('m.morenbizhongxiugai')" :visible.sync="DialogVisible2" :lock-scroll="false" :before-close="d2Close">
      <dialog-default-coin ref="d2" :params_puid="cur_user_info.puid" :params_coin_type="cur_user_info.default_coin_type" v-on:listenDialog="closeDialog"></dialog-default-coin>
    </el-dialog>
    <!-- 共享数据 -->
    <el-dialog custom-class="my-dialog" :title="$t('m.gongxiangshujutitle')" :visible.sync="DialogVisible4" :lock-scroll="false" :before-close="d4Close">
      <dialog-share-data ref="d4" :params_puid="cur_user_info.puid" :params_coin_type="cur_user_info.default_coin_type"></dialog-share-data>
    </el-dialog>
    <!-- 报警设置 -->
    <el-dialog custom-class="my-dialog" :title="$t('m.noticeSetting')" :visible.sync="DialogVisible5" :lock-scroll="false" :before-close="d5Close">
      <dialog-notice-setting ref="d5" :params_puid="cur_user_info.puid" :params_coin_type="cur_user_info.default_coin_type" :params_user_info="cur_user_info" v-on:listenDialog="closeDialog"></dialog-notice-setting>
    </el-dialog>
  </div>
</template>

<script>
import fn from '@/assets/js/function.js';
import DialogAddressEdit from '@/components/common/DialogAddressEdit'
import DialogDogeAddress from '@/components/common/DialogDogeAddress'
import DialogDefaultCoin from '@/components/common/DialogDefaultCoin'
import DialogShareData from '@/components/common/DialogShareData'
import DialogNoticeSetting from '@/components/common/DialogNoticeSetting'
import { mapState } from 'vuex'

export default {
  name: 'my_list',
  components: {
    DialogAddressEdit,
    DialogDogeAddress,
    DialogDefaultCoin,
    DialogShareData,
    DialogNoticeSetting
  },
  props: [],
  data () {
    return {
      DialogVisible1: false,
      DialogVisible2: false,
      DialogVisible3: false,
      DialogVisible4: false,
      DialogVisible5: false,
      sub_accounts: {}, // 帐户列表
      cur_user_info: {} // 下拉当前用户
    }
  },
  mounted () {
    if (this.$store.state.is_login) {
      this.pageInit()
    }
  },
  methods: {
    pageInit () {
      let self = this
      this.language = localStorage.getItem('language')
      let puid = localStorage.getItem('puid')
      fn.getUserList().then(res => {
        if (res.data.err_no === 0) {
          self.sub_accounts = res.data
        } else {
          this.$message.error(this.$t('m.tips26'))
        }
      })
    },
    closeDialog: function (payload) {
      this.DialogVisible1 = this.DialogVisible2 = this.DialogVisible3 = this.DialogVisible4 = this.DialogVisible5 = false
      this.pageInit()
    },
    setDropMenu: function (command, obj) {
      this.cur_user_info = obj.$attrs.user
      switch (command) {
        case 'address':
          this.DialogVisible1 = true
          break
        case 'doge':
          this.DialogVisible3 = true
          break
        case 'coin_type':
          this.DialogVisible2 = true
          break
        case 'share':
          this.DialogVisible4 = true
          break
      }
    },
    d1Close: function (done) {
      this.$refs.d1.init() // 对修改地址子组件进行初始化
      done()
    },
    d2Close: function (done) {
      this.$refs.d2.init() // 对默认币种子组件进行初始化
      done()
    },
    d3Close: function (done) {
      this.$refs.d3.init() // 对DOGE收款地址子组件进行初始化
      done()
    },
    d4Close: function (done) {
      this.$refs.d4.init() // 对分享数据进行初始化
      done()
    },
    d5Close: function (done) {
      this.$refs.d5.init() // 对报警设置初始化
      done()
    },
    goMyNew: function () {
      this.$router.push({
        name: 'my_new'
      })
    },
    goMyPuidCointype (obj, id) {
      // 查看按钮
      this.$store.commit('setPuid', id)
      fn.getUser(id).then(res => {
        if (res.data.data.default_coin_type) {
          this.$store.commit('setCoinType', res.data.data.default_coin_type)
        } else {
          this.$store.commit('setCoinType', this.$store.state.cur_coins[0])
        }
        this.$router.push(
          '/my/' + res.data.data.puid + '/' + localStorage.getItem('coin_type')
        )
      })
    }
  }
}
</script>

<style>
.el-form-item__label {
  font-weight: bold;
}
.el-form-item {
  margin-bottom: 15px;
}
</style>
