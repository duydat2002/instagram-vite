export interface IUserInfo {
  username: string
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
}

export interface IUserFollowData {
  isCurrentUserFollowing?: boolean // CurrentUser follow User
  isCurrentUserFollower?: boolean // User follow CurrentUser
  mutualFollowers?: IUser[]
}

export interface IUser extends IUserInfo, IUserFollowData {
  id: string
}
