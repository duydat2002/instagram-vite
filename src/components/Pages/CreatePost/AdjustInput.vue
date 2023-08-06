<script lang="ts" setup>
import { computed } from 'vue'

const emit = defineEmits(['update:value'])

const props = withDefaults(
  defineProps<{
    value: number
    title: string
    min?: number
    max?: number
  }>(),
  {
    min: -100,
    max: 100
  }
)

const inputValue = computed({
  get() {
    return props.value
  },
  set(value: any) {
    emit('update:value', parseFloat(value))
  }
})

const inputStyle = computed(() => {
  if (props.min < 0) {
    if (inputValue.value > 0) {
      return {
        backgroundImage: `linear-gradient(to right, var(--track-color) 0%, var(--track-color) 50%, var(--active-track-color) 50%, var(--active-track-color) ${
          50 + inputValue.value / 2
        }%, var(--track-color) ${50 + inputValue.value / 2}%, var(--track-color) 100%)`
      }
    } else {
      return {
        backgroundImage: `linear-gradient(to right, var(--track-color) 0%, var(--track-color) ${
          50 + inputValue.value / 2
        }%, var(--active-track-color) ${
          50 + inputValue.value / 2
        }%, var(--active-track-color) 50%, var(--track-color) 50%, var(--track-color) 100%)`
      }
    }
  } else {
    return {
      backgroundImage: `linear-gradient(to right, var(--active-track-color) 0%, var(--active-track-color) ${inputValue.value}%, var(--track-color) ${inputValue.value}%, var(--track-color) 100%)`
    }
  }
})

const handleReset = () => {
  emit('update:value', 0)
}
</script>

<template>
  <div class="group/adjust-item">
    <div class="flex py-[14px] justify-between capitalize">
      <span class="cursor-pointer">{{ title }}</span>
      <span
        v-if="inputValue != 0"
        class="font-semibold text-buttonColor-primary cursor-pointer hidden group-hover/adjust-item:block"
        @click="handleReset"
        >Đặt lại</span
      >
    </div>
    <div class="flex flex-center cursor-pointer">
      <input
        class="input flex-grow h-[2px] bg-separator-modal"
        :style="inputStyle"
        type="range"
        :min="min"
        :max="max"
        step="1"
        v-model="inputValue"
      />
      <span class="text-xs w-6 ml-2 text-right">{{ inputValue }}</span>
    </div>
  </div>
</template>

<style computed>
.input {
  appearance: none;
}

.input::-webkit-slider-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  background: var(--thumb-color) !important;
  border-radius: 50%;
  cursor: pointer;
}
.input::-moz-range-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  background: var(--thumb-color) !important;
  border-radius: 50%;
  cursor: pointer;
}
.input::-ms-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  background: var(--thumb-color) !important;
  border-radius: 50%;
  cursor: pointer;
}
</style>
