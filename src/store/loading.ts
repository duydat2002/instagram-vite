import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoadingProgress: true
  }),
  actions: {
    startLoading() {
      this.isLoadingProgress = true
    },
    stopLoading() {
      this.isLoadingProgress = false
    }
  }
})
