import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkMode: false as boolean
  }),
  actions: {
    setTheme(value: boolean) {
      this.darkMode = value
    }
  }
})
