<script lang="ts" setup>
import draggable from 'vuedraggable'
import { reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreatePostStore, useModalStore } from '@/store'
import { useSlider } from '@/composables/useSlider'
import type { IMedia } from '@/types'

const { initSlider, reset } = useSlider()

const dragOptions = reactive({
  animation: 200,

  ghostClass: 'ghost', // Class name for the drop placeholder
  chosenClass: 'chosen', // Class name for the chosen item
  dragClass: 'drag' // Class name for the dragging item
})
const { medias, currentMedia } = storeToRefs(useCreatePostStore())

const hanldeSetCurrentMedia = (media: IMedia) => {
  const { setCurrentMedia } = useCreatePostStore()
  setCurrentMedia(media)
}

const getInputFiles = (event: Event) => {
  const { addMedias } = useCreatePostStore()

  const files = (event.target as HTMLInputElement).files

  addMedias(files!).then(() => {
    reset()
    ;(event.target as HTMLInputElement).value = ''
  })
}

const handleDeleteMedia = () => {
  const { setRemoveMediaPopupShow, setRemovePostPopupShow } = useModalStore()

  if (medias.value.length > 1) setRemoveMediaPopupShow(true)
  else setRemovePostPopupShow(true)
}

onMounted(() => {
  initSlider('.list-post-container', {
    step: 2,
    navigation: {
      prevEl: '.navigation-prev',
      nextEl: '.navigation-next'
    }
  })
})
</script>

<template>
  <div
    class="list-post-container h-[118px] w-full max-w-[374px] p-2 mx-4 bg-overlay rounded-lg flex items-center justify-end flex-nowrap z-[1]"
  >
    <div class="slider-wrapper relative flex flex-grow mr-3 overflow-hidden">
      <draggable
        class="slider-list flex items-center transition-all duration-200"
        v-model="medias"
        v-bind="dragOptions"
        item-key="url"
      >
        <template #item="{ element: media }">
          <div
            class="slider-item relative px-[6px] cursor-pointer has-[ghost]:opacity-0"
            :class="{ active: currentMedia!.url == media.url }"
            @mousedown="hanldeSetCurrentMedia(media)"
          >
            <div
              class="w-[94px] h-[94px] bg-center bg-no-repeat bg-cover"
              :style="{ backgroundImage: `url(${media.url})` }"
            ></div>
            <div
              class="absolute top-[5px] right-[10px] w-5 h-5 bg-overlay rounded-full hidden parent-[.slider-item.active]:flex flex-center cursor-pointer transition-all duration-200 hover:opacity-60"
              @click="handleDeleteMedia"
            >
              <fa size="sm" style="color: #fff" :icon="['fas', 'xmark']" />
            </div>
          </div>
        </template>
      </draggable>
      <div class="navigation">
        <div
          class="navigation-prev left-0 absolute has-[slider-button-disable]:hidden top-1/2 -translate-y-1/2 cursor-pointer z-[1]"
        >
          <fa :icon="['fas', 'circle-chevron-left']" class="text-2xl text-white fill-white" />
        </div>
        <div
          class="navigation-next right-0 absolute has-[slider-button-disable]:hidden top-1/2 -translate-y-1/2 cursor-pointer z-[1]"
        >
          <fa :icon="['fas', 'circle-chevron-right']" class="text-2xl text-white fill-white" />
        </div>
      </div>
    </div>
    <div
      class="relative w-12 h-12 flex flex-center flex-shrink-0 border border-separator rounded-full cursor-pointer"
    >
      <fa size="xl" style="color: #fff" :icon="['fas', 'plus']" />
      <input
        ref="inputFiles"
        accept="image/*, video/*"
        type="file"
        class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        multiple
        @change="getInputFiles($event)"
      />
    </div>
  </div>
</template>
