<script lang="ts" setup>
import EllipsisIcon from '@icons/ellipsis.svg'
import LikeIcon from '@icons/heart.svg'
import LikeActiveIcon from '@icons/heart-active.svg'
import Avatar from '@/components/Atom/Avatar.vue'
import ActionsPopup from '@/components/Popup/ActionsPopup.vue'

import { ref, computed, onBeforeMount, onMounted } from 'vue'
import { useComment, useLike, useUser } from '@/composables'
import { storeToRefs } from 'pinia'
import { useCommentStore, usePostStore, useUserStore } from '@/store'
import { dateDistanceToNow, convertToFullDate, convertTagUser } from '@/helpers'
import type { IAction, ICommentLike, IReplyLike, IUser } from '@/types'

const props = withDefaults(
  defineProps<{
    id?: string // id is replyId when has CommentId, is CommentId when hasn't CommentId
    commentId?: string
    userId: string
    content?: string
    likeCount?: number
    postId?: string
    replyCount?: number
    createdAt: any
    isCaption?: boolean
  }>(),
  {
    isCaption: false
  }
)

const { currentUser } = storeToRefs(useUserStore())
const user = ref<Nullable<IUser>>(null)
const like = ref<Nullable<ICommentLike | IReplyLike>>(null)
const isLike = ref(false)
const isLoadingLike = ref(false)
const likeCount = ref(props.likeCount)
const commentActionsPopup = ref(false)

const commentActionsComp = computed(() => {
  if (props.userId == currentUser.value?.id)
    return [
      {
        title: 'Báo cáo',
        classes: 'font-bold text-error'
      },
      {
        title: 'Xóa',
        classes: 'font-bold text-error',
        action: () => deleteItem()
      },
      {
        title: 'Hủy',
        action: () => {
          commentActionsPopup.value = false
        }
      }
    ] as IAction[]
  else
    return [
      {
        title: 'Báo cáo',
        classes: 'font-bold text-error'
      },
      {
        title: 'Hủy',
        action: () => {
          commentActionsPopup.value = false
        }
      }
    ]
})
const disabledLikeButtonComp = computed(() => {
  return isLoadingLike.value ? 'pointer-events-none' : 'pointer-events-auto'
})
const commentComp = computed(() => convertTagUser(props.content!))
const createdTimeComp = computed(() => dateDistanceToNow(props.createdAt.toDate(), false, false))
const fullCreatedAtComp = computed(() => convertToFullDate(props.createdAt.toDate()).toUpperCase())

const handleReply = () => {
  const { setReply } = useCommentStore()

  setReply(props.commentId || props.id!, user.value?.username!)
}

const handleLike = async () => {
  isLoadingLike.value = true
  isLike.value = true

  if (!props.commentId) {
    const { likeComment } = useLike()
    like.value = await likeComment(props.id!)
  } else {
    const { likeReply } = useLike()
    like.value = await likeReply(props.id!)
  }

  likeCount.value! += 1
  isLoadingLike.value = false
}

const handleUnlike = async () => {
  isLoadingLike.value = true
  isLike.value = false

  if (!props.commentId) {
    const { unlikeComment } = useLike()
    await unlikeComment(like.value as ICommentLike)
  } else {
    const { unlikeReply } = useLike()
    await unlikeReply(like.value as IReplyLike)
  }

  likeCount.value! -= 1
  like.value = null
  isLoadingLike.value = false
}

const deleteItem = async () => {
  if (!props.commentId) {
    // Is Comment
    const { deleteCommentPost } = useComment()
    await deleteCommentPost(props.id!)
  } else {
    // Is Reply
    const { deleteReply } = useComment()
    await deleteReply(props.commentId!, props.id!)
  }
}

const handleClickLikeCount = async () => {
  const { setLikedListModal, setIsLoadingLikedList, setLikedList } = usePostStore()
  const { getLikedUsers } = useLike()

  const type = props.commentId ? 'reply' : 'comment'

  setLikedListModal(true)
  setIsLoadingLikedList(true)
  setLikedList(await getLikedUsers(props.id!, type))
  setIsLoadingLikedList(false)
}

onBeforeMount(async () => {
  const { getUser } = useUser()

  user.value = await getUser(props.userId)
})

onMounted(async () => {
  if (!props.commentId) {
    const { getCommentLike } = useLike()
    like.value = await getCommentLike(props.id!)
  } else {
    const { getReplyLike } = useLike()
    like.value = await getReplyLike(props.id!)
  }
  isLike.value = !!like.value
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
          <span
            v-if="likeCount && likeCount > 0"
            class="font-semibold mr-3 cursor-pointer"
            @click="handleClickLikeCount"
            >{{ likeCount }} lượt thích</span
          >
          <span class="font-semibold mr-5 cursor-pointer" @click="handleReply">Trả lời</span>
          <div class="relative w-4 h-4 invisible group-hover/comment:visible cursor-pointer">
            <EllipsisIcon
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-textColor-secondary fill-textColor-secondary"
              @click="
                () => {
                  commentActionsPopup = true
                }
              "
            />
          </div>
        </template>
      </div>
    </div>
    <div v-if="!isCaption && currentUser" class="mt-3 ml-1 cursor-pointer">
      <LikeIcon
        v-if="!isLike"
        @click="handleLike"
        class="w-3 hover:opacity-60 animate-[0.45s_like-button-animation_ease-in-out]"
        :class="disabledLikeButtonComp"
      />
      <LikeActiveIcon
        v-else
        @click="handleUnlike"
        class="w-3 fill-error animate-[0.45s_like-button-animation_ease-in-out]"
        :class="disabledLikeButtonComp"
      />
    </div>
  </div>
  <ActionsPopup
    v-if="commentActionsPopup"
    :actions="commentActionsComp"
    :on-click-outside="
      () => {
        commentActionsPopup = false
      }
    "
  />
</template>
