<script lang="ts" setup>
import EmojiIcon from '@icons/emoji.svg'
import LocationIcon from '@icons/location.svg'

import Avatar from '@/components/Atom/Avatar.vue'
import EmojiPicker from '@/components/Molecules/Emoji/EmojiPicker.vue'

import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore, useCreatePostStore } from '@/store'

const { currentUser } = storeToRefs(useUserStore())
const { caption, medias } = storeToRefs(useCreatePostStore())
const captionInputRef = ref<Nullable<HTMLTextAreaElement>>(null)
const activeEmojiTooltip = ref(false)
const activeCharactersTooltip = ref(false)
const activeAccessibility = ref(false)

const characterCount = computed(() => {
  return caption.value.length.toLocaleString('en-US').replace(',', '.')
})

const handleClickEmoji = (emoji: string) => {
  if (captionInputRef.value) {
    captionInputRef.value.setRangeText(
      emoji,
      captionInputRef.value.selectionStart!,
      captionInputRef.value.selectionEnd!,
      'end'
    )
    caption.value = captionInputRef.value.value
    captionInputRef.value.focus()
  }
}

watch(caption, (newCaption, oldCaption) => {
  if (newCaption.length >= 2200) {
    caption.value = newCaption.slice(0, oldCaption.length)
  }
})
</script>

<template>
  <div class="flex flex-nowrap flex-col w-[340px] h-full pb-6 overflow-y-scroll">
    <div class="flex items-center my-3 ml-3">
      <Avatar width="28" :avatar-url="currentUser!.avatar" border-color="border-transparent" />
      <div class="ml-2 font-semibold">{{ currentUser!.username }}</div>
    </div>
    <div class="flex flex-col">
      <div class="h-[168px]">
        <textarea
          class="w-full h-full px-4 text-base resize-none placeholder:text-placeholder"
          v-model="caption"
          ref="captionInputRef"
          placeholder="Viết chú thích..."
        ></textarea>
      </div>
      <div class="flex items-center justify-between px-2 flex-shrink-0">
        <div
          class="relative"
          v-click-outside="
            () => {
              activeEmojiTooltip = false
            }
          "
        >
          <div class="p-2 cursor-pointer" @click="activeEmojiTooltip = !activeEmojiTooltip">
            <EmojiIcon
              width="20"
              height="20"
              class="text-textColor-secondary fill-textColor-secondary align-middle"
            />
          </div>
          <EmojiPicker
            v-if="activeEmojiTooltip"
            class="emoji-picker absolute top-full mt-1 min-[380px]:w-[300px]"
            @clicked="handleClickEmoji"
          />
        </div>
        <div
          class="maximum-characters relative mr-2"
          :class="{ active: activeCharactersTooltip }"
          v-click-outside.short="
            () => {
              activeCharactersTooltip = false
            }
          "
        >
          <span
            class="text-xs text-textColor-secondary cursor-pointer parent-[.maximum-characters.active]:text-textColor-primary"
            @click="activeCharactersTooltip = !activeCharactersTooltip"
            >{{ characterCount }}/2.200</span
          >
          <div
            v-if="activeCharactersTooltip"
            class="maximum-characters-tolltip absolute mt-[10px] p-3 top-full right-0 w-[291px] text-center text-white bg-black rounded-lg drop-shadow-[0_0_7px_rgba(0,0,0,0.1)] z-[1]"
          >
            <span>Chú thích dài hơn 125 ký tự sẽ bị cắt bớt trên bảng feed.</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-between relative w-full px-4 text-base border-t border-separator-modal"
    >
      <input
        type="text"
        class="flex-grow text-base leading-[30px] py-[7px]"
        placeholder="Thêm vị trí"
      />
      <div class="ml-2">
        <LocationIcon v-if="true" class="text-textColor-primary fill-textColor-primary" />
        <fa v-else :icon="['far', 'circle-xmark']" />
      </div>
    </div>
    <div class="flex flex-col w-full px-4 text-base border-t border-separator-modal">
      <div
        class="flex items-center justify-between w-full cursor-pointer"
        @click="activeAccessibility = !activeAccessibility"
      >
        <span class="py-3 leading-[20px]">Trợ năng</span>
        <div>
          <fa v-if="!activeAccessibility" :icon="['fas', 'chevron-down']" />
          <fa v-else :icon="['fas', 'chevron-up']" />
        </div>
      </div>
      <div v-if="activeAccessibility">
        <div>
          <span class="block text-xs text-textColor-secondary text-left"
            >Văn bản thay thế mô tả ảnh cho những người suy giảm thị lực. Văn bản thay thế sẽ được
            tạo tự động cho ảnh của bạn hoặc bạn có thể tự viết.</span
          >
          <div class="mt-3">
            <div v-for="media in medias" :key="media.url" class="flex mb-4">
              <div class="w-11 h-11 mr-2">
                <img :src="media.url" />
              </div>
              <div class="flex-grow border border-separator-modal rounded-md overflow-hidden">
                <input
                  class="w-full h-full px-3 py-1 text-sm"
                  type="text"
                  placeholder="Viết văn bản thay thế..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-col w-full px-4 text-base border-t border-separator-modal">
      <div class="flex items-center justify-between w-full cursor-pointer">
        <span class="py-3 leading-[20px]">Cài đặt nâng cao</span>
        <div>
          <fa v-if="true" :icon="['fas', 'chevron-down']" />
          <fa v-else :icon="['fas', 'chevron-up']" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emoji-picker::after {
  content: '';
  width: 20px;
  height: 20px;
  position: absolute;
  top: -5px;
  left: 8px;
  background: #fff;
  border-radius: 2px;
  transform: rotateZ(45deg);
  z-index: -1;
}

.maximum-characters-tolltip::after {
  content: '';
  width: 20px;
  height: 20px;
  position: absolute;
  top: -5px;
  right: 10px;
  background: #000;
  border-radius: 2px;
  transform: rotateZ(45deg);
  z-index: -1;
}
</style>
