import { defineStore } from 'pinia'
import type { ISize, IMedia, IAdjust, IFilters } from '@/types'
import { getImage, drawInitCanvas } from '@/helpers'

interface IState {
  tabs: string[]
  currentTab: string
  medias: IMedia[]
  currentMedia: Nullable<IMedia>
  currentMediaIndex: number
  currentRatio: string
  containerSize: ISize
  filter: IFilters
  caption: string
}

const defaultAdjust: IAdjust = {
  brightness: 0,
  contrast: 0,
  saturate: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  'hue-rotate': 0,
  temperature: 0,
  blurBorder: 0
}

const defaultMedia = {
  url: null,
  image: null,
  canvas: null,
  size: {
    width: 0,
    height: 0
  },
  translate: {
    x: 0,
    y: 0
  },
  scale: 1,
  filters: {
    background: '',
    filter: ''
  },
  adjust: defaultAdjust,
  filterTemplate: {
    name: 'Normal',
    filter: defaultAdjust
  }
}

export const useCreatePostStore = defineStore('createPost', {
  state: (): IState => ({
    tabs: ['InitPost', 'EditorPost', 'FilterPost', 'CaptionPost', 'UploadPost'],
    currentTab: 'InitPost',
    medias: [],
    currentMedia: null,
    currentMediaIndex: 0,
    currentRatio: '1:1',
    containerSize: {
      height: 0,
      width: 0
    },
    filter: {} as IFilters,
    caption: ''
  }),
  actions: {
    setCurrentTab(tabName: string) {
      this.currentTab = tabName
    },
    setMedias(medias: IMedia[]) {
      this.medias = medias
    },
    addMedia(media: IMedia) {
      this.medias.push(media)
    },
    updateMedia(payload: { index: number; newMedia: IMedia }) {
      const { index, newMedia } = payload
      if (index != -1) {
        this.medias.splice(index, 1, newMedia)
        this.currentMedia = newMedia
      }
    },
    deleteMedia(mediaIndex: number) {
      this.medias.splice(mediaIndex, 1)
      this.currentMedia = this.medias[0]
    },
    setCurrentMedia(currentMedia: IMedia) {
      this.currentMedia = currentMedia
      this.currentMediaIndex = this.medias.findIndex((media) => {
        return media.url == this.currentMedia?.url
      })
    },
    setCurrentRatio(currentRatio: string) {
      this.currentRatio = currentRatio
    },
    setContainerSize(containerSize: ISize) {
      this.containerSize = containerSize
    },
    setFilter(filter: IFilters) {
      this.filter = filter
    },
    setCaption(caption: string) {
      this.caption = caption
    },
    nextTab() {
      const tabs = this.tabs
      const currentTab = this.currentTab
      const currentIndex = tabs.indexOf(currentTab)
      if (currentIndex < tabs.length - 1) {
        this.currentTab = this.tabs[currentIndex + 1]
      }
    },
    prevTab() {
      const tabs = this.tabs
      const currentTab = this.currentTab
      const currentIndex = tabs.indexOf(currentTab)
      if (currentIndex > 0) {
        this.currentTab = this.tabs[currentIndex - 1]
      }
    },
    nextMedia() {
      const medias = this.medias
      const currentMedia = this.currentMedia
      const currentIndex = medias.findIndex((media) => {
        return media.url == currentMedia?.url
      })
      if (currentIndex < medias.length - 1) {
        this.currentMedia = this.medias[currentIndex + 1]
      }
    },
    prevMedia() {
      const medias = this.medias
      const currentMedia = this.currentMedia
      const currentIndex = medias.findIndex((media) => {
        return media.url == currentMedia?.url
      })
      if (currentIndex > 0) {
        this.currentMedia = this.medias[currentIndex - 1]
      }
    },
    uploadMedias(files: FileList) {
      const medias: IMedia[] = []
      const promises = []

      for (const file of files) {
        const url = URL.createObjectURL(file)

        const promise = getImage(url).then((img) => {
          const canvas = document.createElement('canvas')

          drawInitCanvas(canvas, img, this.containerSize)

          const media = {
            ...defaultMedia,
            url,
            image: img,
            canvas,
            size: {
              width: img.width,
              height: img.height
            }
          }
          medias.push(media)
        })

        promises.push(promise)
      }

      return Promise.all(promises).then(() => {
        this.medias = medias
        this.currentMedia = medias[0]
        this.nextTab()
      })
    },
    addMedias(files: FileList) {
      const promises = []

      for (const file of files) {
        const url = URL.createObjectURL(file)

        const promise = getImage(url).then((img) => {
          const canvas = document.createElement('canvas')

          drawInitCanvas(canvas, img, this.containerSize)

          const media = {
            ...defaultMedia,
            url,
            image: img,
            canvas,
            size: {
              width: img.width,
              height: img.height
            }
          }
          this.medias.push(media)
        })

        promises.push(promise)
      }

      return Promise.all(promises)
    },
    resetCreatePost() {
      this.currentTab = 'InitPost'
      this.medias = []
      this.currentMedia = null
      this.currentRatio = '1:1'
      this.filter = {} as IFilters
    }
  }
})
