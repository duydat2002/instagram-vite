<script lang="ts" setup>
import Modal from '@/components/Modal/Modal.vue'

import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useModalStore, useUserStore } from '@/store'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'

const router = useRouter()

const unsubscribe = ref<NodeJS.Timeout>()
const { logoutModalShow } = storeToRefs(useModalStore())

const logout = () => {
  const { setCurrentUser } = useUserStore()

  if (router.currentRoute.value.name == 'Home') router.go(0)
  else router.push('/')
  setCurrentUser(null)
}

const handleClickLogin = () => {
  clearTimeout(unsubscribe.value)
  logout()
  logoutModalShow.value = false
}

onMounted(async () => {
  const logoutTimeout = new Promise(
    () =>
      (unsubscribe.value = setTimeout(() => {
        logout()
      }, 5000))
  )

  await Promise.all([signOut(auth), logoutTimeout])

  logoutModalShow.value = false
})
</script>

<template>
  <Modal isPopup :isShow="logoutModalShow">
    <div class="w-screen max-w-[400px] bg-modal rounded-xl text-center overflow-hidden">
      <div class="p-6 flex flex-col border-b border-separator-modal">
        <span class="text-xl mb-1">Đang đăng xuất</span>
        <span class="text-textColor-secondary">Bạn cần đăng nhập lại</span>
      </div>
      <div
        class="w-full p-4 hover:bg-[#e5e5e5] text-center cursor-pointer select-none"
        @click="handleClickLogin"
      >
        <span class="leading-tight">Đăng nhập</span>
      </div>
    </div>
  </Modal>
</template>
