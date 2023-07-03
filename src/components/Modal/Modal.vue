<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store'

const emit = defineEmits(['click-outside'])
const props = withDefaults(
  defineProps<{
    isPopup: boolean
    isShow: boolean
  }>(),
  {
    isPopup: false,
    isShow: false
  }
)

const { scrollPosition, stopScroll } = storeToRefs(useModalStore())

const handleClickOutsideModal = () => {
  if (
    (document.querySelector('#modal > div') && !document.querySelector('#popup > div')) ||
    (!document.querySelector('#modal > div') && document.querySelector('#popup > div'))
  ) {
    emit('click-outside')
  }
}

onMounted(() => {
  if (props.isShow) stopScroll.value = true
  setTimeout(() => {
    document.documentElement.scrollTop = scrollPosition.value
  }, 0)
})

onUnmounted(() => {
  if (!props.isPopup) {
    stopScroll.value = false
  }
  setTimeout(() => {
    document.documentElement.scrollTop = scrollPosition.value
  }, 0)
})
</script>

<template>
  <Teleport :to="isPopup ? '#popup' : '#modal'">
    <div
      v-if="isShow"
      class="fixed top-0 left-0 right-0 bottom-0 flex flex-center bg-[#0000004d] z-50"
    >
      <div class="m-5 flex flex-center" v-click-outside="handleClickOutsideModal">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
