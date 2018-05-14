import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const SiteLayout = () => import('@/pages/SiteLayout')
const HomePage = () => import('@/pages/HomePage')
const PoolStatsPage = () => import('@/pages/PoolStatsPage')

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: SiteLayout,
      children: [
        { path: '', name: 'home', component: HomePage },
        { path: '/:coin_type/stats', name: 'stats', component: PoolStatsPage }
      ]
    }
  ]
})

export default router
