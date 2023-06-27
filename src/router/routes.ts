import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home.vue'),
    meta: { title: 'Instagram', layout: BlankLayout }
  },
  {
    path: '/:username',
    name: 'Profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { title: 'Instagram', requiresAuth: true }
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
    meta: { title: 'Instagram', layout: AuthLayout }
  }
]
