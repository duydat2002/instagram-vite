<script lang="ts" setup>
import { ref, computed } from 'vue'

const props = defineProps({
  width: [String, Number],
  hasStory: {
    type: Boolean,
    default: false
  },
  avatarUrl: {
    type: String,
    // default:
    //   'https://firebasestorage.googleapis.com/v0/b/instagram-f9ac5.appspot.com/o/defaultAvatar.jpg?alt=media&token=61fbdaa8-a6ed-419c-97e4-a95d2165ae64',
    required: false
  }
})

const loading = ref(true)

const hanldeLoad = () => {
  loading.value = false
}

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
    <div
      class="w-full h-full border-[2.5px] border-solid border-bgColor-primary rounded-full overflow-hidden"
    >
      <div v-if="loading" class="w-full h-full skeleton"></div>
      <img v-show="!loading" :src="avatarUrl" alt="" @load="hanldeLoad" />
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
