import DashboardLayout from '@/layouts/DashboardLayout.vue'

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUser } from '@/composables'
import { useUserStore } from '@/store'

const guardProfile = (
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
}

const handleFollowModal = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const isFromProfile = from.matched.some((route) => route.name == 'Profile')
  const currentViewIndex = to.matched.length - 1
  const prevViewIndex = from.matched.length - 1

  if (!isFromProfile) {
    to.matched[currentViewIndex].components = {
      default: () => import('@/views/profile/posts.vue'),
      modal: () => import('@/components/Modal/FollowsModal.vue')
    }
  }

  if (isFromProfile) {
    if (to.matched[currentViewIndex]) {
      to.matched[currentViewIndex]!.components = {
        default: from.matched[prevViewIndex].components!.default,
        modal: () => import('@/components/Modal/FollowsModal.vue')
      }
    }

    if (from.matched.length > 1) {
      const childView = from.matched.slice(1)
      for (const view of childView) {
        to.matched.push(view)
      }
    }
  }

  console.log('from', from.matched)
  console.log('to', to.matched)

  next()
}

export default {
  path: '/:username',
  name: 'Profile',
  component: () => import('@/views/profile/index.vue'),
  meta: { layout: DashboardLayout, requiresAuth: true },
  redirect: { name: 'Posts' },
  beforeEnter: guardProfile,
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
      beforeEnter: handleFollowModal,
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
      beforeEnter: handleFollowModal
    }
  ]
}
