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
}
