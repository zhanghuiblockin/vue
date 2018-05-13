<template>
  <div class="mock-form">
    <div v-loading="loading">
      <div class="mb10">
        <el-radio @change="changeCoinType" v-model="selected_coin_type" :label="coin|uppercase" v-for="coin in $store.state.cur_coins" :key="coin" border></el-radio>
      </div>
      <div class="mt20">
        <h3>{{$t('m.dangqiankeyongguanchazhelianjie')}}</h3>
        <div v-if="has_share_link" style="max-height:230px; overflow:auto; margin-right:-35px;">
          <div v-for="(tokenItem,urlIdx) in res_listToken" :key="tokenItem.token" v-if="urlIdx<=49" style="margin-right:35px">
            <h4 class="mt10">{{tokenItem.name}}</h4>
            <div class="f-cb">
              <el-button slot="suffix" type="text" @click="delToken(params_puid,tokenItem.token)" class="f-fr">{{$t('m.shanchu')}}</el-button>
              <el-input :model="message[urlIdx]=domain+'/my/'+params_puid+'/'+selected_coin_type_low+'?read_token='+tokenItem.token" :value="domain+'/my/'+params_puid+'/'+selected_coin_type_low+'?read_token='+tokenItem.token" class="eq-font" style="width:85%; float:left;">
                <el-button slot="append" type="primary" v-clipboard:copy="message[urlIdx]" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$t('m.copy')}}</el-button>
              </el-input>
            </div>
          </div>
        </div>
        <div class="color-gray" v-else>{{$t('m.sharezanwu')}}</div>
        <p class="mt20 color-gray">{{$t('m.sharetips')}}</p>
      </div>
    </div>
    <div class="create-share-link">
      <h3>{{$t('m.tips59')}}<span>{{$t('m.tips60')}}</span></h3>
      <el-form :model="createForm" :rules="createRule" ref="createForm">
        <el-form-item label="" prop="share_name">
          <el-input v-model="createForm.share_name" :placeholder="$t('m.tips61')"></el-input>
        </el-form-item>
        <el-form-item label="" class="f-tac">
          <el-button type="primary" style="width:200px;" @click="submitForm('createForm')">{{$t('m.chuangjian')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import fn from '@/assets/js/function.js'
import { mapState } from 'vuex'
export default {
  components: {},
  props: ['params_puid', 'params_coin_type'],
  data () {
    return {
      domain: window.location.host,
      language: localStorage.getItem('language'),
      selected_coin_type: this.params_coin_type.toUpperCase(),
      selected_coin_type_low: this.params_coin_type,
      has_share_link: false, // 是否有链接
      res_listToken: {}, // 获取的token列表
      message: [],
      createForm: {
        share_name: '' // 链接名
      },
      createRule: {
        share_name: [
          {
            required: true,
            message: this.$t('m.tips62'),
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: this.$t('m.tips63'),
            trigger: 'blur'
          }
        ]
      },
      loading: false,
      record_num: 0
    }
  },
  computed: {
    ...mapState(['txt', 'init_url', 'cur_coins', 'is_login']),
    user_coin_type_uppercase: function () {
      return this.user_coin_type.toUpperCase()
    }
  },
  watch: {
    params_puid: function () {
      this.selected_coin_type = this.params_coin_type.toUpperCase()
      this.selected_coin_type_low = this.params_coin_type
      this.listToken(this.params_puid, this.selected_coin_type_low)
    }
  },
  mounted () {
    console.log('4mounted')
    this.listToken(this.params_puid, this.selected_coin_type_low)
  },
  methods: {
    init: function () {
      this.selected_coin_type = this.params_coin_type.toUpperCase()
    },
    submitForm (formName) {
      this.loading = true
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createToken()
        } else {
          this.loading = false
          return false
        }
      })
    },
    changeCoinType (val) {
      this.selected_coin_type = val
      this.selected_coin_type_low = val.toLowerCase()
      this.listToken(this.params_puid, this.selected_coin_type_low)
    },
    // 创建 token
    createToken () {
      let puid = this.params_puid
      let coinType = []
      coinType.push(this.selected_coin_type_low)
      let regions = ['*']
      let params = {
        name: this.createForm.share_name,
        regions: regions,
        coin_types: coinType
      }
      fn.createToken(puid, params).then(res => {
        if (this.record_num < 50) {
          this.listToken(this.params_puid, this.selected_coin_type_low)
          this.createForm.share_name = ''
          this.loading = false
          this.$message.success(this.$t('m.tips64'))
        } else {
          this.$message.error(this.$t('m.tips65'))
          this.loading = false
        }
      })
    },
    // 列出 token  region = '*'
    listToken (puid, coin) {
      fn.listToken(puid, coin).then(res => {
        if (res.data.err_no === 0) {
          if (res.data.data.length) {
            this.has_share_link = true
            this.res_listToken = res.data.data
            this.record_num = this.res_listToken.length
          } else {
            this.has_share_link = false
          }
        }
      })
    },
    // 删除 token
    delToken (puid, token) {
      this.$confirm(this.$t('m.tips66'), {
        confirmButtonText: this.$t('m.queding'),
        cancelButtonText: this.$t('m.qvxiao')
      })
        .then(_ => {
          let params = {
            token: token
          }
          fn.delToken(puid, params).then(res => {
            if (res.data.err_no === 0) {
              this.$message.success(this.$t('m.shanchuchenggong'))
              this.listToken(this.params_puid, this.selected_coin_type_low)
            }
          })
        })
        .catch(_ => {})
    },
    onCopy: function (e) {
      // alert()
      this.$message.success(this.$t('m.tips67'))
    },
    onError: function (e) {
      this.$message.error(this.$t('m.tips68'))
    }
  }
}
</script>
