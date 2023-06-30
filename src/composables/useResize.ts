import { onMounted, onBeforeUnmount } from 'vue'
import { useResizeStore } from '@/store'

export const useResize = () => {
  const hanldeResize = () => {
    const { setDimensions } = useResizeStore()

    setDimensions(window.innerWidth, window.innerHeight)
  }

  onMounted(() => {
    hanldeResize()
    window.addEventListener('resize', hanldeResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', hanldeResize)
  })
}
