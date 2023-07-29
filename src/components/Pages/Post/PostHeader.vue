<script lang="ts" setup>
import EllipsisIcon from '@icons/ellipsis.svg'
import Avatar from '@/components/Atom/Avatar.vue'
import UiButton from '@/components/Form/UiButton.vue'
import UnfollowPopup from '@/components/Popup/UnfollowPopup.vue'

import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore, usePostStore, useCommentStore } from '@/store'
import { useFollow } from '@/composables'

const { user, currentUser } = storeToRefs(useUserStore())
const isLoadingFollow = ref(false)
const unfollowPopupActive = ref(false)

const follow = async () => {
  if (currentUser) {
    const { setFollow } = useFollow()

    isLoadingFollow.value = true
    await setFollow(currentUser.value!.id, user.value!.id)
    isLoadingFollow.value = false
    user.value!.isCurrentUserFollowing = true
  }
}

const unfollow = async () => {
  if (currentUser) {
    const { deleteFollow } = useFollow()

    unfollowPopupActive.value = false
    isLoadingFollow.value = true
    await deleteFollow(currentUser.value!.id, user.value!.id)
    isLoadingFollow.value = false
    user.value!.isCurrentUserFollowing = false
  }
}
</script>

<template>
  <div class="flex items-center justify-between border-b border-borderColor">
    <div class="flex items-center p-[10px]">
      <RouterLink :to="{name: 'Profile', params: {username: user!.username}}">
        <Avatar width="32" :avatar-url="user!.avatar" />
      </RouterLink>
      <div class="ml-3 font-semibold leading-none">
        <RouterLink :to="{name: 'Profile', params: {username: user!.username}}">
          <span class="hover:opacity-60">{{ user!.username }}</span>
        </RouterLink>
        <template v-if="user!.id != currentUser?.id && user!.isCurrentUserFollowing">
          <span class="mx-1">•</span>
          <UiButton
            secondary
            variant="text"
            class="!p-0"
            @click="
              () => {
                unfollowPopupActive = true
              }
            "
            :is-disabled="isLoadingFollow"
            :is-loading="isLoadingFollow"
            >Đang theo dõi</UiButton
          >
        </template>
        <template v-if="user!.id != currentUser?.id && !user!.isCurrentUserFollowing">
          <span class="mx-1">•</span>
          <UiButton
            primary
            variant="text"
            class="!p-0"
            @click="follow"
            :is-disabled="isLoadingFollow"
            :is-loading="isLoadingFollow"
            >Theo dõi</UiButton
          >
        </template>
      </div>
    </div>
    <div class="p-2 cursor-pointer">
      <EllipsisIcon />
    </div>
  </div>
  <UnfollowPopup
    v-if="unfollowPopupActive"
    :user="user!"
    :onConfirm="unfollow"
    :onCancel="
      () => {
        unfollowPopupActive = false
      }
    "
    :onClickOutside="
      () => {
        unfollowPopupActive = false
      }
    "
  />
</template>
