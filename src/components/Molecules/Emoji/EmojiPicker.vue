<script lang="ts" setup>
import { EMOJI } from '@/constants'

const emit = defineEmits(['clicked'])

const onClickEmojiItem = (emoji: string) => {
  emit('clicked', emoji)
}
</script>

<template>
  <div class="">
    <div
      class="w-[calc(100vw-60px)] min-[380px]:w-[315px] h-[320px] p-2 overflow-y-auto bg-white text-textColor-secondary drop-shadow-[0_0_7px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden z-10"
    >
      <div v-for="emojiType in EMOJI" :key="emojiType.label" class="mt-4 first:mt-0 flex flex-col">
        <div class="m-2 text-left font-semibold">
          {{ emojiType.label }}
        </div>
        <div class="flex flex-wrap">
          <div
            v-for="emoji in emojiType.icons"
            :key="emoji"
            class="text-[18px] w-1/6 min-[380px]:w-1/7 h-10 text-lg flex flex-center cursor-pointer transition-colors duration-200 hover:bg-separator"
            @click="onClickEmojiItem(emoji)"
          >
            {{ emoji }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
