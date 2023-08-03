<script lang="ts" setup>
import ArrowBackIcon from '@icons/arrowback.svg'
import Modal from './Modal.vue'
import UiButton from '../Form/UiButton.vue'
import InitPost from '@/components/Pages/CreatePost/InitPost.vue'
import EditorPost from '@/components/Pages/CreatePost/EditorPost.vue'
import RemovePopup from '@/components/Popup/RemovePopup.vue'

import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreatePostStore, useModalStore } from '@/store'

defineProps<{
  onClickOutside: Fn<any, any>
}>()

const { removeMediaPopupShow, removePostPopupShow, modalCreatePostShow } = storeToRefs(
  useModalStore()
)
const { currentTab, currentMediaIndex, title } = storeToRefs(useCreatePostStore())

const isClickBackFromEditor = ref(false)

const isShowButton = computed(() => {
  return !['InitPost', 'UploadPost'].includes(currentTab.value)
})

const handlePrevTab = () => {
  const { prevTab } = useCreatePostStore()

  if (currentTab.value == 'EditorPost') {
    isClickBackFromEditor.value = true
    removePostPopupShow.value = true
  } else {
    isClickBackFromEditor.value = false
    prevTab()
  }
}

const handleNextTab = () => {
  const { nextTab } = useCreatePostStore()
  nextTab()
}

const handleRemovePost = () => {
  const { resetCreatePost, prevTab } = useCreatePostStore()

  if (isClickBackFromEditor.value) {
    removePostPopupShow.value = false
    prevTab()
  } else {
    removePostPopupShow.value = false
    modalCreatePostShow.value = false
  }

  setTimeout(() => {
    resetCreatePost()
  }, 0)
}

const hanldeRemoveMedia = () => {
  const { deleteMedia } = useCreatePostStore()

  deleteMedia(currentMediaIndex.value)
  removeMediaPopupShow.value = false
}

watch(currentTab, () => {
  switch (currentTab.value) {
    case 'InitPost':
      title.value = 'Tạo bài viết mới'
      break
    case 'EditorPost':
      title.value = 'Cắt'
      break
    case 'FilterPost':
      title.value = 'Chỉnh sửa'
      break
    case 'CaptionPost':
      title.value = 'Tạo bài viết mới'
      break
    case 'UploadPost':
      title.value = 'Đang chia sẻ'
      break
    default:
      title.value = ''
  }
})

onBeforeUnmount(() => {
  const { resetCreatePost } = useCreatePostStore()
  resetCreatePost()
})
</script>

<template>
  <Modal isShow @click-outside="onClickOutside">
    <div class="flex flex-col w-screen max-w-[400px] bg-modal rounded-xl overflow-hidden">
      <div class="relative flex items-center justify-between h-[42px] border-b border-borderColor">
        <div v-if="isShowButton" class="ml-2 p-2 cursor-pointer select-none" @click="handlePrevTab">
          <ArrowBackIcon />
        </div>
        <span
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-semibold whitespace-nowrap"
          >{{ title }}</span
        >
        <UiButton v-if="isShowButton" variant="text" @click="handleNextTab">
          <span class="text-buttonColor-primary select-none hover:text-link">{{
            currentTab != 'CaptionPost' ? 'Tiếp' : 'Chia sẻ'
          }}</span>
        </UiButton>
      </div>
      <div class="max-h-[400px] h-screen">
        <InitPost v-if="currentTab == 'InitPost'" />
        <EditorPost v-else />
      </div>
    </div>
  </Modal>

  <RemovePopup
    v-if="removePostPopupShow"
    title="Bỏ bài viết?"
    desc="Nếu rời đi, bạn sẽ mất những gì vừa chỉnh sửa."
    @remove="handleRemovePost"
    @cancel="
      () => {
        removePostPopupShow = false
      }
    "
  />
  <RemovePopup
    v-if="removeMediaPopupShow"
    title="Bỏ ảnh?"
    desc="Thao tác này sẽ gỡ ảnh khỏi bài viết của bạn."
    @remove="hanldeRemoveMedia"
    @cancel="
      () => {
        removePostPopupShow = false
      }
    "
  />
</template>
