<script lang="ts" setup>
import AdjustInput from './AdjustInput.vue'

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { FILTER_TEMPLATES, DEFAULT_FILTER, DEFAULT_ADJUST } from '@/constants'
import type { IAdjust, IMedia } from '@/types'
import { storeToRefs } from 'pinia'
import { useCreatePostStore } from '@/store'
import { getDynamicImage } from '@/helpers'

interface IFilterTemplate {
  name: string
  filter: IAdjust
}

const emit = defineEmits(['drawCanvas'])

const { currentMedia, currentMediaIndex, filter } = storeToRefs(useCreatePostStore())
const filterTab = ref<'Filter' | 'Adjust'>('Filter')
const curentFilterTemplate = ref('Normal')
const filterTemplate = ref<IAdjust>(DEFAULT_FILTER)
const adjust = ref({
  brightness: 0,
  contrast: 0,
  saturate: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  'hue-rotate': 0,
  temperature: 0
})

const adjustOptions = [
  {
    name: 'brightness',
    divid: 200
  },
  {
    name: 'contrast',
    divid: 300
  },
  {
    name: 'saturate',
    divid: 200
  },
  {
    name: 'blur',
    divid: 50,
    unit: 'px'
  },
  {
    name: 'grayscale',
    divid: 100
  },
  {
    name: 'sepia',
    divid: 100
  },
  {
    name: 'hue-rotate',
    divid: 1,
    unit: 'deg'
  }
]

const adjustInputs = computed(() => [
  { title: 'Độ sáng', name: 'brightness' },
  { title: 'Độ tương phản', name: 'contrast' },
  { title: 'Độ bão hòa', name: 'saturate' },
  { title: 'Nhiệt độ', name: 'temperature' },
  { title: 'Độ xám', min: 0, name: 'grayscale' },
  { title: 'Độ nâu đỏ', min: 0, name: 'sepia' },
  { title: 'Độ mờ', min: 0, name: 'blur' }
])

const updateMediaFilter = () => {
  const { updateMedia } = useCreatePostStore()

  const media = {
    ...currentMedia.value,
    filters: filter.value,
    adjust: adjust.value,
    filterTemplate: {
      name: curentFilterTemplate.value,
      filter: filterTemplate.value
    }
  }

  updateMedia({ index: currentMediaIndex.value, data: media as IMedia })
}

const convertToFilter = (adjust: IAdjust) => {
  const { setFilter } = useCreatePostStore()

  //Filter
  const filter = adjustOptions.map((adjustOption) => {
    const adjustName = adjustOption.name as keyof IAdjust
    return `${adjustOption.name}(${
      filterTemplate.value[adjustName]! + adjust[adjustName]! / adjustOption.divid
    }${adjustOption.unit || ''})`
  })

  //Background cover
  //255-200-0-0.1 Cold
  //0-110-255-0.1 Hot
  let backgroundValues = []
  if (adjust.temperature! >= 0) {
    backgroundValues.push(`rgba(255,200,0,${adjust.temperature! / 1000})`)
  } else {
    backgroundValues.push(`rgba(0,110,255,${-adjust.temperature! / 1000})`)
  }

  const filters = {
    background: backgroundValues.join(' '),
    filter: filter.join(' ')
  }

  setFilter(filters)
  updateMediaFilter()
}

const chooseTemplate = (template: IFilterTemplate) => {
  filterTemplate.value = {
    ...DEFAULT_FILTER,
    ...template.filter
  }
  curentFilterTemplate.value = template.name
  convertToFilter(adjust.value)
  emit('drawCanvas')
}

const handleChangeAdjust = () => {
  emit('drawCanvas')
}

watch(
  adjust,
  (newAdjust) => {
    convertToFilter(newAdjust)
  },
  { deep: true }
)

watch(currentMedia, (newMedia) => {
  curentFilterTemplate.value = newMedia?.filterTemplate?.name || 'Normal'

  filterTemplate.value = {
    ...DEFAULT_FILTER,
    ...newMedia?.filterTemplate?.filter
  }
  adjust.value = { ...DEFAULT_ADJUST, ...newMedia!.adjust }
})

onMounted(() => {
  curentFilterTemplate.value = currentMedia.value!.filterTemplate!.name
  filterTemplate.value = {
    ...DEFAULT_FILTER,
    ...currentMedia.value!.filterTemplate!.filter
  }
  adjust.value = { ...DEFAULT_ADJUST, ...currentMedia.value!.adjust }
})
</script>

<template>
  <div class="w-[340px] h-full overflow-y-scroll">
    <div class="flex">
      <div
        class="h-10 flex flex-center flex-1 text-link border-b border-textColor-primary opacity-30 has-[active]:opacity-100 has-[active]:font-semibold cursor-pointer transition-all duration-[0.25s] ease-in-out"
        :class="{ active: filterTab == 'Filter' }"
        @click="filterTab = 'Filter'"
      >
        Bộ Lọc
      </div>
      <div
        class="h-10 flex flex-center flex-1 text-link border-b border-textColor-primary opacity-30 has-[active]:opacity-100 has-[active]:font-semibold cursor-pointer transition-all duration-[0.25s] ease-in-out"
        :class="{ active: filterTab == 'Adjust' }"
        @click="filterTab = 'Adjust'"
      >
        Điều Chỉnh
      </div>
    </div>
    <div class="mx-2">
      <div v-if="filterTab == 'Filter'" class="flex flex-wrap mb-3">
        <div v-for="filterTemplate in FILTER_TEMPLATES" :key="filterTemplate.name" class="w-4/12">
          <div
            class="filter-item flex flex-col flex-center mt-4 mx-2 cursor-pointer"
            :class="{ active: curentFilterTemplate == filterTemplate.name }"
            @click="chooseTemplate(filterTemplate)"
          >
            <div
              class="mb-2 rounded border border-transparent overflow-hidden parent-[.filter-item.active]:border-buttonColor-primary"
            >
              <img
                :src="getDynamicImage(`Filter${filterTemplate.name}.jpg`)"
                :alt="`Filter ${filterTemplate.name}`"
              />
            </div>
            <span
              class="text-xs text-textColor-secondary parent-[.filter-item.active]:text-buttonColor-primary parent-[.filter-item.active]:font-semibold"
              >{{ filterTemplate.name }}</span
            >
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col mb-4 mx-2">
        <AdjustInput
          v-for="input in adjustInputs"
          :key="input.title"
          :title="input.name"
          :min="input.min"
          v-model:value="adjust[input.name as keyof IAdjust]"
          @change="handleChangeAdjust"
        />
      </div>
    </div>
  </div>
</template>
