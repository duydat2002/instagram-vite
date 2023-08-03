<script lang="ts" setup>
import RatioIcon from '@icons/ratio.svg'
import ImageIcon from '@icons/image.svg'
import Ratio1x1 from '@icons/ratio1-1.svg'
import Ratio4x5 from '@icons/ratio4-5.svg'
import Ratio16x9 from '@icons/ratio16-9.svg'
import GlassPlusIcon from '@icons/glass-plus.svg'
import LayerIcon from '@icons/layer.svg'

import ListPost from './ListPost.vue'

import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreatePostStore } from '@/store'
import { getReviewImageSize, getRatioCrop } from '@/helpers'
import type { IMedia, IPoint, ISize } from '@/types'

const containerRef = ref<Nullable<HTMLDivElement>>(null)
const cropperRef = ref<Nullable<HTMLDivElement>>(null)
const imageRef = ref<Nullable<HTMLDivElement>>(null)
const scaleRef = ref<Nullable<HTMLInputElement>>(null)
const { medias, currentMedia, currentMediaIndex, currentRatio, currentTab, containerSize } =
  storeToRefs(useCreatePostStore())
const scaleValue = ref(1)
const cropperSize = ref<ISize>({ width: 0, height: 0 })
const reviewImageSize = ref<ISize>({ width: 0, height: 0 })
const translatePosition = ref<IPoint>({ x: 0, y: 0 })
const mousePosition = ref<IPoint>({ x: 0, y: 0 })
const mouseDownPosition = ref<IPoint>({ x: 0, y: 0 })
const aspectRatioActive = ref(false)
const scaleImageActive = ref(false)
const listImageActive = ref(false)
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

const handleChangeScale = () => {
  const { updateMedia } = useCreatePostStore()

  stick().then(() => {
    drawCanvas()

    const media = {
      ...currentMedia.value,
      scale: scaleValue.value
    }

    updateMedia({ index: currentMediaIndex.value, newMedia: media as IMedia })
  })
}

const mouseDownImage = (event: MouseEvent) => {
  if (currentTab.value == 'EditorPost') {
    document.body.style.cursor = 'grabbing'
    isDragging.value = true
    scaleImageActive.value = false

    mousePosition.value.x = event.clientX
    mousePosition.value.y = event.clientY

    mouseDownPosition.value.x = translatePosition.value.x
    mouseDownPosition.value.y = translatePosition.value.y
  }
}
const mouseMoveImage = (event: MouseEvent) => {
  translatePosition.value.x =
    mouseDownPosition.value.x + (event.clientX - mousePosition.value.x) / 2
  translatePosition.value.y =
    mouseDownPosition.value.y + (event.clientY - mousePosition.value.y) / 2
}
const mouseUpImage = () => {
  const { updateMedia } = useCreatePostStore()
  document.body.style.cursor = 'auto'
  isDragging.value = false

  stick().then(() => {
    drawCanvas()
    const media = {
      ...currentMedia.value,
      translate: { ...translatePosition.value }
    }

    updateMedia({ index: currentMediaIndex.value, newMedia: media as IMedia })
  })
}

const changeRatio = (ratio: string) => {
  currentRatio.value = ratio

  switch (ratio) {
    case 'original':
      if (currentMedia.value!.size.height < currentMedia.value!.size.width) {
        cropperSize.value!.height =
          (containerSize.value!.width * currentMedia.value!.size.height) /
          currentMedia.value!.size.width
        cropperSize.value!.width = containerSize.value!.width
      } else {
        cropperSize.value!.height = containerSize.value!.height
        cropperSize.value!.width = Math.max(
          (containerSize.value!.height * currentMedia.value!.size.width) /
            currentMedia.value!.size.height,
          320
        )
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

  stick()
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

const drawCanvas = () => {
  if (currentMedia.value) {
    const cropperRect = cropperRef.value!.getBoundingClientRect()
    const imageRect = imageRef.value!.getBoundingClientRect()

    const ratioCrop = getRatioCrop(currentMedia.value.image, cropperSize.value, scaleValue.value)

    currentMedia.value.canvas.width = cropperSize.value.width * ratioCrop
    currentMedia.value.canvas.height = cropperSize.value.height * ratioCrop

    const ctx = currentMedia.value.canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, 9999, 9999)
      ctx.setTransform(1, 0, 0, 1, 0, 0)

      ctx.translate(
        (imageRect.x - cropperRect.x) * ratioCrop,
        (imageRect.y - cropperRect.y) * ratioCrop
      )

      ctx.filter = currentMedia.value.filters!.filter
      ctx.drawImage(currentMedia.value.image, 0, 0)

      if (currentMedia.value.filters!.background) {
        ctx.fillStyle = currentMedia.value.filters!.background
        ctx.fillRect(0, 0, 9999, 9999)
      }
    }
  }
}

const handlePrevMedia = () => {
  const { prevMedia } = useCreatePostStore()
  prevMedia()
}
const handleNextMedia = () => {
  const { nextMedia } = useCreatePostStore()
  nextMedia()
}

watch(currentMedia, (newMedia) => {
  scaleValue.value = newMedia!.scale
  translatePosition.value = { ...newMedia!.translate }

  stick()
})

watch(isDragging, () => {
  if (isDragging.value) {
    document.addEventListener('mousemove', mouseMoveImage)
    document.addEventListener('mouseup', mouseUpImage)
  } else {
    document.removeEventListener('mousemove', mouseMoveImage)
    document.removeEventListener('mouseup', mouseUpImage)
  }
})

onMounted(() => {
  const { setContainerSize, setCurrentMedia } = useCreatePostStore()

  setContainerSize({
    width: containerRef.value!.offsetWidth,
    height: containerRef.value!.offsetHeight
  })
  changeRatio(currentRatio.value)
  stick()
  setCurrentMedia(medias.value[0])
})
</script>

<template>
  <div class="flex flex-nowrap w-full h-full">
    <div class="relative w-[400px] h-full select-none">
      <div ref="containerRef" class="w-full h-full flex flex-center bg-[#f5f5f5]">
        <div
          ref="cropperRef"
          class="relative overflow-hidden"
          :style="{
            height: cropperSize.height + 'px',
            width: cropperSize.width + 'px'
          }"
        >
          <div
            ref="imageRef"
            :style="imgStyle"
            class="absolute top-1/2 left-1/2 bg-center bg-no-repeat bg-cover z-[1]"
            @mousedown="mouseDownImage"
          ></div>
          <div
            :style="imgCoverStyle"
            class="absolute top-0 right-0 w-full h-full pointer-events-none z-[1]"
          ></div>
        </div>
        <div>
          <div
            v-if="currentMediaIndex != 0"
            class="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1acc] rounded-full flex flex-center p-2 transition-opacity duration-200 hover:opacity-60 cursor-pointer z-[1] left-2"
            @click="handlePrevMedia"
          >
            <fa :icon="['fas', 'chevron-left']" class="text-base text-white fill-white" />
          </div>
          <div
            v-if="currentMediaIndex != medias.length - 1"
            class="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1acc] rounded-full flex flex-center p-2 transition-opacity duration-200 hover:opacity-60 cursor-pointer z-[1] right-2"
            @click="handleNextMedia"
          >
            <fa :icon="['fas', 'chevron-right']" class="text-base text-white fill-white" />
          </div>
        </div>
        <div
          v-if="medias.length > 1"
          class="absolute flex left-1/2 -translate-x-1/2 bottom-[30px] z-[1]"
        >
          <div
            v-for="media in medias"
            :key="media.url"
            :class="['w-[6px] h-[6px] bg-borderColor-dark has-[active]:bg-bgColor-primary rounded-full mx-[2px] transition-colors duration-200 ease-in-out', { active: media.url == currentMedia!.url }]"
          ></div>
        </div>
        <div
          v-if="isDragging"
          class="absolute top-0 left-0 w-full h-full pointer-events-none z-[1] border border-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
        >
          <div
            class="absolute top-0 left-0 w-full h-full pointer-events-none z-[1] flex flex-wrap flex-col"
          >
            <div
              class="w-[1px] h-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
            <div
              class="w-[1px] h-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
            <div
              class="w-[1px] h-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
          </div>
          <div
            class="absolute top-0 left-0 w-full h-full pointer-events-none z-[1] flex flex-wrap flex-row"
          >
            <div
              class="h-[1px] w-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
            <div
              class="h-[1px] w-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
            <div
              class="h-[1px] w-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
          </div>
        </div>
      </div>
      <div v-if="currentTab == 'EditorPost'" class="absolute left-0 bottom-0 w-full select-none">
        <div class="left">
          <div
            class="absolute left-0 bottom-0 flex flex-col"
            :class="{ active: aspectRatioActive }"
            v-click-outside.short="() => (aspectRatioActive = false)"
          >
            <transition name="fadeUp">
              <div class="ml-4 rounded-lg bg-overlay z-[1]" v-if="aspectRatioActive">
                <div
                  class="original flex items-center pl-4 cursor-pointer opacity-60 has-[active]:opacity-100"
                  :class="{ active: currentRatio == 'original' }"
                  @click="changeRatio('original')"
                >
                  <span class="text-white font-semibold">Gốc</span>
                  <div class="p-3">
                    <ImageIcon class="text-white fill-white align-middle" />
                  </div>
                </div>
                <div class="w-full h-[1px] bg-separator" />
                <div
                  class="ratio-1-1 flex items-center pl-4 cursor-pointer opacity-60 has-[active]:opacity-100"
                  :class="{ active: currentRatio == '1:1' }"
                  @click="changeRatio('1:1')"
                >
                  <span class="text-white font-semibold">1:1</span>
                  <div class="p-3">
                    <Ratio1x1 class="text-white fill-white align-middle" />
                  </div>
                </div>
                <div class="w-full h-[1px] bg-separator" />
                <div
                  class="ratio-4-5 flex items-center pl-4 cursor-pointer opacity-60 has-[active]:opacity-100"
                  :class="{ active: currentRatio == '4:5' }"
                  @click="changeRatio('4:5')"
                >
                  <span class="text-white font-semibold">4:5</span>
                  <div class="p-3">
                    <Ratio4x5 class="text-white fill-white align-middle" />
                  </div>
                </div>
                <div class="w-full h-[1px] bg-separator" />
                <div
                  class="ratio-16-9 flex items-center pl-4 cursor-pointer opacity-60 has-[active]:opacity-100"
                  :class="{ active: currentRatio == '16:9' }"
                  @click="changeRatio('16:9')"
                >
                  <span class="text-white font-semibold">16:9</span>
                  <div class="p-3">
                    <Ratio16x9 class="text-white fill-white align-middle" />
                  </div>
                </div>
              </div>
            </transition>
            <div
              class="w-8 h-8 p-2 m-4 bg-[#1a1a1acc] rounded-full transition-opacity duration-200 cursor-pointer hover:opacity-60 parent-[.active]:bg-white z-[1]"
              @click="aspectRatioActive = !aspectRatioActive"
            >
              <RatioIcon
                class="text-white fill-white parent-[.active]:text-black parent-[.active]:fill-black"
              />
            </div>
          </div>
          <div
            class="scale flex flex-col absolute left-11 bottom-0"
            :class="{ active: scaleImageActive }"
            v-click-outside.short="() => (scaleImageActive = false)"
          >
            <transition name="fadeUp">
              <div
                class="flex items-center h-8 rounded-lg bg-overlay z-[1]"
                v-if="scaleImageActive"
              >
                <div class="flex h-full px-3 py-2 items-center">
                  <input
                    ref="scaleRef"
                    class="scale-input"
                    type="range"
                    min="1"
                    max="2"
                    step="0.01"
                    v-model="scaleValue"
                    @change="handleChangeScale"
                  />
                </div>
              </div>
            </transition>
            <div
              class="w-8 h-8 p-2 m-4 bg-[#1a1a1acc] rounded-full transition-opacity duration-200 cursor-pointer hover:opacity-60 parent-[.active]:bg-white z-[1]"
              @click="scaleImageActive = !scaleImageActive"
            >
              <GlassPlusIcon
                class="text-white fill-white parent-[.active]:text-black parent-[.active]:fill-black"
              />
            </div>
          </div>
        </div>
        <div class="right">
          <div
            class="flex flex-col absolute right-0 bottom-0 items-end"
            :class="{ active: listImageActive }"
            v-click-outside.short="
              () => {
                listImageActive = false
              }
            "
          >
            <!-- <transition name="fadeUp"> -->
            <div class="flex" v-if="listImageActive">
              <ListPost />
            </div>
            <!-- </transition> -->
            <div
              class="w-8 h-8 p-2 m-4 bg-[#1a1a1acc] rounded-full transition-opacity duration-200 cursor-pointer hover:opacity-60 parent-[.active]:bg-white z-[1]"
              @click="listImageActive = !listImageActive"
            >
              <LayerIcon
                class="text-white fill-white parent-[.active]:text-black parent-[.active]:fill-black"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class=""></div>
  </div>
</template>

<style scoped>
.scale-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
}

.scale-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  background: #fff !important;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -8px;
}
.scale-input::-moz-range-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  background: #fff !important;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -8px;
}
.scale-input::-ms-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  background: #fff !important;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -8px;
}

.scale-input::-webkit-slider-runnable-track {
  width: 100%;
  height: 1px;
  margin: 5px 0;
  cursor: pointer;
  color: transparent;
  background: #000;
}
.scale-input::-moz-range-trackk {
  width: 100%;
  height: 1px;
  margin: 5px 0;
  cursor: pointer;
  color: transparent;
  background: #000;
}
.scale-input::-ms-track {
  width: 100%;
  height: 1px;
  margin: 5px 0;
  cursor: pointer;
  color: transparent;
  background: #000;
}
</style>
