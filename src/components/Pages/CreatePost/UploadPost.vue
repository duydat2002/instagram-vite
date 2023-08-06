<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreatePostStore } from '@/store'
import { usePost } from '@/composables'
import { getDynamicImage } from '@/helpers'

const { title } = storeToRefs(useCreatePostStore())
const isUploadding = ref(true)

const gifStyle = computed(() => {
  return {
    backgroundImage: `url(${getDynamicImage(isUploadding.value ? 'Loading.gif' : 'Done.gif')})`
  }
})

watch(
  isUploadding,
  () => {
    title.value = isUploadding.value ? 'Đang chia sẻ' : 'Đã chia sẻ bài viết'
  },
  { immediate: true }
)

onMounted(async () => {
  const { setPost } = usePost()
  await setPost()
  isUploadding.value = false
})

onBeforeUnmount(() => {
  const { resetCreatePost } = useCreatePostStore()
  resetCreatePost()
})
</script>

<template>
  <div class="flex flex-col flex-center h-full w-[400px]">
    <div class="w-[96px] h-[96px] bg-cover bg-center bg-no-repeat" :style="gifStyle"></div>

    <p v-if="!isUploadding" class="my-4 text-xl text-textColor-primary">
      Đã chia sẻ bài viết của bạn.
    </p>
  </div>
</template>
