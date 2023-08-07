<script lang="ts" setup>
import LikeIcon from '@icons/heart.svg'
import LikeActiveIcon from '@icons/heart-active.svg'
import CommentIcon from '@icons/comment.svg'
import SendIcon from '@icons/send.svg'
import BookmarkIcon from '@icons/bookmark.svg'
import BookmarkActiveIcon from '@icons/bookmark-active.svg'

import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostStore, useCommentStore } from '@/store'
import { useLike } from '@/composables'
import { dateDistanceToNow, convertToFullDate } from '@/helpers'
import type { IPostLike } from '@/types'

const { post } = storeToRefs(usePostStore())
const { commentRef } = storeToRefs(useCommentStore())
const like = ref<Nullable<IPostLike>>(null)
const isLike = ref(false)
const isLoadingLike = ref(false)

const disabledLikeButtonComp = computed(() => {
  return isLoadingLike.value ? 'pointer-events-none' : 'pointer-events-auto'
})
const postCreatedAt = computed(() => dateDistanceToNow(post.value!.createdAt.toDate()))
const fullCreatedAtComp = computed(() =>
  convertToFullDate(post.value!.createdAt.toDate()).toUpperCase()
)

const handleLikePost = async () => {
  const { likePost } = useLike()
  isLoadingLike.value = true
  isLike.value = true
  like.value = await likePost(post.value!.id)
  isLoadingLike.value = false
}

const handleUnlikePost = async () => {
  const { unlikePost } = useLike()
  isLoadingLike.value = true
  isLike.value = false
  await unlikePost(like.value!)
  like.value = null
  isLoadingLike.value = false
}

const commentIconClick = () => {
  commentRef.value?.focus()
}

const handleClickLikedPost = async () => {
  const { setLikedListModal, setIsLoadingLikedList, setLikedList } = usePostStore()
  const { getLikedUsers } = useLike()

  setLikedListModal(true)
  setIsLoadingLikedList(true)
  setLikedList(await getLikedUsers(post.value!.id, 'post'))
  setIsLoadingLikedList(false)
}

onMounted(async () => {
  const { getPostLike } = useLike()
  like.value = await getPostLike(post.value!.id)
  isLike.value = !!like.value
})
</script>

<template>
  <div class="flex flex-col border-b border-borderColor">
    <div class="flex justify-between px-[10px] py-[6px]">
      <div class="flex">
        <div class="p-2 cursor-pointer select-none">
          <LikeIcon
            v-if="!isLike"
            class="w-6 animate-[0.45s_like-button-animation_ease-in-out]"
            :class="disabledLikeButtonComp"
            @click="handleLikePost"
          />
          <LikeActiveIcon
            v-else
            class="w-6 text-error fill-error animate-[0.45s_like-button-animation_ease-in-out]"
            :class="disabledLikeButtonComp"
            @click="handleUnlikePost"
          />
        </div>
        <div class="p-2 cursor-pointer select-none">
          <CommentIcon @click="commentIconClick" />
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
      <span class="text-sm font-semibold cursor-pointer" @click="handleClickLikedPost"
        >{{ post!.likeCount.toLocaleString('en-US').replace(',', '.') }} lượt thích</span
      >
      <span class="text-[10px] uppercase text-textColor-secondary" :title="fullCreatedAtComp">{{
        postCreatedAt
      }}</span>
    </div>
  </div>
</template>
