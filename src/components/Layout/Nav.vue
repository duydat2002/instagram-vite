<script lang="ts" setup>
import LogoText from '@icons/logo-text.svg'

import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useNavStore } from '@/store'
import { NAVS, NavTabEnum } from '@/constants'

const { currentNav } = storeToRefs(useNavStore())

const changeTab = (event: Event, nav: NavTabEnum, noRedirect: boolean) => {
  currentNav.value = nav
}
</script>

<template>
  <div
    class="fixed top-0 bottom-auto left-0 h-screen border-t border-borderColor w-full min-[1264px]:w-nav-medium min-[768px]:w-nav-narrow max-[768px]:h-12 min-[768px]:border-r max-[768px]:top-auto max-[768px]:bottom-0"
  >
    <div class="flex flex-col h-full py-5 px-3">
      <RouterLink to="/" class="py-5 px-3 mb-[10px]">
        <LogoText class="w-[103px]" />
      </RouterLink>
      <div class="flex flex-col">
        <RouterLink
          v-for="nav in NAVS"
          :key="nav.tab"
          :to="nav.path"
          class="nav-item flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-hover"
          :class="{ active: currentNav == nav.tab }"
          @click="changeTab($event, nav.tab, !!nav.noRedirect)"
        >
          <component :is="currentNav == nav.tab ? nav.iconActive : nav.icon" class="w-6" />
          <span class="nav-title pl-4 text-base text-textColor-primary">{{ nav.title }}</span>
        </RouterLink>
        <RouterLink
          to="/123"
          class="nav-item flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-hover"
          :class="{ active: currentNav == NavTabEnum.Profile }"
          @click="changeTab($event, NavTabEnum.Profile, false)"
        >
          <div class="w-6">cac</div>
          <span class="nav-title pl-4 text-base text-textColor-primary">Trang cá nhân</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-item.active .nav-title {
  font-weight: 700;
}
</style>
