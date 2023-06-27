import { defineStore } from 'pinia'
import { auth } from '@/firebase/'
import { onAuthStateChanged } from 'firebase/auth'
import { useUser } from '@/composables/useUser'
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
    setUser(user: Nullable<IUser>) {
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
      if (auth.currentUser) this.currentUser = await getCurrentUser()
      await onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.currentUser = await getCurrentUser()
        } else {
          this.currentUser = null
        }
      })
    }
  }
})
