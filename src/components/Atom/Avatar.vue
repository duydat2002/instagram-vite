<script lang="ts" setup>
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    width?: string
    hasStory?: boolean
    avatarUrl?: string
    borderColor?: string
  }>(),
  {
    width: '38px',
    hasStory: false,
    borderColor: 'border-bgColor-primary'
  }
)

const loading = ref(true)

const hanldeLoad = () => {
  loading.value = false
}

const sizeAvatar = computed(() => {
  let widthCom = props.width
  if (!!props.width && !isNaN(Number(props.width))) widthCom = widthCom + 'px'
  return {
    width: `calc(${widthCom} + 8px)`,
    height: `calc(${widthCom} + 8px)`
  }
})
</script>

<template>
  <div class="container" :class="{ hasStory }" :style="sizeAvatar">
    <div class="w-full h-full border-[2.5px] rounded-full overflow-hidden" :class="borderColor">
      <div v-if="loading" class="w-full h-full skeleton"></div>
      <img v-if="avatarUrl != ''" v-show="!loading" :src="avatarUrl" alt="" @load="hanldeLoad" />
      <img
        v-else
        v-show="!loading"
        src="@/assets/images/defaultAvatar.jpg"
        alt=""
        @load="hanldeLoad"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 2px;
  background: transparent;
  border-radius: 50%;
  overflow: hidden;
}

.container.hasStory {
  background: radial-gradient(
    circle at 30% 107%,
    #fdf497 0,
    #fdf497 5%,
    #fd5949 45%,
    #d6249f 60%,
    #285aeb 90%
  );
}
</style>
