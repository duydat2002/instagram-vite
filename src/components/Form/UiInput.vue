<script lang="ts" setup>
import { type PropType, ref, computed } from 'vue'

const props = defineProps({
  type: {
    type: String as PropType<'text' | 'password' | 'email' | 'number' | 'file'>,
    default: 'text',
    validator: (value: string) => {
      return ['text', 'password', 'email', 'number', 'file'].includes(value)
    }
  },
  id: String,
  name: {
    type: String,
    required: true
  },
  propValue: [String, Number],
  placeholder: String,
  checkValue: {
    type: Boolean as PropType<boolean | string | null>,
    default: null
  }
})

const inputType = ref(props.type)
const showPassword = ref(false)
const isFocus = ref(false)

const emit = defineEmits(['update:propValue'])
const inputValue = computed({
  get: () => props.propValue,
  set: (value) => {
    emit('update:propValue', value)
  }
})

const togglePasswordVisibility = () => {
  inputType.value = showPassword.value ? 'password' : 'text'
  showPassword.value = !showPassword.value
}

const focusInput = () => {
  isFocus.value = true
}

const blurInput = () => {
  isFocus.value = false
}
</script>

<template>
  <div
    class="flex items-center relative w-full h-9 rounded-[3px] bg-bgColor-secondary box-content border border-borderColor has-[focus]::border-borderColor-dark"
    :class="[{ 'active-label': inputValue != '' }, { focus: isFocus }]"
  >
    <div class="flex-auto">
      <input
        class="input w-full p-2 text-base leading-5 truncate bg-bgColor-secondary transition-[padding] duration-100 ease-out"
        :id="id"
        :type="inputType"
        :name="name"
        v-model="inputValue"
        @focus="focusInput"
        @blur="blurInput"
      />
      <span
        class="placeholder absolute ml-2 left-0 right-0 top-1/2 -translate-y-1/2 origin-top-left text-xs truncate text-left text-textColor-secondary transition-transform duration-100 ease-out pointer-events-none"
        >{{ placeholder }}</span
      >
    </div>
    <div v-if="checkValue != null && inputValue != ''" class="parent-[.focus]:hidden mr-2">
      <fa v-if="checkValue" :icon="['far', 'circle-check']" style="color: #b4b4b4; height: 22px" />
      <fa v-else :icon="['far', 'circle-xmark']" style="color: #ee2d3e; height: 22px" />
    </div>
    <div
      v-if="type == 'password' && inputValue != ''"
      class="mr-2 text-sm leading-[18px] font-semibold text-[#262626] select-none cursor-pointer hover:opacity-50"
      @click="togglePasswordVisibility"
    >
      <span>{{ showPassword ? 'Ẩn' : 'Hiển thị' }}</span>
    </div>
  </div>
</template>

<style scoped>
.active-label .input {
  font-size: 12px;
  padding: 14px 8px 2px;
}

.active-label .placeholder {
  transform: translateY(-100%) scale(calc(10 / 12));
}
</style>
