<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

const { user, currentUser } = storeToRefs(useUserStore())
</script>

<template>
  <div class="">
    <div class="">{{ currentUser?.username }}</div>
    <div class="">{{ user?.username }}</div>
  </div>
</template>
