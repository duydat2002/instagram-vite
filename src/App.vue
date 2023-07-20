<script setup lang="ts">
import Loading from '@/components/Utils/Loading.vue'
import Splash from '@/components/Utils/Splash.vue'

import { RouterView, useRoute } from 'vue-router'
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useModalStore,
  useUserStore,
  useThemeStore,
  useResizeStore,
  useLoadingStore
} from '@/store'
import { useUser, useResize } from '@/composables'
import type { Unsubscribe } from 'firebase/auth'

useResize()
const route = useRoute()
const { stopScroll } = storeToRefs(useModalStore())
const { darkMode } = storeToRefs(useThemeStore())
const { screen } = storeToRefs(useResizeStore())
const { isLoadingSplash } = storeToRefs(useLoadingStore())

watch(darkMode, (newTheme) => {
  if (newTheme) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
})

watch(stopScroll, (active) => {
  document.documentElement.style.overflow = active ? 'hidden' : 'visible'
})

let unsubscribe: Unsubscribe
onMounted(() => {
  console.log('App')
  const { watchUserChange } = useUser()
  const userStore = useUserStore()

  userStore.initCurrentUser().then(() => {
    console.log('initCurrentUser')
    if (userStore.currentUser) unsubscribe = watchUserChange(userStore.currentUser.id)
  })

  setTimeout(() => {
    console.log('800ms')
  }, 800)
})

onBeforeUnmount(() => {
  unsubscribe()
})
</script>

<template>
  <div
    class="has-[active-overlay]:overflow-y-scroll"
    :class="[{ 'active-overlay': stopScroll }, screen]"
  >
    <Splash v-if="isLoadingSplash" />
    <KeepAlive>
      <Component :is="route.meta.layout || 'div'">
        <Loading />

        <RouterView />
      </Component>
    </KeepAlive>
  </div>
</template>
