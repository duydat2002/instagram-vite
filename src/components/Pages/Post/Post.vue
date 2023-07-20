<script lang="ts" setup>
import LikeIcon from '@icons/heart.svg'
import LikeActiveIcon from '@icons/heart-active.svg'
import CommentIcon from '@icons/comment.svg'
import SendIcon from '@icons/send.svg'
import BookmarkIcon from '@icons/bookmark.svg'
import BookmarkActiveIcon from '@icons/bookmark-active.svg'
import EmojiIcon from '@icons/emoji.svg'
import EllipsisIcon from '@icons/ellipsis.svg'

import Avatar from '@/components/Atom/Avatar.vue'
import EmojiPicker from '@/components/Molecules/Emoji/EmojiPicker.vue'
import PostSwiper from './PostSwiper.vue'
import PostComments from './PostComments.vue'

import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { usePostStore } from '@/store'
import { formatDateTime } from '@/helpers'

const commentInput = ref<Nullable<HTMLTextAreaElement>>(null)
const { user, currentUser } = storeToRefs(useUserStore())
const { post } = storeToRefs(usePostStore())
const likeActive = ref(false)
const emojiPickerActive = ref(false)
const comment = ref('')

const postContainerWidth = computed(() => {
  if (post.value!.ratio >= 1) {
    return { maxWidth: '935px' }
  } else {
    const widthTemp = 600 * post.value!.ratio + 335
    return { maxWidth: Math.max(widthTemp, 480) + 'px' }
  }
})

const postCreatedAt = computed(() => formatDateTime(post.value!.createdAt.toDate()))

const handleClickEmoji = (emoji: string) => {
  commentInput.value!.setRangeText(
    emoji,
    commentInput.value!.selectionStart,
    commentInput.value!.selectionEnd,
    'end'
  )
  commentInput.value!.focus()
}

const handleInputComment = () => {
  commentInput.value!.style.height = ''
  commentInput.value!.style.height = Math.min(commentInput.value!.scrollHeight, 80) + 'px'
}
</script>

<template>
  <div class="py-4 px-5 mx-auto box-content" :style="postContainerWidth">
    <div
      class="flex flex-col min-[736px]:flex-row w-full mx-auto min-h-[480px] max-h-none min-[736px]:max-h-[600px] box-content border border-borderColor"
    >
      <div class="flex-grow flex items-center overflow-hidden">
        <PostSwiper class="w-full" />
      </div>
      <div
        class="flex flex-col w-full min-[736px]:w-[335px] flex-shrink-0 border-l-0 min-[736px]:border-l border-borderColor"
      >
        <div class="flex items-center justify-between border-b border-borderColor">
          <div class="flex items-center p-[10px]">
            <RouterLink :to="{name: 'Profile', params: {username: user!.username}}">
              <Avatar width="32" :avatar-url="user!.avatar" />
            </RouterLink>
            <div class="ml-3 font-semibold leading-none">
              <RouterLink :to="{name: 'Profile', params: {username: user!.username}}">
                <span class="hover:opacity-60">{{ user!.username }}</span>
              </RouterLink>
              <template v-if="user!.id != currentUser?.id && user!.isCurrentUserFollowing">
                <span class="mx-1">•</span>
                <span class="hover:opacity-60 cursor-pointer">Đang theo dõi</span>
              </template>
              <template v-if="user!.id != currentUser?.id && !user!.isCurrentUserFollowing">
                <span class="mx-1">•</span>
                <span class="text-buttonColor-primary hover:text-link cursor-pointer"
                  >Theo dõi</span
                >
              </template>
            </div>
          </div>
          <div class="p-2 cursor-pointer">
            <EllipsisIcon />
          </div>
        </div>
        <PostComments class="flex-grow border-b border-borderColor h-[200px] min-[736px]:h-auto" />
        <div class="flex flex-col border-b border-borderColor">
          <div class="flex justify-between px-[10px] py-[6px]">
            <div class="flex">
              <div class="p-2 cursor-pointer select-none">
                <LikeIcon
                  v-if="!likeActive"
                  class="w-6"
                  @click="
                    () => {
                      likeActive = !likeActive
                    }
                  "
                />
                <LikeActiveIcon
                  v-else
                  class="w-6 text-error fill-error animate-[0.45s_like-button-animation_ease-in-out]"
                  @click="
                    () => {
                      likeActive = !likeActive
                    }
                  "
                />
              </div>
              <div class="p-2 cursor-pointer select-none">
                <CommentIcon />
              </div>
              <div class="p-2 cursor-pointer select-none">
                <SendIcon />
              </div>
            </div>
            <div class="p-2 cursor-pointer select-none">
              <BookmarkIcon v-if="true" class="w-6 h-6" />
              <BookmarkActiveIcon v-else class="w-6 h-6" />
            </div>
          </div>
          <div class="flex flex-col px-4 mb-4">
            <span class="text-sm font-semibold"
              >{{ post!.likeCount.toLocaleString('en-US').replace(',', '.') }} lượt thích</span
            >
            <span class="text-[10px] uppercase text-textColor-secondary">{{ postCreatedAt }}</span>
          </div>
        </div>
        <div
          class="flex items-center pr-2 py-[6px]"
          v-click-outside="
            () => {
              emojiPickerActive = false
            }
          "
        >
          <div class="relative px-4 py-2">
            <EmojiIcon
              class="cursor-pointer"
              @click="
                () => {
                  emojiPickerActive = !emojiPickerActive
                }
              "
            />
            <EmojiPicker
              v-if="emojiPickerActive"
              class="absolute left-0 min-[380px]:left-4 bottom-full mb-[7px]"
              @clicked="handleClickEmoji"
            />
          </div>
          <div class="flex-grow flex">
            <textarea
              v-model="comment"
              ref="commentInput"
              placeholder="Thêm bình luận..."
              class="h-[20px] w-full resize-none leading-[18px] overflow-y-hidden"
              @input="handleInputComment"
            />
          </div>
          <button
            class="flex-shrink-0 p-2 font-semibold text-buttonColor-primary hover:text-link disabled:opacity-40 cursor-pointer"
            :disabled="comment == ''"
          >
            Đăng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
