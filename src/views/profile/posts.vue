<script lang="ts" setup>
import UiButton from '@/components/Form/UiButton.vue'
</script>

<template>
  <div class="flex flex-center">
    <div class="w-full max-w-[350px] mx-11 my-[60px] flex flex-col flex-center">
      <img src="@/assets/images/CameraCircle.png" />
      <span class="my-6 text-3xl font-extrabold">Chia sẻ ảnh</span>
      <span class="mb-6 text-center"
        >Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn.</span
      >
      <UiButton variant="text">Chia sẻ ảnh đầu tiên của bạn</UiButton>
    </div>
  </div>
</template>
