<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import EmojiIcon from '@icons/emoji.svg'
import EmojiPicker from '@/components/Molecules/Emoji/EmojiPicker.vue'
import PostSwiper from './PostSwiper.vue'
import PostHeader from './PostHeader.vue'
import PostComments from './PostComments.vue'
import PostActions from './PostActions.vue'

import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore, usePostStore, useCommentStore } from '@/store'
import { useComment } from '@/composables'
import type { ICommentPost, IReply } from '@/types'

const { user, currentUser } = storeToRefs(useUserStore())
const { post } = storeToRefs(usePostStore())
const { comment, commentRef, replyTo } = storeToRefs(useCommentStore())
const emojiPickerActive = ref(false)
const loadingComment = ref(false)

const postContainerWidth = computed(() => {
  if (post.value!.ratio >= 1) {
    return { maxWidth: '935px' }
  } else {
    const widthTemp = 600 * post.value!.ratio + 335
    return { maxWidth: Math.max(widthTemp, 480) + 'px' }
  }
})

const handleClickEmoji = (emoji: string) => {
  if (commentRef.value) {
    commentRef.value.setRangeText(
      emoji,
      commentRef.value.selectionStart!,
      commentRef.value.selectionEnd!,
      'end'
    )
    comment.value = commentRef.value.value
    commentRef.value.focus()
  }
}

const handleInputComment = () => {
  commentRef.value!.style.height = ''
  commentRef.value!.style.height = Math.min(commentRef.value!.scrollHeight, 80) + 'px'
}

const handleComment = async () => {
  if (comment.value != '' && currentUser.value) {
    if (!replyTo.value) {
      const { addCommentPost } = useComment()

      loadingComment.value = true
      await addCommentPost({
        userId: currentUser.value.id,
        postId: post.value!.id,
        content: comment.value,
        likeCount: 0,
        replyCount: 0
      } as ICommentPost)
    } else {
      const { addReply } = useComment()

      loadingComment.value = true
      await addReply({
        postId: post.value!.id,
        userId: currentUser.value.id,
        commentId: replyTo.value,
        content: comment.value,
        likeCount: 0
      } as IReply)
    }

    emojiPickerActive.value = false
    loadingComment.value = false
    commentRef.value!.value = ''
    comment.value = ''
  }
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
        <PostHeader />
        <PostComments class="flex-grow border-b border-borderColor h-[200px] min-[736px]:h-auto" />
        <PostActions />
        <div
          v-if="currentUser"
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
          <div class="flex-grow flex relative">
            <textarea
              v-model="comment"
              ref="commentRef"
              placeholder="Thêm bình luận..."
              class="h-[20px] w-full resize-none leading-[18px] overflow-y-hidden"
              @input="handleInputComment"
              @keydown.enter.prevent="handleComment"
            />
            <Loading v-if="loadingComment" class="absolute top-0 left-0 w-full h-full" />
          </div>
          <button
            class="flex-shrink-0 p-2 font-semibold text-buttonColor-primary hover:text-link disabled:opacity-40 disabled:hover:text-buttonColor-primary disabled:cursor-default cursor-pointer"
            :disabled="comment == ''"
            @click="handleComment"
          >
            Đăng
          </button>
        </div>
        <div v-else class="py-2 px-4 text-textColor-secondary">
          <RouterLink :to="{ name: 'Login' }" class="text-buttonColor-primary hover:text-link"
            >Đăng nhập</RouterLink
          >
          <span> để thích hoặc bình luận.</span>
        </div>
      </div>
    </div>
  </div>
</template>
