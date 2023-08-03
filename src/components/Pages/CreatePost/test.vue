<script lang="ts" setup>
import type { IPoint, ISize } from '@/types'

import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreatePostStore } from '@/store'
import { getReviewImageSize, getRatioCrop } from '@/helpers'

const containerRef = ref<Nullable<HTMLElement>>(null)
const cropperRef = ref<Nullable<HTMLElement>>(null)
const imageRef = ref<Nullable<HTMLElement>>(null)
const { medias, filter, currentMedia, currentMediaIndex, currentRatio, currentTab, containerSize } =
  storeToRefs(useCreatePostStore())
const scaleValue = ref(1)
const translatePosition = ref<IPoint>({ x: 0, y: 0 })
const cropperSize = ref<ISize>({ width: 0, height: 0 })
const reviewImageSize = ref<ISize>({ width: 0, height: 0 })
const mousePosition = ref<IPoint>({ x: 0, y: 0 })
const mouseDownPosition = ref<IPoint>({ x: 0, y: 0 })
const isDragging = ref(false)

const imgStyle = computed(() => {
  let cursorType
  if (currentTab.value == 'EditorPost') {
    cursorType = isDragging.value ? 'grabbing' : 'grab'
  } else if (currentTab.value == 'FilterPost') {
    cursorType = 'pointer'
  } else {
    cursorType = 'crosshair'
  }

  return {
    width: reviewImageSize.value.width + 'px',
    height: reviewImageSize.value.height + 'px',
    backgroundImage: `url(${currentMedia.value?.url})`,
    transform: `translate(calc(-50% + ${translatePosition.value.x}px), calc(-50% + ${translatePosition.value.y}px)) scale(${scaleValue.value})`,
    cursor: cursorType,
    '-webkit-filter': currentMedia.value?.filters?.filter,
    filter: currentMedia.value?.filters?.filter
  }
})

const imgCoverStyle = computed(() => ({
  background: currentMedia.value!.filters!.background
}))

watch(currentMedia, () => {})

const changeRatio = (ratio: string) => {
  const { setCurrentRatio } = useCreatePostStore()
  setCurrentRatio(ratio)

  switch (ratio) {
    case 'original':
      if (currentMedia.value!.size.height < currentMedia.value!.size.width) {
        cropperSize.value!.height =
          (containerSize.value!.width * currentMedia.value!.size.height) /
          currentMedia.value!.size.width
        cropperSize.value!.width = containerSize.value!.width
      } else {
        cropperSize.value!.height = containerSize.value!.height
        cropperSize.value!.width =
          (containerSize.value!.height * currentMedia.value!.size.width) /
          currentMedia.value!.size.height
      }
      break
    case '1:1':
      cropperSize.value!.height = containerSize.value!.height
      cropperSize.value!.width = containerSize.value!.width
      break
    case '4:5':
      cropperSize.value!.height = containerSize.value!.height
      cropperSize.value!.width = (containerSize.value!.height * 4) / 5
      break
    case '16:9':
      cropperSize.value!.height = (containerSize.value!.width * 9) / 16
      cropperSize.value!.width = containerSize.value!.width
      break
  }
}

const stick = () => {
  return new Promise<void>((resolve) => {
    reviewImageSize.value = {
      ...getReviewImageSize(currentMedia.value!.image, cropperSize.value)
    }

    if (cropperRef.value && imageRef.value) {
      setTimeout(() => {
        const cropper = cropperRef.value!.getBoundingClientRect()
        const image = imageRef.value!.getBoundingClientRect()

        if (cropper.left < image.left) {
          translatePosition.value.x += cropper.left - image.left
        }
        if (cropper.top < image.top) {
          translatePosition.value.y += cropper.top - image.top
        }
        if (cropper.right > image.right) {
          translatePosition.value.x += cropper.right - image.right
        }
        if (cropper.bottom > image.bottom) {
          translatePosition.value.y += cropper.bottom - image.bottom
        }

        resolve()
      }, 0)
    }
  })
}

onMounted(() => {
  const { setContainerSize, setCurrentMedia } = useCreatePostStore()

  if (containerRef.value)
    setContainerSize({
      width: containerRef.value.offsetWidth,
      height: containerRef.value.offsetHeight
    })

  changeRatio(currentRatio.value)

  stick()

  setCurrentMedia(medias.value[0])
})
</script>

<template>
  <div class="flex flex-nowrap w-full h-full">
    <div class="relative w-[400px]">
      <div ref="container" class="h-full flex flex-center bg-[#f5f5f5]">
        <div
          ref="cropper"
          class="relative overflow-hidden"
          :style="{
            height: cropperSize.height + 'px',
            width: cropperSize.width + 'px'
          }"
        >
          <div
            ref="image"
            :style="imgStyle"
            class="absolute top-1/2 left-1/2 bg-center bg-no-repeat bg-cover z-[1]"
          ></div>
          <div
            :style="imgCoverStyle"
            class="absolute top-0 right-0 w-full h-full pointer-events-none z-[1]"
          ></div>
        </div>
      </div>
    </div>
    <div class=""></div>
  </div>
</template>
