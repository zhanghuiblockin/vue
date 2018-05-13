<template>
    <div class="mock-form">
        <!-- 第一步 -->
        <div v-show="step===1" v-loading="loading">
            <el-form :model="form1_model" :rules="form1_rule" ref="form1_ref" label-position="top">
                <el-form-item>
                    <el-radio v-model="selectedCoinType_upper" :label="coin|uppercase" v-for="coin in $store.state.cur_coins" :key="coin" border>{{coin|uppercase}}</el-radio>
                </el-form-item>
                <el-form-item :label="$t('m.dangqianshoukuandizhi')">
                    <p v-if="has_coin" style="word-break:break-all">{{cur_user_info.coins[selectedCoinType_lower].address}}</p>
                    <p class="color-gray" v-else>{{$t('m.weishezhi')}}</p>
                </el-form-item>
                <!-- 是否显示payment_id -->
                <el-form-item :label="$t('m.fukuanID')" v-show="selectedCoinType_lower==='xmc'||selectedCoinType_lower==='xmr'||selectedCoinType_lower==='etn'">
                    <p v-if="has_paymentid" style="word-break:break-all">{{cur_user_info.coins[selectedCoinType_lower].payment_id}}</p>
                    <p class="color-gray" v-else>{{$t('m.weishezhi')}}</p>
                </el-form-item>
                <!-- <el-form-item :label="$t('m.xindizhi')" prop="address" :class="selectedCoinType_lower==='eth'?'form-item__error':''"> -->
                <el-form-item :label="$t('m.xindizhi')" prop="address">
                    <el-input v-model="form1_model.address" :placeholder="com_placeholder" size="medium"></el-input>
                </el-form-item>
                <!-- payment_id输入字段 -->
                <el-form-item class="label-red" :label="$t('m.fukuanID')+$t('m.Ptips73')" prop="paymentid" v-show="selectedCoinType_lower==='xmc'||selectedCoinType_lower==='xmr'||selectedCoinType_lower==='etn'">
                    <el-input v-model="form1_model.paymentid" size="medium" :placeholder="$t('m.Ptips76')"></el-input>
                </el-form-item>
            </el-form>
            <p v-show="selectedCoinType_lower==='xmc'|| selectedCoinType_lower==='xmr'|| selectedCoinType_lower==='etn'" class="color-red" v-html="$t('m.Ptips75')"></p>
            <p class="color-red">{{$t('m.tips2')}}</p>
            <div class="f-tac mt30">
                <el-button type="primary" @click="submitForm('form1_ref')" style="width:200px">{{$t('m.xiayibu')}}</el-button>
            </div>
        </div>
        <!-- 第二步 -->
        <div v-show="step===2" v-loading="loading">
            <el-form :model="form2_model" :rules="form2_rule" ref="form2_ref" label-position="top">
                <h2>{{$t('m.tips71')}} {{selectedCoinType_upper}} {{$t('m.tips72')}}</h2>
                <p class="color-red eq-font mb20">{{form1_model.address}}</p>
                <!-- payment_id显示字段 -->
                <div v-show="selectedCoinType_lower==='xmc'|| selectedCoinType_lower==='xmr'|| selectedCoinType_lower==='etn'">
                    <h2>{{$t('m.fukuanID')}}</h2>
                    <p class="color-red eq-font mb20" v-if="form1_model.paymentid.length>0">{{form1_model.paymentid}}</p>
                    <p class="color-gray" v-else>{{$t('m.weishezhi')}}</p>
                </div>
                <!-- 循环显示，根据res_s1>codes -->
                <div v-for="(item,index) in form1_res.codes" :key="index">
                    <div v-if="item.type==='email'">
                        <el-form-item prop='code_email' :label="$t('m.tips69')+ item.hint">
                            <el-input v-model="form2_model.code_email" :placeholder="$t('m.tips13')"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="item.type==='sms'">
                        <el-form-item prop='code_sms' :label="$t('m.tips70')+item.hint">
                            <el-input v-model="form2_model.code_sms" :placeholder="$t('m.tips15')"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div class="f-tac mt30">
                <el-button type="primary" @click="submitForm('form2_ref')">{{$t('m.tijiao')}}</el-button>
            </div>
        </div>
        <!-- 第三步 -->
        <div v-show="step===3" v-loading="loading">
            <h2>{{selectedCoinType_upper}} {{$t('m.shoukuandizixiugaichenggong')}}</h2>
            <p class="mt20 mb20 color-red">{{$t('m.tips2')}}</p>
            <div class="f-tac m30">
                <el-button type="primary" @click="parentDialog('DialogVisible1')">{{$t('m.queding')}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  components: {},
  props: ['params_puid', 'params_coin_type', 'params_user_info'],
  data () {
    var validatePass = (rule, value, callback) => {
      if (this.isChecked) {
        var reg = /^[0-9a-fA-F]*$/
        if (!value) {
          return callback(new Error(this.$t('m.qingshuruxindizhi'))) // 请输入新地址
        } else if (reg.test(value)) {
          callback()
        } else {
          callback(new Error(this.$t('m.Ptips77'))) // 付款ID错误！
        }
      } else {
        callback()
      }
    }
    var validateAddress = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('m.qingshuruxindizhi'))) // 请输入新地址
      } else if (this.selectedCoinType_lower !== 'eth') {
        if (this.isChecked) {
          callback(new Error(this.$t('m.tips17'))) //
        } else {
          callback()
        }
      } else {
        this.$axios
          .post(this.$store.state.common_url + '/ethaddress', {
            address: this.form1_model.address
          })
          .then(res => {
            if (res.data.err_no === 0) {
              callback()
            } else if (res.data.err_no === 501) {
              callback(new Error(this.$t('m.tips17')))
            } else if (res.data.err_no === 502) {
              this.$message({
                message: this.$t('m.tips81'),
                type: 'warning'
              })
              callback()
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
    return {
      isChecked: 0,
      loading: false,
      step: 1,
      selectedCoinType_upper: '',
      has_paymentid: false,
      // ++++++++++++++++++++++++++++++++++++++++++++++
      form1_model: {
        address: '',
        paymentid: ''
      },
      form1_rule: {
        address: [
          {
            validator: validateAddress,
            trigger: 'blur'
          }
        ],
        paymentid: [
          {
            required: false,
            validator: validatePass,
            trigger: 'blur'
          }
        ]
      },
      form1_params: {},
      form1_res: {},
      // ++++++++++++++++++++++++++++++++++++++++++++++
      form2_model: {
        code_email: '',
        code_sms: ''
      },
      form2_rule: {
        code_email: [
          {
            required: true,
            message: this.$t('m.tips13'),
            trigger: 'blur'
          },
          {
            min: 4,
            max: 30,
            message: this.$t('m.tips16'),
            trigger: 'blur'
          }
        ],
        code_sms: [
          {
            required: true,
            message: this.$t('m.tips15'),
            trigger: 'blur'
          },
          {
            min: 4,
            max: 30,
            message: this.$t('m.tips16'),
            trigger: 'blur'
          }
        ]
      },
      form2_params: {},
      form2_res: {},
      // ++++++++++++++++++++++++++++++++++++++++++++++
      form3_res: {}
    }
  },
  computed: {
    language: function () {
      return localStorage.getItem('language')
    },
    cur_user_info: function () {
      return this.params_user_info
    },
    selectedCoinType_lower: function () {
      return this.selectedCoinType_upper.toLowerCase()
    },
    has_coin: function () {
      return this.cur_user_info.coins.hasOwnProperty(
        this.selectedCoinType_lower
      )
    },
    com_placeholder () {
      return (
        this.$t('m.shuruxinde') +
        this.$t('m.' + this.selectedCoinType_lower) +
        this.$t('m.shoukuandizhi')
      )
    }
  },
  watch: {
    params_coin_type: function (val) {
      this.selectedCoinType_upper = val.toUpperCase()
    },
    selectedCoinType_upper: function () {
      if (this.has_coin) {
        if (
          this.cur_user_info.coins[this.selectedCoinType_lower].hasOwnProperty(
            'payment_id'
          )
        ) {
          if (
            this.cur_user_info.coins[this.selectedCoinType_lower].payment_id
              .length
          ) {
            this.has_paymentid = true
          } else {
            this.has_paymentid = false
          }
        } else {
          this.has_paymentid = false
        }
      } else {
        this.has_paymentid = false
      }
    }
  },
  mounted () {
    this.selectedCoinType_upper = this.params_coin_type.toUpperCase()
  },
  methods: {
    init () {
      this.step = 1
      this.form1_model.address = ''
      this.form1_model.paymentid = ''
      this.form2_model.code_email = ''
      this.form2_model.code_sms = ''
      this.selectedCoinType_upper = this.params_coin_type.toUpperCase()
    },
    parentDialog: function (target) {
      this.$emit('listenDialog', target)
      this.init()
    },
    // 第三步
    post_s3 () {
      this.$axios
        .post(
          this.$store.state.common_url +
            '/subaccount/' +
            this.cur_user_info.puid +
            '/update/address/s3',
          this.form2_params
        )
        .then(res => {
          this.form3_res = res.data
          this.step = 3
          this.loading = false
        })
    },
    submitForm (formName) {
      let self = this
      this.loading = true
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 第一步
          if (this.step === 1) {
            if (
              this.selectedCoinType_lower === 'xmr' ||
              this.selectedCoinType_lower === 'xmc' ||
              this.selectedCoinType_lower === 'etn'
            ) {
              this.form1_params = {
                address: this.form1_model.address,
                coin_type: this.selectedCoinType_lower,
                payment_id: this.form1_model.paymentid,
                langurage: this.language
              }
            } else {
              this.form1_params = {
                address: this.form1_model.address,
                coin_type: this.selectedCoinType_lower,
                langurage: this.language
              }
            }
            this.$axios
              .post(
                this.$store.state.common_url +
                  '/subaccount/' +
                  this.cur_user_info.puid +
                  '/update/address/s1',
                this.form1_params
              )
              .then(res => {
                if (res.data.err_no === 0) {
                  this.form1_res = res.data.data
                  this.step = 2
                } else if (res.data.err_no === 501) {
                  this.$message({
                    message: this.$t('m.tips17'),
                    type: 'warning'
                  })
                  this.isChecked = 1
                  this.$refs.form1_ref.validateField('address')
                  this.isChecked = 0
                } else if (res.data.err_no === 503) {
                  this.$message({
                    message: this.$t('m.tips18'),
                    type: 'warning'
                  })
                } else if (res.data.err_no === 504) {
                  this.$message({
                    message: this.$t('m.Ptips78'),
                    type: 'warning'
                  })
                  this.isChecked = 1
                  this.$refs.form1_ref.validateField('paymentid')
                  this.isChecked = 0
                } else {
                  this.$message({
                    message: this.$t('m.tips17'),
                    type: 'warning'
                  })
                  console.log(this.$t('m.tips19'))
                }
                self.loading = false
              })
          }
          // 第二步
          if (this.step === 2) {
            let codes = []
            _.map(this.form1_res.codes, function (v, i, o) {
              if (v.type === 'email') {
                codes.push({
                  type: v.type,
                  code: self.form2_model.code_email
                })
              }
              if (v.type === 'sms') {
                codes.push({
                  type: v.type,
                  code: self.form2_model.code_sms
                })
              }
            })
            this.form2_params = {
              session_id: self.form1_res.session_id,
              codes: codes
            }
            this.$axios
              .post(
                this.$store.state.common_url +
                  '/subaccount/' +
                  this.cur_user_info.puid +
                  '/update/address/s2',
                this.form2_params
              )
              .then(res => {
                if (res.data.err_no === 0) {
                  self.form2_res = res.data.data
                  let hasEmail = this.form2_res.hasOwnProperty('email')
                  let hasSms = this.form2_res.hasOwnProperty('sms')
                  if (hasEmail && hasSms) {
                    if (this.form2_res.email.valid) {
                      if (this.form2_res.email.try_times_left > 0) {
                        if (this.form2_res.sms.valid) {
                          if (this.form2_res.sms.try_times_left > 0) {
                            this.post_s3()
                          } else {
                            this.$message.error(this.$t('m.tips22'))
                            this.loading = false
                          }
                        } else {
                          this.$message.error(this.$t('m.tips23'))
                          this.loading = false
                        }
                      } else {
                        this.$message.error(this.$t('m.tips20'))
                        this.loading = false
                      }
                    } else {
                      this.$message.error(this.$t('m.tips21'))
                      this.loading = false
                    }
                  } else if (hasEmail) {
                    if (this.form2_res.email.valid) {
                      if (this.form2_res.email.try_times_left > 0) {
                        this.post_s3()
                      } else {
                        this.$message.error(this.$t('m.tips20'))
                        this.loading = false
                      }
                    } else {
                      this.$message.error(this.$t('m.tips21'))
                      this.loading = false
                    }
                  } else if (hasSms) {
                    if (this.form2_res.sms.valid) {
                      if (this.form2_res.sms.try_times_left > 0) {
                        this.post_s3()
                      } else {
                        this.$message.error(this.$t('m.tips22'))
                        this.loading = false
                      }
                    } else {
                      this.$message.error(this.$t('m.tips23'))
                      this.loading = false
                    }
                  }
                } else {
                  console.log('第二步子账户不存在！')
                  this.loading = false
                }
              })
          }
        } else {
          // this.$message.error(this.$t('m.tips24'))
          self.loading = false
          return false
        }
      })
    }
  }
}
</script>
<style>
.el-radio.is-bordered {
  width: 95px;
}
.form-item__error .el-form-item__error {
  position: relative;
  background: #f3f2d3;
  line-height: 1.5;
  padding: 10px;
  margin-top: -3px;
  color: #666;
}
.label-red .el-form-item__label {
  color: #f00 !important;
}
</style>
