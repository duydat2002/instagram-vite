import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: true,
    isLoadingOnReload: false
  }),
  actions: {
    setIsLoading(isLoading: boolean) {
      this.isLoading = isLoading
    },
    setIsLoadingOnReload(isLoadingOnReload: boolean) {
      this.isLoadingOnReload = isLoadingOnReload
    }
  }
})
