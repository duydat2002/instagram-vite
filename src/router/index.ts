import AuthLayout from '@/layouts/AuthLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/home.vue'),
      meta: { layout: AuthLayout }
    },
    {
      path: '/accounts/login',
      name: 'Login',
      component: () => import('@/components/Pages/Auth/Login.vue'),
      meta: { layout: AuthLayout }
    },
    {
      path: '/accounts/signup',
      name: 'SignUp',
      component: () => import('@/components/Pages/Auth/SignUp.vue'),
      meta: { layout: AuthLayout }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/notFound.vue'),
      meta: { layout: AuthLayout }
    }
  ]
})

export default router
