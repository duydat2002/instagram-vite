<script lang="ts" setup>
import GridIcon from '@icons/grid.svg'
import BookmarkIcon from '@icons/bookmark.svg'
import TagIcon from '@icons/user-square.svg'
import SettingIcon from '@icons/setting.svg'
import BackIcon from '@icons/back.svg'
import DownIcon from '@icons/down.svg'
import MoreUserIcon from '@icons/more-user.svg'
import General from '@/components/Pages/Profile/General.vue'
import Footer from '@/components/Layout/Footer.vue'

import { computed, onBeforeMount, onBeforeUnmount, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useRouter,
  RouterView,
  onBeforeRouteUpdate,
  type RouteLocationNormalized,
  type NavigationGuardNext
} from 'vue-router'
import { useUserStore } from '@/store'
import { useUser } from '@/composables'
import type { Unsubscribe } from 'firebase/auth'

let unsubscribe: Unsubscribe
const router = useRouter()
const { user, currentUser } = storeToRefs(useUserStore())

const isCurrentUser = computed(() => {
  return (currentUser.value && currentUser.value.id == user.value!.id) as boolean
})

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
  <div class="max-w-[935px] pt-[30px] px-0 min-[736px]:px-5 mx-auto box-content flex flex-col">
    <div
      class="fixed top-0 left-0 right-0 h-[45px] px-4 flex min-[768px]:hidden items-center bg-bgColor-primary border-b border-borderColor z-30"
    >
      <div class="flex-shrink-0">
        <SettingIcon v-if="isCurrentUser" class="w-6 h-6 cursor-pointer" />
        <BackIcon v-else class="w-6 h-6 cursor-pointer" @click="router.back()" />
      </div>
      <div class="flex-grow flex flex-center text-center cursor-pointer">
        <span class="text-base font-semibold">{{ user!.fullname }}</span>
        <div class="p-2" v-if="isCurrentUser">
          <DownIcon />
        </div>
      </div>
      <div class="flex-shrink-0">
        <MoreUserIcon v-if="isCurrentUser" class="w-6 h-6 cursor-pointer" />
        <div v-else class="w-6"></div>
      </div>
    </div>
    <General :isCurrentUser="isCurrentUser" class="mt-[45px] min-[768px]:mt-0" />

    <div class="border-t border-borderColor">
      <div
        class="flex justify-normal min-[736px]:justify-center min-[736px]:[&>*:not(:last-child)]:mr-[60px]"
      >
        <router-link
          :to="{ name: 'Posts' }"
          class="flex flex-center flex-[1_1_0%] min-[736px]:flex-none h-[52px] text-textColor-secondary border-t border-transparent cursor-pointer has-[exact-link-active]:text-textColor-primary has-[exact-link-active]:border-black"
        >
          <GridIcon
            class="w-3 h-3 text-textColor-secondary fill-textColor-secondary parent-[.exact-link-active]:text-textColor-primary parent-[.exact-link-active]:fill-textColor-primary"
          />
          <span class="ml-[6px]">Bài viết</span>
        </router-link>
        <router-link
          :to="{ name: 'Saved' }"
          class="flex flex-center flex-[1_1_0%] min-[736px]:flex-none h-[52px] text-textColor-secondary border-t border-transparent cursor-pointer has-[exact-link-active]:text-textColor-primary has-[exact-link-active]:border-black"
        >
          <BookmarkIcon
            class="w-3 h-3 text-textColor-secondary fill-textColor-secondary parent-[.exact-link-active]:text-textColor-primary parent-[.exact-link-active]:fill-textColor-primary"
          />
          <span class="ml-[6px]">Đã lưu</span>
        </router-link>
        <router-link
          :to="{ name: 'Tagged' }"
          class="flex flex-center flex-[1_1_0%] min-[736px]:flex-none h-[52px] text-textColor-secondary border-t border-transparent cursor-pointer has-[exact-link-active]:text-textColor-primary has-[exact-link-active]:border-black"
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
