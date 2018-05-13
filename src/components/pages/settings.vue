<template>
  <div class="wrap pb70">
    <div v-title class="hide-title">{{$t('m.tit3')}}</div>
    <el-breadcrumb separator="/" class="mt30 mb30">
      <el-breadcrumb-item>{{txt[language].shouye}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{txt[language].zhanghushezhi}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box pl50 pr50 pt30 pb30">
      <h2 class="title s2">帐户设置</h2>
      <el-form :model="accountSettingForm" ref="accountSettingForm" label-width="100px" class="mt30" style="width:500px">
        <el-form-item label="用户名" prop="name">
          <el-input placeholder="" disabled v-model="accountSettingForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <div flex="box:last">
            <el-input placeholder='未设置' v-model="accountSettingForm.email" disabled=""></el-input>
            <el-button class="ml20" type="text" @click="mailDialogVisible = true">设置</el-button>
          </div>
        </el-form-item>
        <el-form-item label="手机号" prop="mobi">
          <div flex="box:last">
            <el-input placeholder="未设置" v-model="accountSettingForm.mobi" disabled=""></el-input>
            <el-button type="text" class="ml20" @click="mobiDialogVisible = true">设置</el-button>
          </div>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <div flex="box:last">
            <el-input v-model="accountSettingForm.pass" type="password" auto-complete="off" disabled=""></el-input>
            <el-button class="ml20" type="text" @click="passDialogVisible = true">修改</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 设置邮箱 -->
    <el-dialog custom-class="my-dialog" :lock-scroll="false" title="设置邮箱地址" :visible.sync="mailDialogVisible">
      <el-form label-position="top" :model="mailSetForm">
        <el-form-item label="输入邮箱地址">
          <el-input v-model="mailSetForm.email" placeholder="输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="mailSetForm.code" placeholder="6位数字验证码" style="width:150px; margin-right: 20px;"></el-input>
          <el-button type="primary">获取验证码</el-button>
          <p style="color:#999">验证码已发送至您的邮箱</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
			    <el-button @click="mailDialogVisible = false" style="width:150px">取 消</el-button>
				<el-button type="primary" @click="mailDialogVisible = false" style="width:150px">确 定</el-button>
			</span>
    </el-dialog>
    <!-- 设置手机 -->
    <el-dialog custom-class="my-dialog" :lock-scroll="false" title="设置手机号" :visible.sync="mobiDialogVisible">
      <div>
        <el-form :model="mobiSetForm" label-position="top">
          <el-form-item label="输入手机号">
            <el-row :gutter="20">
              <el-col :span="10">
                <el-select v-model="mobiSetForm.value" placeholder="请选择">
                  <el-option v-for="item in mobiSetForm.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="14">
                <el-input v-model="mobiSetForm.mobi" placeholder=""></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="">
            <el-row :gutter="20">
              <el-col :span="10">
                <el-input v-model="mobiSetForm.code" placeholder="输入验证码"></el-input>
              </el-col>
              <el-col :span="14">
                <el-button type="primary">获取验证码</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
			    <el-button @click="mobiDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="mobiDialogVisible = false">确 定</el-button>
			</span>
    </el-dialog>
    <!-- 修改手机 -->
    <el-dialog custom-class="my-dialog" :lock-scroll="false" title="验证身份" :visible.sync="mobi2DialogVisible">
      <p class="mb20">为了保证你的帐号安全，请验证身份。验证成功后进行下一步操作。</p>
      <el-form :model="mobi2SetFrom">
        <el-form-item label="">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-input v-model="mobi2SetFrom.code" placeholder=""></el-input>
            </el-col>
            <el-col :span="14">
              <el-button type="primary">获取验证码</el-button>
            </el-col>
          </el-row>
          <p style="font-size:14px; color:#999">验证码已发送至你的手机</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
			    <el-button @click="mobiDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="mobiDialogVisible = true">确 定</el-button>
			</span>
    </el-dialog>
  </div>
</template>
<script>
import fn from '@/assets/js/function.js';
import { mapState } from 'vuex';
export default {
  name: "settings",
  data() {
    return {
      language: localStorage.getItem("language"),
      mailDialogVisible: false, // 设置邮箱地址
      mobiDialogVisible: false, // 设置手机
      passDialogVisible: true, // 无
      mobi2DialogVisible: false, // 修改手机

      accountSettingForm: {
        name: "",
        email: "",
        mobi: "",
        pass: "******"
      },
      mailSetForm: {
        email: "",
        code: ""
      },
      mobiSetForm: {
        options: [{
            value: "选项1",
            label: "中国+86"
          },
          {
            value: "选项2",
            label: "美国+11"
          }
        ],
        value: "",
        mobi: "",
        code: ""
      },
      mobi2SetFrom: {
        code: ''
      }
    };
  },
  methods: {
    pageInit() {
      this.language = localStorage.getItem('language');
      let decoded = JSON.parse(localStorage.getItem('decoded'));
      console.log(decoded)
      this.accountSettingForm.name = decoded.payload.name;
    },
    submitForm(formName) {

    },
  },
  mounted() {
    this.pageInit();
  },
  computed: {
    ...mapState(["txt", "init_url", "cur_coins", "is_login"]),
    refresh() {
      return $store.state.refresh
    }
  },
  watch: {
    refresh(v) {
      this.pageInit()
    }
  }
};

</script>
