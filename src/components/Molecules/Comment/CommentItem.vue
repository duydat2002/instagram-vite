<script lang="ts" setup>
import EllipsisIcon from '@icons/ellipsis.svg'
import LikeIcon from '@icons/heart.svg'
import LikeActiveIcon from '@icons/heart-active.svg'
import Avatar from '@/components/Atom/Avatar.vue'

import { ref, computed, onBeforeMount } from 'vue'
import { useUser } from '@/composables'
import { useCommentStore } from '@/store'
import { dateDistanceToNow, convertToFullDate, convertTagUser } from '@/helpers'
import type { IUser } from '@/types'

const props = withDefaults(
  defineProps<{
    id?: string
    commentId?: string
    userId: string
    content?: string
    likeCount?: number
    createdAt: any
    isCaption?: boolean
  }>(),
  {
    isCaption: false
  }
)

const user = ref<Nullable<IUser>>(null)

const commentComp = computed(() => convertTagUser(props.content!))
const createdTimeComp = computed(() => dateDistanceToNow(props.createdAt.toDate(), false, false))
const fullCreatedAtComp = computed(() => convertToFullDate(props.createdAt.toDate()).toUpperCase())

const handleReply = () => {
  const { setReply } = useCommentStore()

  setReply(props.commentId || props.id!, user.value?.username!)
}

onBeforeMount(async () => {
  const { getUser } = useUser()

  user.value = await getUser(props.userId)
})
</script>

<template>
  <div v-if="content" class="flex group/comment mb-4 mt-2">
    <div class="">
      <Avatar width="32" :avatar-url="user?.avatar" />
    </div>
    <div class="flex flex-grow flex-col ml-3 mt-[2px]">
      <div class="">
        <RouterLink v-if="user" :to="{ name: 'Profile', params: { username: user.username } }">
          <span class="font-semibold mr-1">{{ user.username }}</span>
        </RouterLink>
        <div class="inline-flex items-center">
          <span class="leading-tight" v-html="commentComp"></span>
        </div>
      </div>
      <div class="flex flex-wrap items-center mt-1 text-xs text-textColor-secondary">
        <span class="mr-3 cursor-pointer" :title="fullCreatedAtComp">{{ createdTimeComp }}</span>
        <template v-if="!isCaption">
          <span class="font-semibold mr-3 cursor-pointer">{{ likeCount }} lượt thích</span>
          <span class="font-semibold mr-5 cursor-pointer" @click="handleReply">Trả lời</span>
          <div class="relative w-4 h-4 invisible group-hover/comment:visible cursor-pointer">
            <EllipsisIcon
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-textColor-secondary fill-textColor-secondary"
            />
          </div>
        </template>
      </div>
    </div>
    <div v-if="!isCaption" class="mt-3 ml-1">
      <LikeIcon v-if="true" class="w-3 hover:opacity-60 cursor-pointer" />
      <LikeActiveIcon v-else class="w-3 hover:opacity-60 cursor-pointer" />
    </div>
  </div>
</template>
