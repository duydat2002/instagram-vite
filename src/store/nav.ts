import { defineStore } from 'pinia'
import { NavTabEnum } from '@/constants'

export const useNavStore = defineStore('nav', {
  state: () => ({
    currentNav: NavTabEnum.Home as NavTabEnum
  }),
  actions: {
    setCurrentNav(nav: NavTabEnum) {
      this.currentNav = nav
    }
  }
})
