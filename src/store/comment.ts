import { defineStore } from 'pinia'
import { findIndex } from 'lodash'
import type { ICommentPost } from '@/types'

interface IState {
  comment: string
  comments: Nullable<ICommentPost[]>
  commentRef: Nullable<HTMLInputElement>
  replyTo: Nullable<string>
}

export const useCommentStore = defineStore('comment', {
  state: (): IState => ({
    comment: '', // Comment show in input
    comments: null,
    commentRef: null,
    replyTo: null
  }),
  actions: {
    setComment(comment: string) {
      this.comment = comment
      this.commentRef?.focus()
    },
    addComment(comment: ICommentPost) {
      if (this.comments) this.comments.unshift(comment)
      else this.comments = [comment]
    },
    increaseReplyCount(commentId: string) {
      const index = findIndex(this.comments, (comment) => comment.id == commentId)
      this.comments![index].replyCount += 1
    },
    decreaseReplyCount(commentId: string) {
      const index = findIndex(this.comments, (comment) => comment.id == commentId)
      this.comments![index].replyCount -= 1
    },
    increaseLikeCount(commentId: string) {
      const index = findIndex(this.comments, (comment) => comment.id == commentId)
      this.comments![index].likeCount += 1
    },
    decreaseLikeCount(commentId: string) {
      const index = findIndex(this.comments, (comment) => comment.id == commentId)
      this.comments![index].likeCount -= 1
    },
    deleteComment(commentId: string) {
      const index = this.comments!.findIndex((comment) => comment.id === commentId)
      if (index !== -1) {
        this.comments!.splice(index, 1)
      }
    },
    setReply(replyTo: string, replyUsername: string) {
      this.replyTo = replyTo
      this.comment = `@${replyUsername} `
      this.commentRef?.focus()
    },
    resetReplyTo() {
      this.replyTo = null
    }
  }
})
