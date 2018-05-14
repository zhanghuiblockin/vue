<template>
   <div>PoolStatsPage</div>
</template>

<script>
export default {
  name: 'PoolStatsPage',
  components: {},
  props: [],
  data () {
    return {}
  },
  computed: {},
  watch: {},
  beforeCreate () {
    console.log('1beforeCreate')
  },
  created () {
    console.log('2created')
  },
  beforeMount () {
    console.log('3beforeMount')
  },
  mounted () {
    console.log('4mounted')
  },
  beforeUpdate () {
    console.log('5beforeUpdata')
  },
  updated () {
    console.log('6updated')
  },
  activated () {
    console.log('activated')
  },
  deactivated () {
    console.log('deactivated')
  },
  beforeDestroy () {
    console.log('7beforeDestroy')
  },
  destroyed () {
    console.log('8destroyed')
  },
  methods: {}
}
</script>
