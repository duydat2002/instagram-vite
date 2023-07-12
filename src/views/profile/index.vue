<script lang="ts" setup>
import GridIcon from '@icons/grid.svg'
import BookmarkIcon from '@icons/bookmark.svg'
import TagIcon from '@icons/user-square.svg'
import General from '@/components/Pages/Profile/General.vue'
import Stories from '@/components/Molecules/Stories/Stories.vue'
import Footer from '@/components/Layout/Footer.vue'

import { onBeforeMount, onBeforeUnmount, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import {
  RouterView,
  onBeforeRouteUpdate,
  type RouteLocationNormalized,
  type NavigationGuardNext
} from 'vue-router'
import { useUserStore } from '@/store'
import { useUser } from '@/composables'
import type { Unsubscribe } from 'firebase/auth'

let unsubscribe: Unsubscribe
const { user } = storeToRefs(useUserStore())

onBeforeRouteUpdate(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (from.params.username != to.params.username) {
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
          const { watchUserChange } = useUser()

          await initUserWithFollow(user)
          unsubscribe = watchUserChange(user.id)

          document.title = `${user.fullname} (@${user.username}) | Instagram`
          next()
        }
      })
    } else {
      next()
    }
  }
)

onBeforeMount(async () => {
  const { watchUserChange } = useUser()
  unsubscribe = watchUserChange(user.value!.id)
  nextTick(() => {
    document.title = `${user?.value?.fullname} (@${user?.value?.username}) | Instagram`
  })
})

onBeforeUnmount(() => {
  unsubscribe()
})
</script>

<template>
  <div class="max-w-[935px] pt-[30px] px-5 mx-auto flex flex-col">
    <General class="mb-11" />
    <Stories />
    <div class="border-t border-borderColor">
      <div class="flex justify-center [&>*:not(:last-child)]:mr-[60px]">
        <router-link
          :to="{ name: 'Posts' }"
          class="flex flex-center h-[52px] text-textColor-secondary border-t border-transparent cursor-pointer has-[exact-link-active]:text-textColor-primary has-[exact-link-active]:border-black"
        >
          <GridIcon
            class="w-3 h-3 text-textColor-secondary fill-textColor-secondary parent-[.exact-link-active]:text-textColor-primary parent-[.exact-link-active]:fill-textColor-primary"
          />
          <span class="ml-[6px]">Bài viết</span>
        </router-link>
        <router-link
          :to="{ name: 'Saved' }"
          class="flex flex-center h-[52px] text-textColor-secondary border-t border-transparent cursor-pointer has-[exact-link-active]:text-textColor-primary has-[exact-link-active]:border-black"
        >
          <BookmarkIcon
            class="w-3 h-3 text-textColor-secondary fill-textColor-secondary parent-[.exact-link-active]:text-textColor-primary parent-[.exact-link-active]:fill-textColor-primary"
          />
          <span class="ml-[6px]">Đã lưu</span>
        </router-link>
        <router-link
          :to="{ name: 'Tagged' }"
          class="flex flex-center h-[52px] text-textColor-secondary border-t border-transparent cursor-pointer has-[exact-link-active]:text-textColor-primary has-[exact-link-active]:border-black"
        >
          <TagIcon
            class="w-3 h-3 text-textColor-secondary fill-textColor-secondary parent-[.exact-link-active]:text-textColor-primary parent-[.exact-link-active]:fill-textColor-primary"
          />
          <span class="ml-[6px]">Được gắn thẻ</span>
        </router-link>
      </div>
      <RouterView></RouterView>
      <RouterView name="modal"></RouterView>
    </div>
    <Footer />
  </div>
</template>
