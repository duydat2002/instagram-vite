<script lang="ts" setup>
import Modal from '@/components/Modal/Modal.vue'
import UiButton from '@/components/Form/UiButton.vue'
import UserItem from '@/components/Molecules/User/UserItem.vue'
import UserItemSkeleton from '@/components/Skeleton/User/UserItemSkeleton.vue'

import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { useFollow } from '@/composables'
import type { IUser } from '@/types'

const router = useRouter()
const route = useRoute()

const isLoadingFollowItems = ref(true)
const follows = ref<IUser[]>([])
const { user, currentUser } = storeToRefs(useUserStore())

const isMutualFollowersPage = computed(() => {
  return route.path.includes('mutualOnly') ? true : false
})

const getFollowList = async () => {
  isLoadingFollowItems.value = true
  const { getFollows, getMutualFollowers } = useFollow()

  if (route.name == 'Following') {
    follows.value = await getFollows('followings')
  } else {
    if (route.name == 'MutualFollowers') {
      follows.value = await getMutualFollowers(user.value!.id)
    } else {
      follows.value = await getFollows('followers')
      if (route.name == 'MutualFirstFollowers') {
        follows.value.sort((a, b) => {
          if (!a.isCurrentUserFollowing && b.isCurrentUserFollowing) return 1
          if (a.isCurrentUserFollowing && !b.isCurrentUserFollowing) return -1
          if (!a.isCurrentUserFollowing && !b.isCurrentUserFollowing) return 0
          return 0
        })
      }
    }
  }

  isLoadingFollowItems.value = false
}

watch(route, async () => {
  await getFollowList()
})

onMounted(async () => {
  await getFollowList()
})
</script>

<template>
  <Modal isShow @click-outside="router.push({ name: 'Profile' })">
    <div
      class="flex flex-col w-full max-w-[400px] h-[calc(100vh-40px)] max-h-[400px] bg-modal rounded-xl overflow-hidden"
    >
      <div class="relative h-[42px] flex flex-center border-b border-separator-modal">
        <span class="text-base font-semibold">Người theo dõi</span>
        <div
          class="absolute top-1/2 -translate-y-1/2 right-2 p-2 leading-none cursor-pointer"
          @click="router.push({ name: 'Profile' })"
        >
          <fa class="text-[25px]" :icon="['fas', 'xmark']" />
        </div>
      </div>
      <div class="flex flex-col h-full overflow-y-auto">
        <template v-if="isLoadingFollowItems">
          <UserItemSkeleton v-for="n in 20" :key="n" />
        </template>
        <UserItem v-for="user in follows" :key="user.id" :user="user" :currentUser="currentUser!" />
        <UiButton variant="text">
          <RouterLink v-if="isMutualFollowersPage" :to="{ name: 'MutualFirstFollowers' }"
            >Xem tất cả người theo dõi</RouterLink
          >
        </UiButton>
      </div>
    </div>
  </Modal>
</template>
