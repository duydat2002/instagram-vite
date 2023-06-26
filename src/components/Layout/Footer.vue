<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

interface ILanguage {
  value: string
  name: string
}

const footerLinks = ref([
  { path: '/', name: 'Meta' },
  { path: '/', name: 'Giới thiệu' },
  { path: '/', name: 'Blog' },
  { path: '/', name: 'Việc làm' },
  { path: '/', name: 'Trợ giúp' },
  { path: '/', name: 'API' },
  { path: '/', name: 'Quyền riêng tư' },
  { path: '/', name: 'Điều khoản' },
  { path: '/', name: 'Tài khoản liên quan nhất' },
  { path: '/', name: 'Vị trí' },
  { path: '/', name: 'Instagram Lite' },
  { path: '/', name: 'Tải thông tin người liên hệ lên & người không phải người dùng' },
  { path: '/', name: 'Meta đã xác minh' }
])

const languages = ref<ILanguage[]>([
  { value: 'af', name: 'Afrikaans' },
  { value: 'cs', name: 'Čeština' },
  { value: 'da', name: 'Dansk' },
  { value: 'de', name: 'Deutsch' },
  { value: 'el', name: 'Ελληνικά' },
  { value: 'en', name: 'English' },
  { value: 'en-gb', name: 'English (UK)' },
  { value: 'es', name: 'Español (España)' },
  { value: 'es-la', name: 'Español' },
  { value: 'fi', name: 'Suomi' },
  { value: 'fr', name: 'Français' },
  { value: 'id', name: 'Bahasa Indonesia' },
  { value: 'it', name: 'Italiano' },
  { value: 'ja', name: '日本語' },
  { value: 'ko', name: '한국어' },
  { value: 'ms', name: 'Bahasa Melayu' },
  { value: 'nb', name: 'Norsk' },
  { value: 'nl', name: 'Nederlands' },
  { value: 'pl', name: 'Polski' },
  { value: 'pt-br', name: 'Português (Brasil)' },
  { value: 'pt', name: 'Português (Portugal)' },
  { value: 'ru', name: 'Русский' },
  { value: 'sv', name: 'Svenska' },
  { value: 'th', name: 'ภาษาไทย' },
  { value: 'tl', name: 'Filipino' },
  { value: 'tr', name: 'Türkçe' },
  { value: 'zh-cn', name: '中文(简体)' },
  { value: 'zh-tw', name: '中文(台灣)' },
  { value: 'bn', name: 'বাংলা' },
  { value: 'gu', name: 'ગુજરાતી' },
  { value: 'hi', name: 'हिन्दी' },
  { value: 'hr', name: 'Hrvatski' },
  { value: 'hu', name: 'Magyar' },
  { value: 'kn', name: 'ಕನ್ನಡ' },
  { value: 'ml', name: 'മലയാളം' },
  { value: 'mr', name: 'मराठी' },
  { value: 'ne', name: 'नेपाली' },
  { value: 'pa', name: 'ਪੰਜਾਬੀ' },
  { value: 'si', name: 'සිංහල' },
  { value: 'sk', name: 'Slovenčina' },
  { value: 'ta', name: 'தமிழ்' },
  { value: 'te', name: 'తెలుగు' },
  { value: 'vi', name: 'Tiếng Việt' },
  { value: 'zh-hk', name: '中文(香港)' },
  { value: 'bg', name: 'Български' },
  { value: 'fr-ca', name: 'Français (Canada)' },
  { value: 'ro', name: 'Română' },
  { value: 'sr', name: 'Српски' },
  { value: 'uk', name: 'Українська' }
])

const currentLanguage = ref<ILanguage>({ value: 'vi', name: 'Tiếng Việt' })
</script>

<template>
  <footer class="flex flex-col items-center justify-center mt-6 mb-[52px] px-4">
    <div class="flex flex-wrap justify-center">
      <div v-for="link in footerLinks" :key="link.name" class="mx-2 mb-1">
        <RouterLink
          :to="link.path"
          class="text-xs leading-3 text-textColor-secondary cursor-pointer hover:underline decoration-link"
          >{{ link.name }}</RouterLink
        >
      </div>
    </div>
    <div class="flex items-center mt-2">
      <div class="relative mx-2">
        <span class="text-xs leading-3 text-textColor-secondary cursor-pointer"
          >{{ currentLanguage.name }} <fa :icon="['fas', 'chevron-down']"
        /></span>
        <select v-model="currentLanguage" class="absolute top-0 left-0 right-0 opacity-0">
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
      <div class="mx-2 text-xs leading-3 text-textColor-secondary">© 2023 Instagram from Meta</div>
    </div>
  </footer>
</template>
