<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import CommentItem from './CommentItem.vue'

import { ref, watch } from 'vue'
import type { ICommentPost, IReply } from '@/types'
import { useComment } from '@/composables'

const props = defineProps<{
  comment: ICommentPost
}>()

const replies = ref<Nullable<IReply[]>>(null)
const loadingReply = ref(false)
const showReplies = ref(false)

const toggleReplies = async () => {
  showReplies.value = !showReplies.value
  if (showReplies.value) await getRepliesFn()
}

const getRepliesFn = async () => {
  const { getReplies } = useComment()

  loadingReply.value = true
  replies.value = await getReplies(props.comment.id)
  loadingReply.value = false
}

watch(
  () => props.comment.replyCount,
  async () => {
    if (showReplies.value) await getRepliesFn()
  }
)
</script>

<template>
  <div class="">
    <CommentItem v-bind="comment" />
    <div v-if="comment.replyCount > 0" class="ml-[54px]">
      <div class="flex items-center cursor-pointer" @click="toggleReplies">
        <div class="inline-block w-6 h-[1px] bg-textColor-secondary align-middle mr-4"></div>
        <span class="text-xs text-textColor-secondary font-semibold"
          >Xem câu trả lời ({{ comment.replyCount }})</span
        >
        <Loading v-if="loadingReply" class="ml-2" width="16px" />
      </div>
      <div v-if="showReplies" class="mt-3">
        <CommentItem v-for="reply in replies" :key="reply.id" v-bind="reply" />
      </div>
    </div>
  </div>
</template>
