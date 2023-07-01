export interface IUserInfo {
  username?: string
  email?: string
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
  searchHistory?: string[]

  isCurrentUserFollowing?: boolean
  isCurrentUserFollower?: boolean
}

export interface IUser extends IUserInfo {
  id: string
}

export interface IUserFollow extends IUser {
  isCurrentUserFollowing?: boolean
  isCurrentUserFollower?: boolean
}
