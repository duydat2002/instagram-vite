<script lang="ts" setup>
import Post from '@/components/Pages/Post/Post.vue'
import PostReviewItem from '@/components/Pages/Post/PostReviewItem.vue'
import Footer from '@/components/Layout/Footer.vue'

import { ref, onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore, usePostStore } from '@/store'
import { usePost } from '@/composables'
import type { IPost } from '@/types'

const props = defineProps<{
  postId: string
}>()

const { user, currentUser } = storeToRefs(useUserStore())
const otherPosts = ref<Nullable<IPost[]>>(null)
const isLoading = ref(true)

const getPosts = async () => {
  const { getOtherUserPosts } = usePost()
  isLoading.value = true
  otherPosts.value = await getOtherUserPosts(user.value!.id, props.postId)
  isLoading.value = false
}

onBeforeRouteUpdate(async () => {
  await getPosts()
})

onMounted(async () => {
  console.log('Mounte post')
  await getPosts()
})
</script>

<template>
  <div class="w-[calc(100%-40px)] max-w-[935px] py-4 px-5 mx-auto box-content">
    <Post />
    <div
      v-if="currentUser && currentUser.id != user!.id && otherPosts"
      class="mt-12 pt-9 border-t border-borderColor"
    >
      <div class="mb-5 text-textColor-secondary font-semibold">
        Thêm các bài viết từ
        <RouterLink
          :to="{name: 'Profile', params: {username: user!.username}}"
          class="text-textColor-primary hover:opacity-60"
          >{{ user!.username }}</RouterLink
        >
      </div>
      <div class="flex flex-wrap -mx-[2px]">
        <PostReviewItem
          class="w-1/3 px-[2px] mb-1"
          v-for="post in otherPosts"
          :key="post.id"
          :post="post"
        />
      </div>
    </div>
  </div>
  <Footer />
</template>
