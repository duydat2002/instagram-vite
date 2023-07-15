<script lang="ts" setup>
import Avatar from '@/components/Atom/Avatar.vue'

import type { IUser } from '@/types'

// defineEmits(['clickItem', 'deleteItem'])
const emit = defineEmits<{
  (e: 'clickItem', user: IUser): void
  (e: 'deleteItem', user: IUser): void
}>()
withDefaults(
  defineProps<{
    searchList: IUser[] | null
    hasDelete?: boolean
    notFoundMessage: string
  }>(),
  {
    hasDelete: false
  }
)

const onClickItem = (user: IUser) => {
  emit('clickItem', user)
}

const onDeleteItem = (user: IUser) => {
  emit('deleteItem', user)
}
</script>

<template>
  <div class="w-full h-full">
    <div v-if="!searchList" class="flex w-full h-full flex-center">
      <div class="animate-spin text-[#838383]">
        <fa :icon="['fas', 'spinner']" />
      </div>
    </div>
    <div v-else-if="searchList.length > 0" class="flex flex-col items-center">
      <RouterLink
        v-for="user in searchList"
        :key="user.id"
        :to="{ name: 'Profile', params: { username: user.username } }"
        class="flex items-center w-full py-2 px-6 cursor-pointer hover:bg-bgColor-secondary"
      >
        <div class="flex flex-grow overflow-hidden" @click="onClickItem(user)">
          <Avatar
            class="flex-shrink-0"
            width="45"
            :avatarUrl="user.avatar"
            :hasStory="Math.random() > 0.5"
          />
          <div class="flex flex-col justify-center flex-grow flex-shrink ml-3 overflow-hidden">
            <span class="text-sm font-semibold">{{ user.username }}</span>
            <span class="text-sm text-textColor-secondary truncate">{{ user.bio }}</span>
          </div>
        </div>
        <fa
          v-if="hasDelete"
          class="flex-shrink-0 w-5 h-5 p-2 ml-3 text-textColor-secondary fill-textColor-secondary"
          :icon="['fas', 'xmark']"
          @click.prevent="onDeleteItem(user)"
        />
      </RouterLink>
    </div>
    <div v-else class="w-full h-full flex flex-center font-semibold text-textColor-secondary">
      {{ notFoundMessage }}
    </div>
  </div>
</template>
