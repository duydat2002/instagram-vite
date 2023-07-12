<script lang="ts" setup>
import Modal from '@/components/Modal/Modal.vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const handleClickLogin = () => {
  if (router.currentRoute.value.name == 'Home') router.go(0)
  else router.push('/')
}
</script>

<template>
  <Modal isPopup isShow>
    <div class="w-screen max-w-[400px] bg-modal rounded-xl text-center overflow-hidden">
      <div class="p-6 flex flex-col border-b border-separator-modal">
        <span class="text-xl mb-1">Đang đăng xuất</span>
        <span class="text-textColor-secondary">Bạn cần đăng nhập lại</span>
      </div>
      <div
        class="w-full p-4 hover:bg-[#e5e5e5] text-center cursor-pointer select-none"
        @click="handleClickLogin"
      >
        <span class="mr-3 leading-tight">Đăng nhập</span>
      </div>
    </div>
  </Modal>
</template>
