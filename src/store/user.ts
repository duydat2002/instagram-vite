import { defineStore } from 'pinia'
import { useUser, useFollow } from '@/composables'
import type { IUser } from '@/types'

interface IState {
  user: Nullable<IUser>
  currentUser: Nullable<IUser>
}

export const useUserStore = defineStore('user', {
  state: (): IState => ({
    user: null, //Người dùng đang xem trang cá nhân
    currentUser: null //Người dùng đang đăng nhập
  }),
  actions: {
    async setUser(user: Nullable<IUser>) {
      this.user = user
    },
    setCurrentUser(currentUser: Nullable<IUser>) {
      this.currentUser = currentUser
    },
    updateUser(payload: any) {
      Object.assign(this.user!, payload)
    },
    updateCurrentUser(payload: any) {
      Object.assign(this.currentUser!, payload)
    },
    async initCurrentUser() {
      const { getCurrentUser } = useUser()

      this.currentUser = await getCurrentUser()
    },
    async initUserWithFollow(user: IUser) {
      const { isFollowing, getMutualFollowers } = useFollow()
      if (this.currentUser) {
        const isCurrentUserFollowing = await isFollowing(this.currentUser.id, user.id)
        const mutualFollowers = await getMutualFollowers(user.id)

        user = {
          ...user,
          isCurrentUserFollowing,
          mutualFollowers
        } as IUser
      }
      this.user = user
    }
  }
})
