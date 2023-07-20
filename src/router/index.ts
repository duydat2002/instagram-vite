import routes from './routes'
import { createRouter, createWebHistory } from 'vue-router'

import { useLoadingStore, useModalStore } from '@/store'
import { auth } from '@/firebase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'link-active',
  linkExactActiveClass: 'exact-link-active',
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (to.name == from.name || to.matched[0] != from.matched[0]) {
        return {
          top: 0
        }
      }
    }
  }
})

const authPath = ['/accounts/login', '/accounts/signup']

router.beforeEach(async (to, from) => {
  console.log('beforeEach')

  const { setScrollPosition } = useModalStore()
  setScrollPosition(document.documentElement.scrollTop)

  const { startLoading, startSplash } = useLoadingStore()
  console.log(from, to)
  if (from.name) {
    console.log('Loading')
    startLoading()
  } else {
    console.log('Splash')
    startSplash()
  }

  if (to.meta.requiresAuth && !auth.currentUser) {
    return '/accounts/login'
  } else {
    if (authPath.includes(to.path) && auth.currentUser) {
      return '/'
    } else {
      return
    }
  }
})

router.afterEach((to, from) => {
  if (to.meta.title) document.title = (to.meta.title as string) || 'Instagram'
  const { stopLoading, stopSplash } = useLoadingStore()
  stopLoading()
  stopSplash()

  console.log('afterEach')
})

export default router
