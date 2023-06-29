<script lang="ts" setup>
import HomeLogin from '@/components/Pages/Home/HomeLogin.vue'
import HomePage from '@/components/Pages/Home/HomePage.vue'

import { useUserStore } from '@/store'
const { currentUser } = useUserStore()
</script>

<template>
  <!-- Home -->
  <HomePage v-if="currentUser" />
  <!-- Login -->
  <HomeLogin v-else />
</template>
