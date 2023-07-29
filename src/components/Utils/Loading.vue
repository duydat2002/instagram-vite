<script lang="ts" setup>
import LoadingIcon from '@icons/loading.svg'

withDefaults(
  defineProps<{
    width?: string
  }>(),
  {
    width: '32px'
  }
)
</script>

<template>
  <div class="flex flex-center">
    <div class="animate-spin">
      <LoadingIcon :style="{ width: width, height: width }" />
    </div>
  </div>
</template>
