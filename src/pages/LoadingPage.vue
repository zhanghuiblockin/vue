<template>
  <div class="spinner">
    <img src="../assets/img/loading.svg" />
    <p>{{$t('m.rukoutiaozhuanzhong')}}</p>
  </div>
</template>
<script>
  import {
    mapState
  } from "vuex";
  export default {
    name: "jump",
    data() {
      return {};
    },
    computed: {
      ...mapState(["is_login"])
    },
    mounted: function () {
      const hash = location.hash.slice(1);
      const re = /(.*?)=(.*?)($|&)/g;
      const q = {};
      var match;
      while ((match = re.exec(hash))) {
        q[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
      }
      localStorage.setItem("access_token", q.access_token);
      localStorage.setItem("expires_at", new Date().getTime() + q.expires_in * 1000);
      localStorage.setItem("id_token", q.id_token);
      this.$store.state.is_login = true;
      this.$axios(this.$store.state.uc_url + "/oauth/v1/userinfo", {
        access_token: q.access_token
      }).then(res => {
        // 获取登录用户信息并保存到本地
        localStorage.setItem("user_info", JSON.stringify(res.data));
        // 判断登录的跳转
        if ($store.state.is_login) {
          $axios($store.state.common_url + "/subaccount").then(res => {
            if (res.data.err_no == 0) {
              if (res.data.data.length) {
                let puid = localStorage.getItem("puid");
                if (puid) {
                  $axios($store.state.common_url + "/subaccount/" + puid).then(res1 => {
                    if (res1.data.err_no == 0) {
                      $router.replace("/my/" + puid + "/" + localStorage.getItem("coin_type") + "/dashboard");
                    } else {
                      $store.commit('setPuid', '');
                      $router.replace("/my/welcome");
                    }
                  });
                } else {
                  $router.replace("/my/welcome");
                }
              } else {
                $store.commit("setPuid", "");
                $router.replace("/my/new");
              }
            } else {
              this.$message.error("获取子帐户列表错误！");
            }
          });
        }
      });
    }
  };
</script>

<style scoped>
  html,
  body {
    width: 100%;
    height: 100%;
    min-height: 100%;
  }
  .spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .spinner img {
    width: 60px;
    height: 60px;
  }
  .spinner p {
    font-size: 16px;
    color: #666;
    text-align: center;
    margin-top: 20px;
  }
</style>
