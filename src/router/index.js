import Router from 'vue-router'

const SiteLayout = r => require.ensure([], () => r(require('@/components/SiteLayout.vue')), 'SiteLayout')

const HomePage = r => require.ensure([], () => r(require('@/pages/HomePage.vue')), 'HomePage')
const PoolStatsPage = r => require.ensure([], () => r(require('@/pages/PoolStatsPage.vue')), 'PoolStatsPage')
/* eslint-disable no-unused-vars */
const LoadingPage = r => require.ensure([], () => r(require('@/pages/LoadingPage.vue')), 'LoadingPage')
const DownloadPage = r => require.ensure([], () => r(require('@/pages/DownloadPage.vue')), 'DownloadPage')

// const DashBoardPage = r => require.ensure([], () => r(require('@/pages/DashBoardPage.vue')), 'DashBoardPage')
const SummaryPage = r => require.ensure([], () => r(require('@/pages/SummaryPage.vue')), 'SummaryPage')
const SubAccountCreatePage = r => require.ensure([], () => r(require('@/pages/SubAccountCreatePage.vue')), 'SubAccountCreatePage')
const SubAccountManagePage = r => require.ensure([], () => r(require('@/pages/SubAccountManagePage.vue')), 'SubAccountManagePage')
// const MinerManagePage = r => require.ensure([], () => r(require('@/pages/MinerManagePage.vue')), 'MinerManagePage')
// const MinerDetailPage = r => require.ensure([], () => r(require('@/pages/MinerDetailPage.vue')), 'MinerDetailPage')
const PaymentPage = r => require.ensure([], () => r(require('@/pages/PaymentPage.vue')), 'PaymentPage')

// const ToolMiniMiningPage = r => require.ensure([], () => r(require('@/pages/ToolMiniMiningPage.vue')), 'ToolMiniMiningPage')

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    component: SiteLayout,
    children: [{
      path: '',
      name: 'home',
      component: HomePage
    }, {
      path: '/:coin_type/stats',
      name: 'stats',
      component: PoolStatsPage
    }, {
      path: '/my/:puid/:coin_type',
      component: SummaryPage,
      meta: { requiresAuth: true }
    }, {
      path: '/create',
      component: SubAccountCreatePage
    }, {
      path: '/my',
      component: SubAccountManagePage
    }, {
      path: '/my/:puid/:coin_type/:region_id/payments',
      component: PaymentPage
    }, {
      path: '/download',
      component: DownloadPage
    }]
  }]
})

export default router
