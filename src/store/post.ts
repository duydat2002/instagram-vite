import type { IPost } from '@/types'
import { defineStore } from 'pinia'

interface IState {
  post: Nullable<IPost>
  userPosts: Nullable<IPost[]>
}

export const usePostStore = defineStore('post', {
  state: (): IState => ({
    post: null,
    userPosts: null
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
    setUserPosts(posts: Nullable<IPost[]>) {
      this.userPosts = posts
    }
  }
})