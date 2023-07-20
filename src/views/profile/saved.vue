<script lang="ts" setup>
import UiButton from '@/components/Form/UiButton.vue'
</script>

<template>
  <div class="flex flex-col flex-center">
    <div class="flex items-center justify-between w-full mt-8 mb-4">
      <span class="">Chỉ mình bạn có thể xem mục mình đã lưu</span>
      <UiButton variant="text">+ Bộ sưu tập mới</UiButton>
    </div>
    <div
      class="relative flex flex-col w-[300px] h-[300px] bg-[linear-gradient(to_top,rgba(38,38,38,.6),rgba(255,255,255,0))] cursor-pointer"
    >
      <div class="flex w-full">
        <div class="w-1/2">
          <img src="@/assets/images/defaultAvatar.jpg" alt="" />
        </div>
        <div class="w-1/2">
          <img src="@/assets/images/defaultAvatar.jpg" alt="" />
        </div>
      </div>
      <div class="flex w-full">
        <div class="w-1/2">
          <img class="w-full h-full" src="@/assets/images/FilterNormal.jpg" alt="" />
        </div>
        <div class="w-1/2">
          <img class="w-full h-full" src="@/assets/images/FilterNormal.jpg" alt="" />
        </div>
      </div>
      <span class="absolute bottom-0 left-0 right-0 px-5 py-4 text-xl text-white text-center"
        >Tất cả bài viết</span
      >
    </div>
  </div>
</template>
