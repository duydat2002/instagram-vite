<script lang="ts" setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { FOOTER_LINKS, LANGUEGES } from '@/constants'

const footerLinks = computed(() => FOOTER_LINKS)
const languages = computed(() => LANGUEGES)

const currentLanguage = ref({ value: 'vi', name: 'Tiếng Việt' })
</script>

<template>
  <footer class="flex flex-col flex-center mt-6 mb-[52px] px-4">
    <div class="flex flex-wrap justify-center">
      <div v-for="link in footerLinks" :key="link.name" class="mx-2 mb-1">
        <RouterLink
          :to="link.path"
          class="text-xs leading-3 text-textColor-secondary cursor-pointer hover:underline decoration-link"
          >{{ link.name }}</RouterLink
        >
      </div>
    </div>
    <div class="flex flex-center mt-2">
      <div class="relative mx-2">
        <span class="text-xs leading-3 text-textColor-secondary cursor-pointer"
          >{{ currentLanguage.name }} <fa :icon="['fas', 'chevron-down']"
        /></span>
        <select
          v-model="currentLanguage"
          class="absolute top-0 left-0 right-0 opacity-0 cursor-pointer"
        >
          <option
            v-for="language in languages"
            :key="language.value"
            :value="language"
            class="text-xs text-textColor-secondary pl-2"
          >
            {{ language.name }}
          </option>
        </select>
      </div>
      <div class="mx-2 text-xs leading-3 text-textColor-secondary">
        © 2023 Instagram from DuyDat
      </div>
    </div>
  </footer>
</template>
