<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  width: [String, Number],
  hasStory: {
    type: Boolean,
    default: false
  },
  avatarUrl: {
    type: String,
    required: false
  }
})

const sizeAvatar = computed(() => {
  let widthCom = props.width
  // if (!props.hasStory) {
  //   widthCom = Number(widthCom) + 4
  // }
  return {
    width: widthCom + 'px',
    height: widthCom + 'px'
  }
})
</script>

<template>
  <div class="container" :class="{ hasStory }" :style="sizeAvatar">
    <div class="wrapper">
      <img src="@/assets/images/defaultAvatar.jpg" alt="" />
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

.wrapper {
  width: 100%;
  height: 100%;
  border: 2.5px solid var(--primary-bg-color);
  border-radius: 50%;
  overflow: hidden;
}
</style>
