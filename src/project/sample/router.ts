import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL + 'sample'),
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      name: 'home',
      component: () => import('./pages/sampleHome.vue')
    },
    {
      path: '/sampleDelivery',
      name: 'sampleDelivery',
      component: () => import('./pages/sampleDelivery.vue')
    },
    {
      path: '/sampleCollection',
      name: 'sampleCollection',
      component: () => import('./pages/sampleCollection.vue')
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('./pages/common/404.vue'),
      name: '404',
      meta: { title: '404' }
    },
    {
      path: '/500',
      component: () => import('./pages/common/500.vue'),
      name: '500',
      meta: { title: '500' }
    }
  ]
})

export default router
