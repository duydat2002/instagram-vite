<script lang="ts" setup>
import LogoText from '@icons/logo-text.svg'
import Logo from '@icons/logo.svg'
import Bar from '@icons/bar.svg'
import BarActive from '@icons/bar-active.svg'
import SearchPanel from './NavPanel/SearchPanel.vue'
import NotifyPanel from './NavPanel/NotifyPanel.vue'
import NavItem from './NavItem.vue'

import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore, useNavStore, useResizeStore } from '@/store'
import { NAVS, NAVS_MOBILE, NavTabEnum, type Nav } from '@/constants'

const { currentUser } = storeToRefs(useUserStore())
const { currentNav } = storeToRefs(useNavStore())
const { screen } = storeToRefs(useResizeStore())
const route = useRoute()

const searchPanelActive = ref(false)
const notifyPanelActive = ref(false)
const barPanelActive = ref(false)

const changeTab = (nav: NavTabEnum) => {
  searchPanelActive.value = nav == NavTabEnum.Search ? true : false
  notifyPanelActive.value = nav == NavTabEnum.Notification ? true : false
  barPanelActive.value = nav == NavTabEnum.Bar ? true : false
  currentNav.value = nav
}

const handleCloseSearchPanel = () => {
  searchPanelActive.value = false
  currentNav.value = route.matched[0].name as NavTabEnum
}

const handleNotifyClickOutside = () => {
  notifyPanelActive.value = false
  currentNav.value = route.matched[0].name as NavTabEnum
}

const navCom = computed(() => {
  if (screen.value == 'mobile') return NAVS_MOBILE
  else return NAVS
})

const isNarrowCom = computed(() => {
  if (screen.value == 'mobile') return false
  return searchPanelActive.value || notifyPanelActive.value || screen.value == 'tablet'
    ? true
    : false
})

const tabBarCom = computed(() => {
  return {
    name: NavTabEnum.Bar,
    title: 'Xem thêm',
    icon: Bar,
    iconActive: BarActive
  } as Nav
})

watch(route, (to) => {
  currentNav.value = to.matched[0].name as NavTabEnum
})

onMounted(() => {
  currentNav.value = route.matched[0].name as NavTabEnum
})
</script>

<template>
  <div
    class="fixed top-auto min-[768px]:top-0 bottom-0 min-[768px]:bottom-auto left-0 h-12 min-[768px]:h-screen w-full min-[1264px]:w-nav-medium min-[768px]:w-nav-narrow has-[isNarrow]:w-nav-narrow transition-[width] duration-300"
    :class="{ isNarrow: isNarrowCom }"
  >
    <div
      class="flex flex-row min-[768px]:flex-col h-full bg-bgColor-primary p-0 min-[768px]:px-3 min-[768px]:py-5 border-t min-[768px]:border-t-0 min-[768px]:border-r border-borderColor"
    >
      <RouterLink
        to="/"
        class="min-h-[72px] hidden min-[768px]:block p-3 min-[768px]:py-5 min-[768px]:px-3 min-[768px]:mb-[10px]"
      >
        <LogoText
          class="w-[103px] block parent-[.isNarrow]:hidden fill-textColor-primary text-textColor-primary"
        />
        <Logo
          class="hidden parent-[.isNarrow]:block fill-textColor-primary text-textColor-primary"
        />
      </RouterLink>
      <div
        class="flex flex-row min-[768px]:flex-col flex-grow justify-center min-[768px]:justify-normal"
      >
        <NavItem
          v-for="nav in navCom"
          :key="nav.name"
          :nav="nav"
          :current-user="currentUser"
          :current-nav="currentNav"
          @change-tab="changeTab"
        />
      </div>
      <div class="hidden min-[768px]:block">
        <NavItem
          :nav="tabBarCom"
          :current-user="currentUser"
          :current-nav="currentNav"
          @change-tab="changeTab"
        />
      </div>
    </div>
    <div class="fixed top-0 bottom-0 left-nav-narrow -z-10">
      <Transition name="fadeRight">
        <SearchPanel
          v-if="searchPanelActive"
          @close="handleCloseSearchPanel"
          v-click-outside="handleCloseSearchPanel"
        />
      </Transition>
      <Transition name="fadeRight">
        <NotifyPanel v-if="notifyPanelActive" v-click-outside="handleNotifyClickOutside" />
      </Transition>
    </div>
  </div>
</template>
