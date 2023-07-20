<script lang="ts" setup>
import LoadingIcon from '@icons/loading.svg'
import Comment from '@/components/Molecules/Comment/Comment.vue'
import CommentItem from '@/components/Molecules/Comment/CommentItem.vue'

import { ref, onMounted } from 'vue'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 3000)
})
</script>

<template>
  <div class="relative">
    <div
      class="absolute top-0 left-0 w-full h-full flex flex-col pt-[10px] px-[10px] no-scrollbar overflow-y-scroll"
    >
      <CommentItem is-caption />
      <div v-if="loading" class="mt-10 flex flex-center">
        <div class="animate-spin">
          <LoadingIcon class="w-8 h-8" />
        </div>
      </div>
      <Comment v-else v-for="n in 10" :key="n" />
    </div>
  </div>
</template>
