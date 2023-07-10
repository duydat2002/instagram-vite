import DashboardLayout from '@/layouts/DashboardLayout.vue'

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUser } from '@/composables'
import { useUserStore } from '@/store'

export default {
  path: '/:username',
  name: 'Profile',
  component: () => import('@/views/profile/index.vue'),
  meta: { layout: DashboardLayout, requiresAuth: true },
  redirect: { name: 'Posts' },
  beforeEnter: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const { getUserByUsername } = useUser()
    getUserByUsername(to.params.username as string).then(async (user) => {
      if (!user) {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          query: to.query,
          hash: to.hash
        })
      } else {
        const { initUserWithFollow } = useUserStore()
        await initUserWithFollow(user)

        next()
      }
    })
  },
  children: [
    {
      path: '',
      name: 'Posts',
      component: () => import('../views/profile/posts.vue')
    },
    {
      path: 'saved',
      name: 'Saved',
      component: () => import('../views/profile/saved.vue')
    },
    {
      path: 'tagged',
      name: 'Tagged',
      component: () => import('../views/profile/tagged.vue')
    },
    {
      path: 'followers',
      name: 'Followers',
      component: () => import('../components/Modal/FollowsModal.vue'),
      children: [
        {
          path: 'mutualOnly',
          name: 'MutualFollowers',
          component: () => import('../components/Modal/FollowsModal.vue')
        },
        {
          path: 'mutualFirst',
          name: 'MutualFirstFollowers',
          component: () => import('../components/Modal/FollowsModal.vue')
        }
      ]
    },
    {
      path: 'following',
      name: 'Following',
      component: () => import('../components/Modal/FollowsModal.vue')
    }
  ]
}
