<script lang="ts" setup>
import Modal from '@/components/Modal/Modal.vue'
import type { IAction } from '@/types'

withDefaults(
  defineProps<{
    actions: IAction[]
    onClickOutside: Fn<any, any>
  }>(),
  {}
)
</script>

<template>
  <Modal isPopup isShow @click-outside="onClickOutside">
    <div
      class="w-screen max-w-[400px] bg-modal rounded-xl text-center overflow-hidden text-textColor-primary"
    >
      <span
        v-for="(action, i) in actions"
        :key="i"
        class="block p-[13px] border-t border-separator-modal active:bg-[#e5e5e5] cursor-pointer select-none"
        :class="action.classes"
        @click="action.action"
        >{{ action.title }}</span
      >
    </div>
  </Modal>
</template>
