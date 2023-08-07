<script lang="ts" setup>
import Modal from '@/components/Modal/Modal.vue'
import UserItem from '@/components/Molecules/User/UserItem.vue'
import UserItemSkeleton from '@/components/Skeleton/User/UserItemSkeleton.vue'

import { storeToRefs } from 'pinia'
import { usePostStore, useUserStore } from '@/store'

const { likedListModal, isLoadingLikedList, likedList } = storeToRefs(usePostStore())
const { currentUser } = storeToRefs(useUserStore())

const close = () => {
  likedListModal.value = false
}
</script>

<template>
  <Modal isShow @click-outside="close">
    <div
      class="flex flex-col w-screen max-w-[400px] h-[calc(100vh-40px)] max-h-[400px] bg-modal rounded-xl overflow-hidden"
    >
      <div class="relative h-[42px] flex flex-center border-b border-separator-modal">
        <span class="text-base font-semibold">Lượt thích</span>
        <div
          class="absolute top-1/2 -translate-y-1/2 right-2 p-2 leading-none cursor-pointer"
          @click="close"
        >
          <fa class="text-[25px]" :icon="['fas', 'xmark']" />
        </div>
      </div>
      <div class="flex flex-col h-full overflow-y-auto">
        <template v-if="isLoadingLikedList">
          <UserItemSkeleton v-for="n in 20" :key="n" />
        </template>
        <UserItem
          v-for="user in likedList"
          :key="user.id"
          :user="user"
          :currentUser="currentUser!"
        />
      </div>
    </div>
  </Modal>
</template>
