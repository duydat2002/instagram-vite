<script lang="ts" setup>
import Avatar from '@/components/Atom/Avatar.vue'

import { ref, watch, onMounted } from 'vue'
import { debounce } from '@/helpers'
import { useUser } from '@/composables'
import { useUserStore } from '@/store'
import { unionBy, remove } from 'lodash'
import type { IUser } from '@/types'

const isFocus = ref(false)
const isLoading = ref(false)
const isSearch = ref(false)
const searchInput = ref('')
const searchHistory = ref<IUser[]>([])
const searchList = ref<IUser[] | null>(null)

const emit = defineEmits(['close'])

const handleResetSearch = () => {
  searchInput.value = ''
  isSearch.value = false
  searchList.value = null
}

const searchUserFn = async (searchText: string) => {
  const { searchUsers } = useUser()

  searchList.value = await searchUsers(searchText)
}

const updateSearchHistory = async () => {
  const { updateUser } = useUser()
  const { currentUser } = useUserStore()

  const searchHistoryIds = searchHistory.value.map((user) => user.id)
  await updateUser(currentUser!.id, {
    searchHistory: searchHistoryIds
  })
}

const addSearchHistory = async (user: IUser) => {
  searchHistory.value = unionBy([user], searchHistory.value, 'id')
  await updateSearchHistory()
}

const removeSearchHistory = async (user: IUser) => {
  searchHistory.value = remove(searchHistory.value, (item) => item.id !== user.id)
  await updateSearchHistory()
}

const handleClickSearchItem = async (user: IUser) => {
  await addSearchHistory(user)
}

const handleClickHistoryItem = async (user: IUser) => {
  emit('close')
  await addSearchHistory(user)
}

const handleDeleteHistoryItem = async (user: IUser) => {
  await removeSearchHistory(user)
}

const handleDeleteAllHistory = async () => {
  searchHistory.value = []
  await updateSearchHistory()
}

watch(searchInput, (value) => {
  isLoading.value = true
  debounce(async () => {
    if (value != '') {
      isSearch.value = true
      await searchUserFn(value)
    } else {
      handleResetSearch()
    }
    isLoading.value = false
  }, 300)
})

onMounted(async () => {
  const { getUserSearchHistory } = useUser()

  searchHistory.value = await getUserSearchHistory()
})
</script>

<template>
  <div
    class="panel flex flex-col w-[400px] h-full py-4 bg-bgColor-primary border-r border-borderColor"
  >
    <span class="block m-2 px-4 text-textColor-primary text-2xl font-semibold">Tìm kiếm</span>
    <div class="flex flex-col mt-8 flex-1">
      <div
        class="relative flex items-center mx-4 rounded-lg bg-[#EFEFEF] dark:bg-[#262626]"
        :class="{ focus: isFocus }"
      >
        <fa
          class="w-4 ml-4 parent-[.focus]:hidden text-[#8e8e8e]"
          :icon="['fas', 'magnifying-glass']"
        />
        <input
          class="flex-grow w-full py-2 pr-4 pl-3 parent-[.focus]:pl-4 text-base bg-transparent"
          type="text"
          placeholder="Tìm kiếm"
          v-model="searchInput"
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
        <div class="absolute top-1/2 right-4 -translate-y-1/2">
          <div v-if="isLoading" class="animate-spin text-[#c8c8c8]">
            <fa :icon="['fas', 'spinner']" />
          </div>
          <fa
            v-else
            class="text-[#838383] cursor-pointer"
            :icon="['fas', 'circle-xmark']"
            @click="handleResetSearch"
          />
        </div>
      </div>
      <div class="mt-6 border-t border-borderColor"></div>
      <div v-if="!isSearch" class="flex-shrink flex-grow basis-0 overflow-y-auto">
        <div class="flex flex-col">
          <div class="flex items-center justify-between my-4 px-6">
            <span class="text-base font-semibold">Gần đây</span>
            <span
              class="text-sm font-semibold text-buttonColor-primary hover:text-link cursor-pointer"
              @click="handleDeleteAllHistory"
              >Xóa tất cả</span
            >
          </div>
          <div class="flex flex-col items-center">
            <RouterLink
              v-for="user in searchHistory"
              :key="user.id"
              :to="{ name: 'Profile', params: { username: user.username } }"
              class="flex items-center w-full py-2 px-6 cursor-pointer hover:bg-bgColor-secondary"
            >
              <div class="flex flex-grow overflow-hidden" @click="handleClickHistoryItem(user)">
                <Avatar
                  class="flex-shrink-0"
                  width="54"
                  :avatarUrl="user.avatar"
                  :hasStory="Math.random() > 0.5"
                />
                <div class="flex flex-col flex-grow flex-shrink ml-3 overflow-hidden">
                  <span class="text-sm font-semibold">{{ user.username }}</span>
                  <span class="text-sm text-textColor-secondary truncate">{{ user.bio }}</span>
                </div>
              </div>
              <fa
                class="flex-shrink-0 w-5 h-5 p-2 ml-3 text-textColor-secondary fill-textColor-secondary"
                :icon="['fas', 'xmark']"
                @click="handleDeleteHistoryItem(user)"
              />
            </RouterLink>
          </div>
        </div>
      </div>
      <div v-else class="flex-shrink flex-grow basis-0 overflow-y-auto">
        <div v-if="!searchList" class="flex w-full h-full items-center justify-center">
          <div class="animate-spin text-[#838383]">
            <fa :icon="['fas', 'spinner']" />
          </div>
        </div>
        <div v-else-if="searchList.length > 0" class="flex flex-col items-center mt-3">
          <RouterLink
            v-for="user in searchList"
            :key="user.id"
            :to="{ name: 'Profile', params: { username: user.username } }"
            class="flex items-center w-full py-2 px-6 cursor-pointer hover:bg-bgColor-secondary"
          >
            <div class="flex flex-grow overflow-hidden" @click="handleClickSearchItem(user)">
              <Avatar
                class="flex-shrink-0"
                width="54"
                :avatarUrl="user.avatar"
                :hasStory="Math.random() > 0.5"
              />
              <div class="flex flex-col flex-grow flex-shrink ml-3 overflow-hidden">
                <span class="text-sm font-semibold">{{ user.username }}</span>
                <span class="text-sm text-textColor-secondary truncate">{{ user.bio }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
        <div v-else class="w-full h-full flex items-center justify-center text-textColor-secondary">
          Không tìm thấy kết quả nào
        </div>
      </div>
    </div>
  </div>
</template>
