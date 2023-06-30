<script lang="ts" setup>
import LogoText from '@icons/logo-text.svg'
import Logo from '@icons/logo.svg'
import Bar from '@icons/bar.svg'
import BarActive from '@icons/bar-active.svg'
import SearchPanel from '@/components/Layout/Nav/NavPanel/SearchPanel.vue'
import NotifyPanel from '@/components/Layout/Nav/NavPanel/NotifyPanel.vue'
import Avatar from '@/components/Atom/Avatar.vue'

import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useNavStore, useResizeStore } from '@/store'
import { NAVS, NAVS_MOBILE, NavTabEnum } from '@/constants'

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

const handleSearchClickOutside = () => {
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
  return searchPanelActive.value ||
    notifyPanelActive.value ||
    barPanelActive.value ||
    screen.value == 'tablet'
    ? true
    : false
})

watch(route, (to) => {
  currentNav.value = to.matched[0].name as NavTabEnum
})

watch(currentNav, (to) => {
  console.log(to)
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
        <RouterLink
          v-for="nav in navCom"
          :key="nav.name"
          :to="nav.path"
          class="nav-item flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-hover"
          :class="{ active: currentNav == nav.name }"
          @click="changeTab(nav.name)"
        >
          <component
            v-if="nav.name != NavTabEnum.Profile"
            :is="currentNav == nav.name ? nav.iconActive as string : nav.icon as string"
            class="w-6 flex-shrink-0 fill-textColor-primary text-textColor-primary"
          />
          <div v-else class="w-6 h-6 relative">
            <Avatar
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              width="36"
            />
          </div>
          <span
            class="hidden min-[1264px]:block parent-[.isNarrow]:hidden min-w-max pl-4 text-base text-textColor-primary parent-[.nav-item.active]:font-bold"
            >{{ nav.title }}</span
          >
        </RouterLink>
      </div>
      <RouterLink
        to=""
        class="nav-item hidden min-[768px]:flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-hover"
        :class="{ active: currentNav == NavTabEnum.Bar }"
        @click="changeTab(NavTabEnum.Bar)"
      >
        <component
          :is="currentNav == NavTabEnum.Bar ? BarActive : Bar"
          class="w-6 flex-shrink-0 fill-textColor-primary text-textColor-primary"
        />
        <span
          class="hidden min-[1264px]:block parent-[.isNarrow]:hidden min-w-max pl-4 text-base text-textColor-primary parent-[.nav-item.active]:font-bold"
          >Xem thêm</span
        >
      </RouterLink>
    </div>
    <div class="fixed top-0 bottom-0 left-nav-narrow -z-10">
      <Transition name="fadeRight">
        <SearchPanel v-if="searchPanelActive" v-click-outside="handleSearchClickOutside" />
      </Transition>
      <Transition name="fadeRight">
        <NotifyPanel v-if="notifyPanelActive" v-click-outside="handleNotifyClickOutside" />
      </Transition>
    </div>
  </div>
</template>
