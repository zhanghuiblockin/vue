<template>
   <div>
     <header-layout />
     <router-view />
     <footer-layout />
   </div>
 </template>

<script>
import HeaderLayout from '@/components/Header/HeaderLayout'
import HomePage from '@/pages/HomePage'
import FooterLayout from '@/components/Footer/FooterLayout'
export default {
  name: 'SiteLayout',
  components: {
    HeaderLayout,
    HomePage,
    FooterLayout
  },
  props: [],
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style lang="less">
@import url('../assets/less/style.less');
</style>
