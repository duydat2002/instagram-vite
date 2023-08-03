<script lang="ts" setup>
import UiButton from '@/components/Form/UiButton.vue'
import MediafileIcon from '@icons/mediafile.svg'
import ExclamationIcon from '@icons/exclamation.svg'

import { ref } from 'vue'
import { useCreatePostStore } from '@/store'

const isError = ref(false)
const fileErrorName = ref('')

const getInputFiles = (event: Event) => {
  const { uploadMedias, setTitle } = useCreatePostStore()

  isError.value = false
  const files = (event.target as HTMLInputElement).files

  if (files) {
    const fileArr = Array.from(files!)
    for (const index in fileArr) {
      if (fileArr[index].size < 1024 * 5) {
        isError.value = true
        fileErrorName.value = fileArr[index].name
        setTitle('File phải có kích thước từ 5 KB trở lên')
        break
      }
    }
    if (!isError.value) uploadMedias(files)
  }
}

const handleDragOver = (event: Event) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent) => {
  const { uploadMedias, setTitle } = useCreatePostStore()

  event.preventDefault()
  isError.value = false
  const files = event.dataTransfer?.files

  if (files) {
    const fileArr = Array.from(files!)
    for (const index in fileArr) {
      if (fileArr[index].size < 1024 * 5) {
        isError.value = true
        fileErrorName.value = fileArr[index].name
        setTitle('File phải có kích thước từ 5 KB trở lên')
        break
      }
    }
    if (!isError.value) uploadMedias(files)
  }
}
</script>

<template>
  <div class="w-[400px] h-full p-6" @dragover="handleDragOver($event)" @drop="handleDrop($event)">
    <form
      method="post"
      class="w-full h-full flex flex-col flex-center"
      enctype="multipart/form-data"
    >
      <MediafileIcon v-if="!isError" />
      <ExclamationIcon v-else />
      <span class="text-xl mt-[10px]">Kéo ảnh và video vào đây</span>
      <span v-if="isError" class="text-sm text-textColor-secondary text-center mt-1">
        <span class="font-semibold">{{ fileErrorName }}</span>
        quá nhỏ. Để tiếp tục, hãy chọn file có kích thước từ 5 KB trở lên
      </span>
      <UiButton primary class="mt-5">
        <span>Chọn từ máy tính</span>
        <input
          ref="inputFiles"
          accept="image/*, video/*"
          type="file"
          class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          multiple
          @change="getInputFiles($event)"
        />
      </UiButton>
    </form>
  </div>
</template>
