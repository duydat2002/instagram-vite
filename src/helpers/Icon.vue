<script lang="ts" setup>
import { type PropType, defineAsyncComponent, computed } from 'vue'

const props = defineProps<{
  name: string
}>()

const iconComponent = computed(() => {
  return defineAsyncComponent(() => import(`../assets/icons/${props.name}.svg`))
})
</script>

<template>
  <component :is="iconComponent" />
</template>
