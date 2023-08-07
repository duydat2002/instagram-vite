import type { IPost, IUser } from '@/types'
import { defineStore } from 'pinia'

interface IState {
  post: Nullable<IPost>
  userPosts: Nullable<IPost[]>
  likedListModal: boolean
  isLoadingLikedList: boolean
  likedList: Nullable<IUser[]>
}

export const usePostStore = defineStore('post', {
  state: (): IState => ({
    post: null,
    userPosts: null,
    likedListModal: false,
    isLoadingLikedList: false,
    likedList: null
  }),
  actions: {
    setPost(post: Nullable<IPost>) {
      this.post = post
    },
    updatePost(data: any) {
      Object.assign(this.post!, data)
    },
    increaseCommentCount() {
      this.post!.commentCount += 1
    },
    increaseLikeCount() {
      this.post!.likeCount += 1
    },
    decreaseLikeCount() {
      this.post!.likeCount -= 1
    },
    setUserPosts(posts: Nullable<IPost[]>) {
      this.userPosts = posts
    },
    setLikedListModal(value: boolean) {
      this.likedListModal = value
    },
    setLikedList(value: Nullable<IUser[]>) {
      this.likedList = value
    },
    setIsLoadingLikedList(value: boolean) {
      this.isLoadingLikedList = value
    }
  }
})
