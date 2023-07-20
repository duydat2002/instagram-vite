<script lang="ts" setup>
import Modal from '@/components/Modal/Modal.vue'

const emit = defineEmits(['confirm', 'cancel', 'click-outside'])
withDefaults(
  defineProps<{
    title?: string
    desc?: string
    confirmMessage: string
    cancelMessage?: string
  }>(),
  {
    cancelMessage: 'Hủy'
  }
)

const onConfirm = () => {
  emit('confirm')
}
const onCancel = () => {
  emit('cancel')
}

const onClickOutside = () => {
  emit('click-outside')
}
</script>

<template>
  <Modal isPopup isShow @click-outside="onClickOutside">
    <div class="w-screen max-w-[400px] bg-modal rounded-xl text-center overflow-hidden">
      <div class="p-8">
        <span v-if="title" class="block text-xl">{{ title }}</span>
        <span v-if="desc" class="block text-textColor-secondary">{{ desc }}</span>
        <slot />
      </div>
      <div
        class="p-[13px] border-t border-separator-modal active:bg-[#e5e5e5] cursor-pointer select-none font-bold text-error"
        @click="onConfirm"
      >
        <span>{{ confirmMessage }}</span>
      </div>
      <div
        class="p-[13px] border-t border-separator-modal active:bg-[#e5e5e5] cursor-pointer select-none"
        @click="onCancel"
      >
        <span>{{ cancelMessage }}</span>
      </div>
    </div>
  </Modal>
</template>
