export interface IUser {
  id: string
  username: string
  email: string
  fullname?: string
  avatar?: string
  bio?: string
  insight?: {
    followersCount?: number
    followingCount?: number
    postsCount?: number
  }
  isPrivate?: boolean
  newsPosts?: string[]

  search?: {
    lowerUsername: string
    lowerFullname: string
  }

  isCurrentUserFollowing?: boolean
  isCurrentUserFollower?: boolean
}

export interface IUserFollow extends IUser {
  isCurrentUserFollowing?: boolean
  isCurrentUserFollower?: boolean
}
