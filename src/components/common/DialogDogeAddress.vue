<template>
    <div class="mock-form">
        <!-- 第一步 -->
        <div v-show="step===1" v-loading="loading">
            <el-form :model="form1_model" :rules="form1_rules" ref="form1_ref" label-position="top">
                <el-form-item :label="$t('m.dangqiandogebutiedizhi')">
                    <p v-if="has_doge_address" style="word-break:break-all;">{{cur_user_info.coins['doge'].address}}</p>
                    <p class="color-gray" v-else>{{$t('m.weishezhi')}}</p>
                </el-form-item>
                <el-form-item :label="$t('m.xindizhi')" prop="address">
                    <el-input v-model="form1_model.address" placeholder="" size="medium"></el-input>
                </el-form-item>
            </el-form>
            <p class="color-red">{{$t('m.tips2')}}</p>
            <div class="f-tac mt30">
                <el-button type="primary" @click="submitForm('form1_ref')" style="width:200px">{{$t('m.xiayibu')}}</el-button>
            </div>
        </div>
        <!-- 第二步 -->
        <div v-show="step===2" v-loading="loading">
            <el-form :model="form2_model" :rules="form2_rules" ref="form2_ref" label-position="top">
                <h2>{{$t('m.tips11_1')}}</h2>
                <p class="color-red eq-font mb20">{{form1_model.address}}</p>
                <div v-for="(item,index) in form1_res.codes" :key="index">
                    <div v-if="item.type==='email'">
                        <el-form-item prop='code_email' :label="$t('m.tips12')+item.hint">
                            <el-input v-model="form2_model.code_email" :placeholder="$t('m.tips13')"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="item.type==='sms'">
                        <el-form-item prop='code_sms' :label="$t('m.tips14')+item.hint">
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
            <h2>DOGE{{$t('m.shoukuandizixiugaichenggong')}}！</h2>
            <p class="mt20 mb20 color-red">{{$t('m.tips2')}}</p>
            <div class="f-tac mt30">
                <el-button type="primary" @click="parentDialog('DialogVisible3')">{{$t('m.queding')}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  components: {},
  props: ['params_puid', 'params_coin_type', 'params_user_info'],
  data () {
    return {
      loading: false,
      step: 1,
      // +++++++++++++++++++++++++++++++++++++
      form1_model: {
        address: ''
      },
      form1_rules: {
        address: [
          {
            required: true,
            message: this.$t('m.qingshuruxindizhi'),
            trigger: 'blur'
          }
        ]
      },
      form1_params: {},
      form1_res: {},
      // +++++++++++++++++++++++++++++++++++++
      form2_model: {
        code_email: '',
        code_sms: ''
      },
      form2_rules: {
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
    has_doge_address: function () {
      return this.cur_user_info.coins.hasOwnProperty('doge')
    }
  },
  watch: {},
  methods: {
    init () {
      this.step = 1
      this.form1_model.address = ''
      this.form1_model.paymentid = ''
      this.form2_model.code_email = ''
      this.form2_model.code_sms = ''
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
            this.form1_params = {
              address: this.form1_model.address,
              coin_type: 'doge',
              langurage: this.language
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
                } else if (res.data.err_no === 503) {
                  this.$message({
                    message: this.$t('m.tips18'),
                    type: 'warning'
                  })
                } else if (res.data.err_no === 504) {
                  this.$message({
                    message: '504',
                    type: 'warning'
                  })
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
                          }
                        } else {
                          this.$message.error(this.$t('m.tips23'))
                        }
                      } else {
                        this.$message.error(this.$t('m.tips20'))
                      }
                    } else {
                      this.$message.error(this.$t('m.tips21'))
                    }
                  } else if (hasEmail) {
                    if (this.form2_res.email.valid) {
                      if (this.form2_res.email.try_times_left > 0) {
                        this.post_s3()
                      } else {
                        this.$message.error(this.$t('m.tips20'))
                      }
                    } else {
                      this.$message.error(this.$t('m.tips21'))
                    }
                  } else if (hasSms) {
                    if (this.form2_res.sms.valid) {
                      if (this.form2_res.sms.try_times_left > 0) {
                        this.post_s3()
                      } else {
                        this.$message.error(this.$t('m.tips22'))
                      }
                    } else {
                      this.$message.error(this.$t('m.tips23'))
                    }
                  }
                } else {
                  console.log('第二步子账户不存在！')
                  this.loading = false
                }
              })
          }
        } else {
          this.$message.error(this.$t('m.tips24'))
          self.loading = false
          return false
        }
      })
    }
  }
}
</script>
