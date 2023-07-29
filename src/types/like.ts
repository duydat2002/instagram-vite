export interface ILike {
  id: string
  userId: string
  createdAt: any
}

export interface IPostLike extends ILike {
  postId: string
}

export interface ICommentLike extends ILike {
  commentId: string
}

export interface IReplyLike extends ILike {
  replyId: string
}

export interface IStoryLike extends ILike {
  storyId: string
}
