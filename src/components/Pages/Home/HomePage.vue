<script lang="ts" setup>
import Suggest from '@/components/Layout/Suggest.vue'

import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'
import { useUserStore } from '@/store'
import { useRouter } from 'vue-router'

const logout = async () => {
  const { setCurrentUser } = useUserStore()
  await signOut(auth)
  setCurrentUser(null)
  router.go(0)
}

const show = () => {
  const { currentUser } = useUserStore()
  console.log('currentUser', currentUser)
  console.log('auth.currentUser', auth.currentUser)
}

const router = useRouter()
const home = () => {
  router.go(0)
}
</script>

<template>
  <div class="flex h-[1500px]">
    <div class="flex flex-col flex-grow">
      <div class="mt-10 cursor-pointer" @click="home">Home</div>
      <div class="mt-10 cursor-pointer" @click="logout">Logout</div>
      <div class="mt-10 cursor-pointer" @click="show">user</div>
    </div>
    <Suggest />
  </div>
</template>
