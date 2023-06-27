<script lang="ts" setup>
import Login from '@/components/Pages/Auth/Login.vue'

import { ref, onMounted, onBeforeUnmount } from 'vue'

const index = ref(1)

let interval: NodeJS.Timer

onMounted(() => {
  interval = setInterval(() => {
    if (index.value >= 4) index.value = 1
    else index.value++
  }, 5000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="w-full my-8 max-[450px]:my-0">
    <div class="flex justify-center items-center">
      <div class="home-phone min-[876px]:flex hidden mr-8 mb-3">
        <div class="relative w-full mt-[27px] mr-[21px]">
          <img
            class="screenshot absolute top-0 right-0 opacity-0"
            :class="{ active: index == 1 }"
            src="@/assets/images/screenshot1.png"
            alt="Screenshot 1"
          />
          <img
            class="screenshot absolute top-0 right-0 opacity-0"
            :class="{ active: index == 2 }"
            src="@/assets/images/screenshot2.png"
            alt="Screenshot 2"
          />
          <img
            class="screenshot absolute top-0 right-0 opacity-0"
            :class="{ active: index == 3 }"
            src="@/assets/images/screenshot3.png"
            alt="Screenshot 3"
          />
          <img
            class="screenshot absolute top-0 right-0 opacity-0"
            :class="{ active: index == 4 }"
            src="@/assets/images/screenshot4.png"
            alt="Screenshot 4"
          />
        </div>
      </div>
      <Login />
    </div>
  </div>
</template>

<style scoped>
.home-phone {
  height: 581.141px;
  width: 380.312px;
  background-image: url('@/assets/images/home-phones.png');
  background-size: 469.32px 629.15px;
  background-position-x: -50px;
}

.screenshot {
  transition: opacity 1.5s ease-out;
}

.screenshot.active {
  opacity: 1;
}
</style>
