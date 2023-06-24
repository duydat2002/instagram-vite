import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    stopScroll: false,
    scrollPosition: 0,
    logoutModalShow: false,
    modalCreatePostShow: false,
    removeMediaPopupShow: false,
    removePostPopupShow: false
  }),
  actions: {
    setStopScroll(isActive: boolean) {
      this.stopScroll = isActive
    },
    setScrollPosition(position: number) {
      this.scrollPosition = position
    },
    setLogoutModalShow(isShow: boolean) {
      this.logoutModalShow = isShow
      this.stopScroll = isShow
    },
    setModalCreatePostShow(isShow: boolean) {
      this.modalCreatePostShow = isShow
      this.stopScroll = isShow
    },
    setRemoveMediaPopupShow(isShow: boolean) {
      this.removeMediaPopupShow = isShow
    },
    setRemovePostPopupShow(isShow: boolean) {
      this.removePostPopupShow = isShow
    }
  }
})
