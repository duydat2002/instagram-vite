import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoadingProgress: false,
    isLoadingSplash: false
  }),
  actions: {
    startLoading() {
      this.isLoadingProgress = true
    },
    stopLoading() {
      this.isLoadingProgress = false
    },

    startSplash() {
      this.isLoadingSplash = true
    },
    stopSplash() {
      this.isLoadingSplash = false
    }
  }
})
