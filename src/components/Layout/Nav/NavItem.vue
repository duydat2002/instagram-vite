<script lang="ts" setup>
import Avatar from '@/components/Atom/Avatar.vue'

import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { NavTabEnum, type IUser, type INav } from '@/types'

const emit = defineEmits(['changeTab'])
defineProps<{
  nav: INav
  currentNav: NavTabEnum
  currentUser: Nullable<IUser>
}>()

const { user } = storeToRefs(useUserStore())

const handleChangeTab = (nav: NavTabEnum) => {
  emit('changeTab', nav)
}
</script>

<template>
  <component
    :is="nav.path ? 'RouterLink' : 'div'"
    :to="nav.path || ''"
    class="relative nav-item group/nav-item flex items-center p-3 my-0 min-[768px]:my-[2px] min-[910px]:my-1 rounded-lg cursor-pointer transition-colors duration-300 min-[768px]:hover:bg-hover select-none"
    :class="{ active: currentNav == nav.name }"
    @click="handleChangeTab(nav.name)"
  >
    <component
      v-if="nav.name != NavTabEnum.Profile"
      :is="currentNav == nav.name ? nav.iconActive : nav.icon"
      class="w-6 flex-shrink-0 fill-textColor-primary text-textColor-primary transition-transform group-hover/nav-item:scale-105"
    />
    <div v-else class="w-6 h-6 relative flex-shrink-0">
      <Avatar
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        :class="{
          'shadow-[inset_0_0_0_2px_#000]':
            currentNav == NavTabEnum.Profile && currentUser?.id == user?.id
        }"
        width="26"
        :avatar-url="currentUser?.avatar"
      />
    </div>
    <span
      class="hidden min-[1264px]:block parent-[.isNarrow]:hidden min-w-max pl-4 text-base text-textColor-primary parent-[.nav-item.active]:font-bold"
      >{{ nav.title }}</span
    >
    <div class="tooltip">
      <div class="tooltip-content">{{ nav.title }}</div>
    </div>
  </component>
</template>

<style scoped>
.tooltip {
  margin-left: 18px;
  display: flex;
  align-items: center;
  position: absolute;
  left: 100%;
  width: max-content;
  border-radius: 8px;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.0975);
  transform: scale(0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.1s 0s;
  pointer-events: none;
  z-index: 100;
}

.isNarrow .nav-item:hover .tooltip {
  transform: scale(1);
  opacity: 1;
  visibility: visible;
  transition: all 0.3s cubic-bezier(0.09, 0.8, 0.52, 1.34) 1s;
}

.tooltip-content {
  padding: 8px 12px;
  color: var(--primary-text-color);
  background: var(--tooltip-bg-color);
  border-radius: 8px;
}

.tooltip-content::after {
  content: '';
  width: 20px;
  height: 20px;
  position: absolute;
  top: 50%;
  right: 100%;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.0975);
  transform: translate(15px, -50%) rotateZ(45deg);
  background: inherit;
  border-radius: 2px;
  z-index: -1;
}
</style>
