<script lang="ts" setup>
import Modal from './Modal.vue'

defineProps<{
  onClickOutside: Fn<any, any>
}>()
</script>

<template>
  <Modal isShow @click-outside="onClickOutside">
    <div class="flex flex-col w-screen max-w-[400px] bg-modal rounded-xl overflow-hidden">
      <div class="flex items-center h-[42px] border-b border-borderColor"></div>
      <div class=""></div>
    </div>
  </Modal>
</template>
