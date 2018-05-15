<template>
   <div class="container">
     <h1>login</h1>
     <button class="btn btn-primary" @click="login">我要登录</button>
   </div>
 </template>
<script>
import Config from '@/config'
export default {
  name: 'Login',
  components: {},
  props: [],
  data () {
    return {}
  },
  computed: {},
  watch: {},
  mounted () {
    console.log('4mounted')
    console.log(Config)
  },
  updated () {
    console.log('6updated')
  },
  destroyed () {
    console.log('8destroyed')
  },
  methods: {
    login () {
      const params = {
        client_id: Config.CLIENT_ID,
        response_type: 'token id_token',
        redirect_uri: Config.REDIRECTED_URL,
        scope: 'openid profile email phone write read',
        state: Date.now(),
        nonce: Date.now()
      }
      const url = Config.UC_ENDPOINT + '/oauth/v1/authorize?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
      window.location.href = url
    }
  }
}
</script>
