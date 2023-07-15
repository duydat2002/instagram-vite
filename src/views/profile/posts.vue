<script lang="ts" setup>
import UiButton from '@/components/Form/UiButton.vue'

import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

const { user, currentUser } = storeToRefs(useUserStore())
</script>

<template>
  <div class="flex flex-center">
    <div class="w-full max-w-[350px] mx-11 my-[60px] flex flex-col flex-center">
      <img src="@/assets/images/CameraCircle.png" />
      <template v-if="currentUser && currentUser.id == user!.id">
        <span class="my-6 text-3xl font-extrabold">Chia sẻ ảnh</span>
        <span class="mb-6 text-center"
          >Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn.</span
        >
        <UiButton variant="text">Chia sẻ ảnh đầu tiên của bạn</UiButton>
      </template>
      <span v-else class="my-6 text-3xl font-extrabold">Chưa có bài viết</span>
    </div>
  </div>
</template>
