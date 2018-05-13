<template>
  <div :class="$store.state.is_login||$store.state.read_token.length>0?'header':'header public'">
    <div class="wrap">
      <router-link to='' v-if="$store.state.is_login"><img class="logo"
                                                           :src="language==='zh-CN'?'https://s2.blockin.com/blockin/blockin_zh-cn.svg':'https://s2.blockin.com/blockin/blockin_en.svg'"/>
      </router-link>
      <router-link to="{name:'index'}" v-if="!$store.state.is_login"><img class="logo"
                                                                          :src="language==='zh-CN'?'https://s2.blockin.com/blockin/blockin_zh-cn.svg':'https://s2.blockin.com/blockin/blockin_en.svg'"/>
      </router-link>
      <ul class="nav">
        <li v-if="$store.state.is_login&&$route.name!='my_welcome'">
          <router-link :to="{name:'my_puid_cointype',params:{puid:local_puid,coin_type:local_coin_type}}" exact>
            {{$t('m.zizhanghumianban')}}
          </router-link>
        </li>
        <li v-if="$store.state.read_token.length>0">
          <router-link
            :to="{name:'my_puid_cointype',params:{puid:local_puid,coin_type:local_coin_type},query:{read_token:$store.state.read_token}}"
            exact>{{$t('m.zizhanghumianban')}}
          </router-link>
        </li>
        <li v-if="$store.state.is_login&&$store.state.enter_panel">
          <router-link
            :to="{name:'my_dashboard',params:{puid:local_puid,coin_type:local_coin_type,region_id:local_region_id}}"
            exact>{{$t('m.yonghumianban')}}
          </router-link>
        </li>
        <li v-if="$store.state.read_token.length>0&&$store.state.enter_panel">
          <router-link
            :to="{name:'my_dashboard',params:{puid:local_puid,coin_type:local_coin_type,region_id:local_region_id},query:{read_token:$store.state.read_token}}"
            exact>{{$t('m.yonghumianban')}}
          </router-link>
        </li>
        <li v-if="$store.state.is_login&&$store.state.enter_panel">
          <router-link
            :to="{name:'my_minners',params:{puid:local_puid,coin_type:local_coin_type,region_id:local_region_id}}"
            exact>{{$t('m.kuangji')}}
          </router-link>
        </li>
        <li v-if="$store.state.read_token.length>0&&$store.state.enter_panel">
          <router-link
            :to="{name:'my_minners',params:{puid:local_puid,coin_type:local_coin_type,region_id:local_region_id},query:{read_token:$store.state.read_token}}"
            exact>{{$t('m.kuangji')}}
          </router-link>
        </li>
        <li v-if="$store.state.is_login&&$store.state.enter_panel">
          <router-link
            :to="{name:'my_payments',params:{puid:local_puid,coin_type:local_coin_type,region_id:local_region_id}}"
            exact>{{$t('m.shouyi')}}
          </router-link>
        </li>
        <li v-if="$store.state.read_token.length>0&&$store.state.enter_panel">
          <router-link
            :to="{name:'my_payments',params:{puid:local_puid,coin_type:local_coin_type,region_id:local_region_id},query:{read_token:$store.state.read_token}}"
            exact>{{$t('m.shouyi')}}
          </router-link>
        </li>
        <li v-if="$store.state.read_token.length==0">
          <router-link :to="{name:'stats',params:{coin_type:local_coin_type}}" exact>{{$t('m.tongji')}}</router-link>
        </li>
        <li v-else>
          <router-link
            :to="{name:'stats',params:{coin_type:local_coin_type},query:{read_token:$store.state.read_token}}" exact>
            {{$t('m.tongji')}}
          </router-link>
        </li>
        <li>
          <el-popover ref="popover1" placement="bottom" title="" width="220" trigger="hover">
            <div v-html="$t('m.dakehu')"></div>
            <!-- <div class="contacts">
              <ul>
                <li>
                  <h4><i class="iconfont icon-email"></i> <span>Email</span></h4>
                  <p><a href="mailto:yongjuan.zhang@blockin.com">yongjuan.zhang@blockin.com</a></p>
                </li>
                <li>
                  <h4><i class="iconfont icon-twitter"></i> <span>Twitter</span></h4>
                  <p><a href="https://twitter.com/officialpoolin">twitter.com/officialpoolin</a></p>
                </li>
                <li>
                  <h4><i class="iconfont icon-telegram"></i> <span>Telegram</span></h4>
                  <p><a href="http://t.me/poolincommunity">t.me/poolincommunity</a></p>
                </li>
              </ul>
            </div> -->
            <!-- <div class="contacts"><ul><li><h4><i class="iconfont icon-email"></i> <span>Email</span></h4><p><a href="mailto:yongjuan.zhang@blockin.com">yongjuan.zhang@blockin.com</a></p></li><li><h4><i class="iconfont icon-twitter"></i> <span>Twitter</span></h4><p><a href="https://twitter.com/officialpoolin">twitter.com/officialpoolin</a></p></li><li><h4><i class="iconfont icon-telegram"></i> <span>Telegram</span></h4><p><a href="http://t.me/poolincommunity">t.me/poolincommunity</a></p></li></ul></div> -->

          </el-popover>
          <a href="#" v-popover:popover1>{{$t('m.kefu')}}</a>
        </li>
        <li>
          <a href="https://blockin.zendesk.com/hc/zh-cn" target="_blank">{{$t('m.bangzhu')}}</a>
        </li>
        <li v-if="!$store.state.is_login&&$store.state.read_token.length==0">
          <a href="javascript:;" @click="login">{{$t('m.denglu')}}</a>
        </li>
      </ul>
      <!-- 币种切换 -->
      <el-dropdown trigger="click" class="type" @command="handleCoins"
                   v-if='$store.state.coin_type_show&&$store.state.read_token.length==0' style="cursor:pointer;"
                   :show-timeout="0" :hide-timeout="0">
        <span class="el-dropdown-link hover-blue"> <b class="icon-54"><img
          :src="init_url.coins[coin_type]['icon']['54']" alt=""></b>{{local_coin_type | uppercase}}<i
          class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown" class="my-coins">
          <el-dropdown-item :command="coin" v-for="coin in cur_coins" :key="coin"><b class="icon-54"><img
            :src="init_url.coins[coin]['icon']['54']" alt=""></b><i>{{coin | uppercase}}</i></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 帐户切换 -->
      <el-dropdown trigger="click" class="user" @command="handleAccount"
                   v-if="$store.state.is_login&&$store.state.read_token.length==0" style="cursor:pointer"
                   :show-timeout="0" :hide-timeout="0">
        <span class="el-dropdown-link hover-blue"><span v-if="cur_account.name">{{cur_account.name}}</span><span v-else>{{$t('m.shezhi')}}</span><i
          class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown" class="user-drop">
          <el-dropdown-item disabled class="login-account">{{$t('m.dangqiandengluzhanghu')}}<br/>{{name}}
          </el-dropdown-item>
          <h3 class="dropmenu-title">子账户列表</h3>
          <div v-if="sub_accounts.data['length']>0">
            <div style="max-height:360px;overflow:auto;">
              <!-- <el-dropdown-item :puid=account.puid :default_coin_type="account.default_coin_type" v-for="account in sub_accounts.data" :key="account.puid"><b class="icon-type user" :class="'icon-'+account.default_coin_type"></b> {{account.name}}</el-dropdown-item> -->
              <el-dropdown-item :puid=account.puid :default_coin_type="account.default_coin_type"
                                v-for="account in sub_accounts.data" :key="account.puid">
                <b class="icon-54"><img :src="init_url.coins[account.default_coin_type]['icon']['54']" alt=""></b>
                <i class="name">{{account.name}}</i>
              </el-dropdown-item>
            </div>
            <el-dropdown-item command="my_list" divided style="text-align:center;color:#2da6df">
              {{$t('m.zizhanghuguanli')}}
            </el-dropdown-item>
            <el-dropdown-item command="my_new" divided style="text-align:center;color:#2da6df">
              {{$t('m.chuangjianzizhanghu')}}
            </el-dropdown-item>
          </div>
          <el-dropdown-item divided><a href="https://account.blockin.com" target="_blank"
                                       style="text-align:center;color:#2da6df;display:block;">{{$t('m.yonghuzhongxin')}}</a>
          </el-dropdown-item>
          <el-dropdown-item divided command="logout" style="text-align:center;color:#2da6df">{{$t('m.tuichudenglu')}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 下面两块是观察者模式 -->
      <div class="type el-dropdown" style="cursor: pointer;" v-if="$store.state.read_token.length>0">
        <span class="el-dropdown-link hover-blue el-dropdown-selfdefine" aria-haspopup="list"
              aria-controls="dropdown-menu-1122" role="button" tabindex="0">
                 <b class="icon-54"><img :src="init_url.coins[coin_type]['icon']['54']" alt=""></b>{{$store.state.coin_type | uppercase}}
                </span>
      </div>
      <el-button v-if="$store.state.read_token.length>0" class="user-see"><span
        class="el-dropdown-link hover-blue"><span>{{cur_account.name}}</span>
        <el-tooltip class="item" effect="dark" :content="$t('m.tips58')" placement="bottom">
          <i class="iconfont icon-093info"></i>
        </el-tooltip>
        </span>
      </el-button>
    </div>
  </div>
</template>
<script>
  import fn from "@/assets/js/function.js";
  import { mapState } from "vuex";

  export default {
    name: "HeaderLayout",
    data() {
      return {
        sub_accounts: {
          data: {
            length: 0
          }
        },
        cur_account: {},
        default_coin_type: "",
        local_puid: "",
        local_coin_type: "",
        local_region_id: "",
        language: localStorage.getItem("language"),
        name: "",
      };
    },
    methods: {
      login() {
        const params = {
          client_id: this.$store.state.client_id,
          response_type: "token id_token",
          redirect_uri: this.$store.state.redirect_uri,
          scope: "openid profile email phone write read",
          state: Date.now(),
          nonce: Date.now()
        };
        const url =
          this.$store.state.uc_url +
          "/oauth/v1/authorize?" +
          Object.keys(params)
            .map(k => `${k}=${params[k]}`)
            .join("&");
        window.location.href = url;
      },
      pageInit() {
        let self = this;
        this.local_puid = localStorage.getItem("puid");
        this.local_region_id = localStorage.getItem("region_id");
        this.local_coin_type = localStorage.getItem("coin_type");
        let is_login = $store.state.is_login;
        this.language = localStorage.getItem("language");
        if ($store.state.read_token.length != 0) {
          this.name = localStorage.getItem("read_name");
          this.cur_account.name = localStorage.getItem("read_subaccount_name");
        } else {
          // if (localStorage.getItem('decoded')) {
          //   this.name = JSON.parse(localStorage.getItem('decoded')).payload.name;//auth.com的解码信息
          // }
          if (localStorage.getItem("user_info")) {
            let userInfo = JSON.parse(localStorage.getItem("user_info"));
            if (userInfo.phone_number) {
              this.name = userInfo.phone_number;
            } else {
              this.name = userInfo.email;
            }
          }
          if (is_login) {
            this.getAccountList();
            this.getSubAccountById(this.local_puid);
          }
        }
      },
      handleCoins(command) {
        $store.commit("setCoinType", command);
        this.local_coin_type = command;
        this.$route.params.coin_type = command;
        $router.replace({
          name: this.$route.name,
          params: this.$route.params
        });
      },
      handleAccount(command, obj) {
        console.log(command);
        this.local_puid = obj.$attrs.puid;
        if (obj.$attrs.default_coin_type) {
          this.default_coin_type = obj.$attrs.default_coin_type;
        } else {
          this.default_coin_type = $store.state.cur_coins[0];
        }
        if (this.local_puid) {
          $store.commit("setPuid", this.local_puid);
          $store.commit("setCoinType", this.default_coin_type);
          $router.push("/my/" + this.local_puid + "/" + this.default_coin_type);
        } else {
          if (command == "logout") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("id_token");
            localStorage.removeItem("expires_at");
            localStorage.removeItem("user_info");
            $store.state.is_login = false;
            let callhome = this.$store.state.redirect_uri.substring(
              0,
              this.$store.state.redirect_uri.length - 4
            );
            location.href = `${
              this.$store.state.uc_url
              }/logout?next=${encodeURIComponent(callhome)}`;
          } else {
            $router.push({
              name: command
            });
          }
        }
      },
      getAccountList() {
        fn.getSubAccount().then(res => {
          if (res.data.err_no == 0) {
            this.sub_accounts = res.data;
          } else {
            this.$message.error(this.$t("m.txtError2"));
          }
        });
      },
      getSubAccountById(puid) {
        fn.getSubAccountById(puid).then(res => {
          if (res.data.err_no == 0) {
            this.cur_account = res.data.data;
          } else {
            $router.push("/my/welcome");
          }
        });
      }
    },
    mounted: function () {
      this.pageInit();
    },
    computed: {
      ...mapState(["init_url", "cur_coins", "is_login", "coin_type"])
    },
    watch: {
      $route(to, from) {
        this.pageInit();
      }
    }
  };
</script>
<style lang='less'>
  .user-drop {
    padding: 0 !important;
    width: 250px;
  }

  .user-drop.el-popper[x-placement^="bottom"] .popper__arrow::after {
    border-bottom-color: #f1f1f1 !important;
  }

  .user-drop.el-dropdown-menu .login-account {
    line-height: 22px;
    text-align: right;
    background: #f1f1f1;
    color: #666;
    padding: 5px 20px;
  }

  .user-drop .el-dropdown-menu__item {
    line-height: 20px !important;
    padding-top: 8px;
    padding-bottom: 8px;
    vertical-align: middle;
  }

  .user-drop .icon-54 {
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }

  .user-drop .name {
    line-height: 20px;
    display: inline-block;
    margin-left: 5px;
    vertical-align: middle;
  }

  .hover-blue:hover {
    background: rgb(232, 246, 253);
  }

  .header .user .el-dropdown-link .el-icon-warning {
    color: #ccc;
  }

  .header .user .hover-blue:hover .el-icon-warning {
    color: #2da6df;
  }

  .dropmenu-title {
    text-align: center;
    color: #666;
    padding: 10px 0;
    border-bottom: 1px solid #ebeef5;
    font-size: 14px;
    font-weight: normal;
  }

  .contacts {
    li {
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      &:nth-last-child(1) {
        border-bottom: none;
      }
    }
    h4 {
      font-size: 16px;
      font-weight: normal;
      vertical-align: bottom;
      padding: 5px 0;
      span {
        display: inline-block;
        vertical-align: bottom;
      }
    }
    .iconfont {
      color: #4aa7e5;
      font-size: 18px;
    }
    a {
      color: #4aa7e5;
      text-decoration: underline;
      &:hover {
        opacity: 0.8
      }
    }
  }
</style>
