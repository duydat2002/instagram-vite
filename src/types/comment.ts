//Comments(id, postId, storyId, userId, content, likesCount, replyCount, created_at)
export interface IComment {
  id: string
  userId: string
  content: string
  likeCount: number
  createdAt: any
}

export interface ICommentPost extends IComment {
  postId: string
  replyCount: number
}

export interface ICommentStory extends IComment {
  storyId: string
}

export interface IReply extends IComment {
  postId: string
  commentId: string
}
