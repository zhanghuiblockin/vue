<template>
   <div>HomePage-{{ coin }}-{{ lang }}-{{ count }}- {{ coins }}
     <p><button @click="changeCount">mutations同步方法</button></p>
     <p><button @click="fetchCoin">actions异步方法</button></p>
   </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'HomePage',
  components: {},
  props: [],
  data () {
    return {}
  },
  computed: {
    ...mapState({
      coin: state => state.coins.current,
      lang: state => state.lang.current,
      count: state => state.test.count,
      coins: state => state.test.all
    })
  },
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
    console.log(this.$store)
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
  methods: {
    changeCount () {
      this.$store.commit('increment')
    },
    fetchCoin () {
      this.$store.dispatch('fetchCoin')
    }
  }
}
</script>
