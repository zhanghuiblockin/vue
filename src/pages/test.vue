<template>
   <div>template</div>
 </template>
<script>
export default {
  name: 'TemplateName',
  components: {},
  props: [],
  data () {
    return {}
  },
  computed: {},
  watch: {},
  mounted () {
    console.log('4mounted')
    console.log(this)
    this.fetchConfig()
  },
  methods: {
    fetchConfig: async function () {
      this.$axios.get('http://ltc-bj-dev.c6396418dd7954b228d8b967c8a929103.cn-beijing.alicontainer.com/api/public/v1/url').then(res => { console.log(res) }).catch(err => { console.log(err) })
    }
  }
}
</script>
