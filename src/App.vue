<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    console.log(this.$router)
  }
}
</script>

<style lang="less">
@import url('https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css');
@import url('./assets/less/style.less');
</style>
