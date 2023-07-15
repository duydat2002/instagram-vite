<script lang="ts" setup>
import Avatar from '@/components/Atom/Avatar.vue'

withDefaults(
  defineProps<{
    n: any
    avatarSize?: string
  }>(),
  {
    avatarSize: '75'
  }
)
</script>

<template>
  <RouterLink to="" class="flex flex-col flex-center">
    <Avatar :width="avatarSize" class="outline outline-1 outline-[#dbdbdb] -outline-offset-2" />
    <span class="mt-2 text-xs font-semibold">{{ n }}'s story</span>
  </RouterLink>
</template>
