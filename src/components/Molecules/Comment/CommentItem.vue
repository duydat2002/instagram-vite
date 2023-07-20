<script lang="ts" setup>
import EllipsisIcon from '@icons/ellipsis.svg'
import LikeIcon from '@icons/heart.svg'
import LikeActiveIcon from '@icons/heart-active.svg'
import Avatar from '@/components/Atom/Avatar.vue'

withDefaults(
  defineProps<{
    isCaption?: boolean
  }>(),
  {
    isCaption: false
  }
)
</script>

<template>
  <div class="flex group/comment mb-4 mt-2">
    <div class="">
      <Avatar width="32" />
    </div>
    <div class="flex flex-col ml-3 mt-[2px]">
      <div class="">
        <RouterLink :to="{ name: 'Profile', params: { username: '123' } }">
          <span class="font-semibold mr-1">duydat</span>
        </RouterLink>
        <span class="leading-tight"
          >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas, eius?</span
        >
      </div>
      <div class="flex flex-wrap items-center mt-1 text-xs text-textColor-secondary">
        <span class="mr-3 cursor-pointer" title="Tháng 6 10, 2023">2 tuần</span>
        <template v-if="!isCaption">
          <span class="font-semibold mr-3 cursor-pointer">1 lượt thích</span>
          <span class="font-semibold mr-5 cursor-pointer">Trả lời</span>
          <div class="relative w-4 h-4 hidden group-hover/comment:block cursor-pointer">
            <EllipsisIcon
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-textColor-secondary fill-textColor-secondary"
            />
          </div>
        </template>
      </div>
    </div>
    <div v-if="!isCaption" class="mt-3 ml-1">
      <LikeIcon v-if="true" class="w-3 hover:opacity-60 cursor-pointer" />
      <LikeActiveIcon v-else class="w-3 hover:opacity-60 cursor-pointer" />
    </div>
  </div>
</template>
