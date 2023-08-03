<script lang="ts" setup>
import LogoText from '@icons/logo-text.svg'
import Logo from '@icons/logo.svg'
import SearchPanel from './NavPanel/SearchPanel.vue'
import NotifyPanel from './NavPanel/NotifyPanel.vue'
import NavItem from './NavItem.vue'
import NavBarMore from './NavBarMore.vue'
import CreatePostModal from '@/components/Modal/CreatePostModal.vue'

import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore, useResizeStore, useModalStore, useCreatePostStore } from '@/store'
import { NavTabEnum } from '@/types'
import { useNav } from '@/composables'

const { currentUser } = storeToRefs(useUserStore())
const { screen } = storeToRefs(useResizeStore())
const { modalCreatePostShow } = storeToRefs(useModalStore())
const route = useRoute()

const { navs, tabBar } = useNav()

const currentNav = ref<NavTabEnum>(NavTabEnum.Home)
const searchPanelActive = ref(false)
const notifyPanelActive = ref(false)
const barPanelActive = ref(false)

const changeTab = (nav: NavTabEnum) => {
  searchPanelActive.value = nav == NavTabEnum.Search ? true : false
  notifyPanelActive.value = nav == NavTabEnum.Notification ? true : false
  barPanelActive.value = nav == NavTabEnum.Bar ? true : false
  modalCreatePostShow.value = nav == NavTabEnum.CreatePost ? true : false
  currentNav.value = nav
}

const handleCloseSearchPanel = () => {
  searchPanelActive.value = false
  currentNav.value = route.matched[0].name as NavTabEnum
}

const handleCloseNotifyPanel = () => {
  notifyPanelActive.value = false
  currentNav.value = route.matched[0].name as NavTabEnum
}

const handleCloseBarPanel = () => {
  barPanelActive.value = false
  currentNav.value = route.matched[0].name as NavTabEnum
}

const handleCloseCreatePost = () => {
  const { setRemovePostPopupShow, setModalCreatePostShow } = useModalStore()
  const { currentTab } = useCreatePostStore()

  if (!['InitPost', 'UploadPost'].includes(currentTab)) setRemovePostPopupShow(true)
  else setModalCreatePostShow(false)

  currentNav.value = route.matched[0].name as NavTabEnum
}

const isNarrowCom = computed(() => {
  if (screen.value == 'mobile') return false
  return searchPanelActive.value || notifyPanelActive.value || screen.value == 'tablet'
    ? true
    : false
})

watch(
  route,
  (to) => {
    currentNav.value = to.matched[0].name as NavTabEnum
  },
  { immediate: true }
)
</script>

<template>
  <div
    class="fixed z-30 top-auto min-[768px]:top-0 bottom-0 min-[768px]:bottom-auto left-0 h-12 min-[768px]:h-screen w-full min-[1264px]:w-nav-medium min-[768px]:w-nav-narrow has-[isNarrow]:w-nav-narrow transition-[width] duration-300"
    :class="{ isNarrow: isNarrowCom }"
  >
    <div
      class="flex flex-row min-[768px]:flex-col h-full bg-bgColor-primary p-0 min-[768px]:px-3 min-[768px]:py-5 border-t min-[768px]:border-t-0 min-[768px]:border-r border-borderColor box-border"
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
        class="flex flex-row min-[768px]:flex-col flex-grow justify-evenly min-[768px]:justify-normal"
      >
        <NavItem
          v-for="nav in navs"
          :key="nav.name"
          :nav="nav"
          :current-user="currentUser"
          :current-nav="currentNav"
          @change-tab="changeTab"
        />
      </div>
      <div class="relative hidden min-[768px]:block">
        <NavItem
          :nav="tabBar"
          :current-user="currentUser"
          :current-nav="currentNav"
          @change-tab="changeTab"
        />
        <NavBarMore v-if="barPanelActive" v-click-outside="handleCloseBarPanel" />
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
        <NotifyPanel v-if="notifyPanelActive" v-click-outside="handleCloseNotifyPanel" />
      </Transition>
    </div>
  </div>
  <CreatePostModal v-if="modalCreatePostShow" :on-click-outside="handleCloseCreatePost" />
</template>
