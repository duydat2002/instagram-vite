<script lang="ts" setup>
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
  <div class="flex flex-col">
    <div class="mt-10 cursor-pointer" @click="home">Home</div>
    <div class="mt-10 cursor-pointer" @click="logout">Logout</div>
    <div class="mt-10 cursor-pointer" @click="show">user</div>
  </div>
</template>
