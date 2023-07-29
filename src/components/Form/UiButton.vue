<script lang="ts" setup>
import { type PropType, computed } from 'vue'

const props = defineProps({
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
    validator: (value: string) => {
      return ['button', 'submit', 'reset'].includes(value)
    }
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String as PropType<'text' | 'contained' | 'outlined'>,
    default: 'contained',
    validator(value: string) {
      return ['text', 'contained', 'outlined'].includes(value)
    }
  },
  color: {
    type: String
  },
  backgroundColor: {
    type: String
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium',
    validator: (value: string) => {
      return ['small', 'medium', 'large'].includes(value)
    }
  },
  classProps: {
    type: String as PropType<string[] | string>
  }
})

const classes = computed(() => {
  return [`button--size-${props.size}`, `button--variant-${props.variant}`]
})
</script>

<template>
  <button
    class="relative font-semibold select-none disabled:opacity-60 disabled:pointer-events-none"
    :class="[classes, classProps]"
    :style="{ color, backgroundColor }"
    :type="type"
    :disabled="isDisabled"
  >
    <div v-if="isLoading" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <fa class="animate-spin" :icon="['fas', 'spinner']" />
    </div>

    <div :class="{ 'opacity-0': isLoading }">
      <slot />
    </div>
  </button>
</template>

<style scoped>
button[primary] {
  color: #fff;
  background: var(--primary-button-color);
}

button[primary]:hover {
  background: var(--primary-button-hover-color);
}

button[secondary] {
  color: #000;
  background: var(--secondary-button-color);
}

button[secondary]:hover {
  background: var(--secondary-button-hover-color);
}

.button--variant-text {
  font-weight: 600;
  background: transparent !important;
}
.button--variant-text:hover {
}

.button--variant-text[primary] {
  color: var(--primary-button-color);
}
.button--variant-text[primary]:hover {
  color: var(--primary-button-hover-color);
}

.button--variant-text[secondary] {
  color: #000;
}
.button--variant-text[secondary]:hover {
  opacity: 0.6;
}

.button--variant-contained {
}
.button--variant-contained:hover {
}

.button--variant-outlined {
}

.button--size-small {
  font-size: 13px;
  line-height: 17px;
  padding: 4px 10px;
  border-radius: 6px;
}
.button--size-medium {
  font-size: 14px;
  line-height: 18px;
  padding: 7px 16px;
  border-radius: 8px;
}
.button--size-large {
  font-size: 15px;
  line-height: 19px;
  padding: 8px 22px;
  border-radius: 10px;
}
</style>
