import DashboardLayout from '@/layouts/DashboardLayout.vue'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { usePost, useUser } from '@/composables'
import { storeToRefs } from 'pinia'
import { usePostStore, useUserStore } from '@/store'

export default {
  path: '/p/:postId',
  name: 'Post',
  component: () => import('@/views/post.vue'),
  meta: { layout: DashboardLayout, requiresAuth: true },
  beforeEnter: async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const { getUserWithCheckFollow } = useUser()
    const { getPost } = usePost()
    const { user } = storeToRefs(useUserStore())
    const { post } = storeToRefs(usePostStore())

    const postTemp = await getPost(to.params.postId as string)

    if (!postTemp) {
      next({
        name: 'NotFound',
        params: { pathMatch: to.path.substring(1).split('/') },
        query: to.query,
        hash: to.hash
      })
    } else {
      post.value = postTemp

      if (user.value?.id != postTemp?.userId) {
        user.value = await getUserWithCheckFollow(postTemp.userId)
      }

      next()
    }
  }
}
