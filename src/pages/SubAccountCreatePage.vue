<!--创建子账户页面-->
<template>
  <div class="wrap pb70">
    <div v-title class="hide-title">{{$t('create-account.title')}}</div>

    <el-breadcrumb separator="/" class="mt30 mb30">
      <el-breadcrumb-item>{{ $t('common.index') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('create-account.sub-title') }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col :span="12" :offset="6">
        <div class="box p30" v-loading="loading">
          <h2 class="title s2">{{$t('create-account.sub-title')}}</h2>
          <el-form
            label-position="top"
            label-width="80px"
            class="mt30"
            :model="formData"
            :rules="RULES"
            ref="createAccountForm"
            @submit.native.prevent
          >
            <el-form-item :label="$t('create-account.name')" prop="name">
              <el-input
                v-model="formData.name"
                :placeholder="$t('create-account.tip')"
                size="medium"
              />
            </el-form-item>
            <el-form-item
              :label="$t('create-account.tip')"
              prop="coin_type"
            >
              <el-radio
                v-model="formData.coin_type"
                :label="item | uppercase"
                border
                v-for="item in coinList"
                :key="item"
              >
                {{ item | uppercase }}
              </el-radio>
            </el-form-item>
            <el-button
              type="primary"
              @click="submitForm('createAccountForm')"
            >
              {{ $t('create-account.create') }}
            </el-button>
            <div class="describe">
              <p style="text-align:left;">
                {{ $t('create-account.description') }}"
                <b v-if="formData.name.length === 0">{{ DFEAULT_ACCOUNT }}.001</b>
                <b v-else>{{formData.name}}.001</b>"，"
                <b v-if="formData.name.length === 0">{{ DFEAULT_ACCOUNT }}.002</b>
                <b v-else>{{formData.name}}.002</b>"。</p>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import fn from '@/assets/js/function.js';
  import { mapState } from 'vuex';

  export default {
    name: 'CreateSubAccountPage',
    data() {
      const validateName = (rule, value, callback) => {
        const reg = /^[a-z\d]{4,20}$/g;
        if (value === '') {
          callback(new Error(this.$t('m.tips52')));
        } else {
          if (value.length < 4) {
            callback(new Error(this.$t('m.tips53')))
          } else {
            if (reg.test(value)) {
              callback();
            } else {
              callback(new Error(this.$t('m.tips5')))
            }
          }
        }
      }

      return {
        loading: false,
        formData: {
          name: '',     // 子账户名
          coinType: '', // 币种
        },

        DFEAULT_ACCOUNT: "zizhanghu",
        // ^[a-z\d]{4,}$用户名验证规则
        RULES: {
          name: [{
            validator: validateName,
            trigger: 'blur'
          }],
          coin_type: [{
            required: true,
            message: this.$t('m.tips54'),
            trigger: 'change'
          }],
        },
      }
    },
    computed: {
      ...mapState({
        coinList: state => state.coins.all
      })
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.$message.error(this.$t('m.tianxiecuowu'))
            return
          }

          this.createAccount({
            'name': this.formData.name,
            'coin_type': this.formData.coin_type.toLowerCase()
          })
        })
      },
      async createAccount(params) {
        this.loading = true

        let res = await fn.createAccount(params)

        this.loading = false;
        // todo:422认为参数不合法;
        if (res.data.err_no === 0) {
          this.$message.success(this.$t('m.tips57'))

          $store.commit('setPuid', res.data.data.puid);
          $store.commit('setCoinType', res.data.data.default_coin_type);
          $router.push('/my/' + $store.state.puid + '/' + $store.state.coin_type);
        } else if (res.data.err_no === 100) {
          this.$message.error(this.$t('m.tips55'))
        } else if (res.data.err_no === 101) {
          this.$message.error(this.$t('m.tips56'))
        }
      },
    },
  }
</script>
<style lang="less" scope>
  .el-form--label-top .el-form-item__label {
    font-size: 16px;
    color: #333;
  }

  .el-input__inner {
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1) inset;
  }
</style>
