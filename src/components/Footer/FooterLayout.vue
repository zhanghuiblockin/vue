<template>
  <div class="footer">
    <div class="wrap">
      <img class="logo" src="../../assets/img/logo.jpg" alt="">
      <span class="copy-right">&copy; 2017-2018 Poolin All rights reserved.</span>
      <p class="nav">
        <!-- <router-link to="">{{$t('m.guanyuwomen')}}</router-link> -->
        <a href="http://www.blockin.com" target="_blank">{{$t('m.guanyuwomen')}}</a>
        <s>|</s>
        <a href="https://blockin.zendesk.com/hc/zh-cn" target="_blank">{{$t('m.bangzhu')}}</a>
        <s>|</s>
        <router-link to="">{{$t('m.gonggao')}}</router-link>
        <s>|</s>
        <a href="http://weibo.com/blockin" target="_blank"><i class="iconfont icon-weibo"></i></a>
        <a href="https://twitter.com/officialpoolin" target="_blank"><i class="iconfont icon-twitter"></i></a>
        <a href="https://t.me/poolincommunity" target="_blank"><i class="iconfont icon-telegram"
                                                                  style="font-size:23px;"></i></a>
      </p>
      <el-dropdown trigger="click" @command="handleLanguage" class="language" style="cursor:pointer">
        <span class="el-dropdown-link hover-blue"><b class="ico" style="float:left" :class="language_name === '中文' ? 'cn' : 'en'"></b>{{language_name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh-CN"><b class="ico cn"></b>中文</el-dropdown-item>
          <el-dropdown-item command="en-US"><b class="ico en"></b>English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FooterLayout',
  data () {
    return {
      language_name: '',
      language: localStorage.getItem('language')
    }
  },
  methods: {
    handleLanguage (command) {
      this.$store.commit('setLanguage', command)
      if (command === 'zh-CN') {
        this.language_name = '中文'
      }
      if (command === 'en-US') {
        this.language_name = 'English'
      }
      window.location.href = window.location.href
    },
    pageInit () {
      this.language = localStorage.getItem('language')
      if (localStorage.getItem('language') === 'zh-CN') {
        this.language_name = '中文'
      }

      if (localStorage.getItem('language') === 'en-US') {
        this.language_name = 'English'
      }
    }
  },
  mounted () {
    this.pageInit()
  },
  computed: {
    refresh () {
      return this.$store.state.refresh
    }
  },
  watch: {
    refresh (v) {
      this.pageInit()
    }
  }
}
</script>
<style lang="less">
.ico {
  width: 25px;
  height: 36px;
  float: left;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center left;
  margin-right: 5px;
}

.cn {
  background-image: url(../../assets/img/cn.png);
}

.en {
  background-image: url(../../assets/img/en.png);
}

.language .el-dropdown-link {
  line-height: 27px;
  .ico {
    height: 27px;
  }
}
</style>
