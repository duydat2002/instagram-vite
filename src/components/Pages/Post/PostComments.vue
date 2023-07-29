<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import Comment from '@/components/Molecules/Comment/Comment.vue'
import CommentItem from '@/components/Molecules/Comment/CommentItem.vue'

import { ref, computed, onBeforeMount } from 'vue'
import { useComment } from '@/composables'
import { storeToRefs } from 'pinia'
import { usePostStore, useCommentStore } from '@/store'

const { post } = storeToRefs(usePostStore())
const { comments } = storeToRefs(useCommentStore())
const loading = ref(true)

const captionComp = computed(() => ({
  id: 'caption',
  userId: post.value!.userId,
  content: post.value!.caption,
  createdAt: post.value!.createdAt
}))

onBeforeMount(async () => {
  const { getCommentsPost } = useComment()

  comments.value = await getCommentsPost(post.value!.id)
  loading.value = false
})
</script>

<template>
  <div class="relative">
    <div
      class="absolute top-0 left-0 w-full h-full flex flex-col pt-[10px] px-[10px] no-scrollbar overflow-y-scroll"
    >
      <CommentItem v-bind="captionComp" isCaption />
      <Loading v-if="loading" class="mt-10" />
      <Comment v-else v-for="comment in comments" :key="comment.id" :comment="comment" />
    </div>
  </div>
</template>
