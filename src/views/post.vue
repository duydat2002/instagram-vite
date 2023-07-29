<script lang="ts" setup>
import SettingIcon from '@icons/setting.svg'
import BackIcon from '@icons/back.svg'
import DownIcon from '@icons/down.svg'
import MoreUserIcon from '@icons/more-user.svg'
import Post from '@/components/Pages/Post/Post.vue'
import PostReviewItem from '@/components/Pages/Post/PostReviewItem.vue'
import Footer from '@/components/Layout/Footer.vue'

import { ref, computed, onMounted } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { usePost } from '@/composables'
import type { IPost } from '@/types'

const props = defineProps<{
  postId: string
}>()

const router = useRouter()
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
  await getPosts()
})
</script>

<template>
  <div class="w-[calc(100%-40px)] max-w-[935px] py-4 px-5 mx-auto box-content">
    <div
      class="fixed top-0 left-0 right-0 h-[45px] px-4 flex min-[768px]:hidden items-center bg-bgColor-primary border-b border-borderColor z-30"
    >
      <div class="flex-shrink-0">
        <BackIcon class="w-6 h-6 cursor-pointer" @click="router.back()" />
      </div>
      <div class="flex-grow flex flex-center text-center cursor-pointer">
        <span class="text-base font-semibold">Bài viết</span>
      </div>
    </div>
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
