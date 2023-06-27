import routes from './routes'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'

import { useLoadingStore, useUserStore } from '@/store'
import { auth } from '@/firebase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

const authPath = ['/accounts/login', '/accounts/signup']

router.beforeEach(async (to, from) => {
  const { startLoading } = useLoadingStore()
  const { currentUser } = useUserStore()
  startLoading()

  console.log('path', to.path)
  console.log('auth', authPath.includes(to.path))
  console.log('auth.currentUser', auth.currentUser)
  console.log('currentUser', currentUser)

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
  const { stopLoading } = useLoadingStore()
  stopLoading()
  nextTick(() => {
    document.title = (to.meta.title as string) || 'Instagram'
  })
})

export default router
