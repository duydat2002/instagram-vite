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
  }
})

const classes = computed(() => {
  return [`button--size-${props.size}`, `button--variant-${props.variant}`]
})
</script>

<template>
  <button
    class="relative w-full font-semibold select-none disabled:opacity-60 disabled:pointer-events-none"
    :class="classes"
    :style="{ color, backgroundColor }"
    :type="type"
    :disabled="isDisabled"
  >
    <div v-if="isLoading" class="animate-spin">
      <fa :icon="['fas', 'spinner']" />
    </div>

    <slot v-else :style="{ opacity: isLoading ? 0 : 1 }" />
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
  color: var(--primary-button-color);
  background: transparent;
}
.button--variant-text:hover {
  color: var(--link-color);
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
