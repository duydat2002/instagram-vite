import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

import { useUserStore } from '@/store'
import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import profile from './profile'
import post from './post'

export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home.vue'),
    meta: { title: 'Instagram' },
    beforeEnter: async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const userStore = useUserStore()

      await userStore.initCurrentUser()

      if (userStore.currentUser) to.meta.layout = DashboardLayout
      else to.meta.layout = AuthLayout

      next()
    }
  },
  profile,
  post,
  {
    path: '/explore',
    name: 'Explore',
    component: () => import('@/views/explore.vue'),
    meta: { layout: DashboardLayout, requiresAuth: true }
  },
  {
    path: '/accounts/login',
    name: 'Login',
    component: () => import('@/components/Pages/Auth/Login.vue'),
    meta: { title: 'Đăng nhập • Instagram', layout: AuthLayout }
  },
  {
    path: '/accounts/signup',
    name: 'SignUp',
    component: () => import('@/components/Pages/Auth/SignUp.vue'),
    meta: { title: 'Đăng ký • Instagram', layout: AuthLayout }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/notFound.vue'),
    meta: { title: 'Không tìm thấy trang - Instagram', layout: AuthLayout }
  }
] as readonly RouteRecordRaw[]
