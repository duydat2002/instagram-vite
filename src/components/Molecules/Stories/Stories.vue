<script lang="ts" setup>
import 'swiper/css'
import PlusIcon from '@icons/plus.svg'
import StoryItem from '@/components/Molecules/Stories/StoryItem.vue'

import { computed } from 'vue'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

const props = withDefaults(
  defineProps<{
    imageSize?: string
    options?: any
    hasAddStory?: boolean
  }>(),
  {
    hasAddStory: false,
    options: {
      modules: [Navigation],
      slidesPerView: 7,
      slidesPerGroup: 4,
      spaceBetween: 12,
      allowTouchMove: true,
      navigation: {
        nextEl: '.navigation-next',
        prevEl: '.navigation-prev',
        disabledClass: 'disabled'
      }
    }
  }
)

const addSizeComp = computed(() => {
  let widthCom = props.imageSize
  if (!!props.imageSize && !isNaN(Number(props.imageSize))) widthCom = widthCom + 'px'
  return widthCom
})

const addStory = () => {
  console.log('object')
}
</script>

<template>
  <div class="mx-6">
    <div class="relative w-full">
      <Swiper v-bind="options">
        <SwiperSlide v-for="n in 10" :key="n">
          <StoryItem :n="n" :avatarSize="imageSize" />
        </SwiperSlide>
        <SwiperSlide v-if="hasAddStory">
          <div class="flex flex-col flex-center cursor-pointer" @click="addStory">
            <div class="border border-separate rounded-full">
              <div
                class="m-[2px] flex flex-center bg-bgColor-secondary rounded-full"
                :style="{ width: addSizeComp, height: addSizeComp }"
              >
                <PlusIcon />
              </div>
            </div>
            <span class="mt-[12px] text-xs font-semibold">Mới</span>
          </div>
        </SwiperSlide>
      </Swiper>
      <div class="hidden min-[736px]:block">
        <div
          class="absolute px-2 py-4 top-1/2 left-0 -translate-y-1/2 opacity-60 cursor-pointer z-10 has-[disabled]:hidden navigation-prev"
        >
          <fa :icon="['fas', 'circle-chevron-left']" class="text-2xl" />
        </div>
        <div
          class="absolute px-2 py-4 top-1/2 right-0 -translate-y-1/2 opacity-60 cursor-pointer z-10 has-[disabled]:hidden navigation-next"
        >
          <fa :icon="['fas', 'circle-chevron-right']" class="text-2xl" />
        </div>
      </div>
    </div>
  </div>
</template>
