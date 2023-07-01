<script lang="ts" setup>
import Avatar from '@/components/Atom/Avatar.vue'
import { NavTabEnum, type Nav } from '@/constants'
import type { IUser } from '@/types'

const emit = defineEmits(['changeTab'])
defineProps<{
  nav: Nav
  currentNav: NavTabEnum
  currentUser: Nullable<IUser>
}>()

const handleChangeTab = (nav: NavTabEnum) => {
  emit('changeTab', nav)
}
</script>

<template>
  <RouterLink
    :to="nav.path || ''"
    class="nav-item flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-hover"
    :class="{ active: currentNav == nav.name }"
    @click="handleChangeTab(nav.name)"
  >
    <component
      v-if="nav.name != NavTabEnum.Profile"
      class="w-6 flex-shrink-0 fill-textColor-primary text-textColor-primary"
      :is="currentNav == nav.name ? nav.iconActive as string : nav.icon as string"
    />
    <div v-else class="w-6 h-6 relative flex-shrink-0">
      <Avatar
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        width="36"
        :avatar-url="currentUser?.avatar"
      />
    </div>
    <span
      class="hidden min-[1264px]:block parent-[.isNarrow]:hidden min-w-max pl-4 text-base text-textColor-primary parent-[.nav-item.active]:font-bold"
      >{{ nav.title }}</span
    >
  </RouterLink>
</template>