<script lang="ts" setup>
import SearchListVue from './SearchList.vue'
import ConfirmPopup from '@/components/Popup/ConfirmPopup.vue'

import { ref, watch, onMounted } from 'vue'
import { debounce } from '@/helpers'
import { useUser } from '@/composables'
import { useUserStore } from '@/store'
import { unionBy, remove } from 'lodash'
import type { IUser } from '@/types'

const isFocus = ref(false)
const isLoading = ref(false)
const isSearch = ref(false)
const deleteAllPopup = ref(false)
const searchInput = ref('')
const searchHistory = ref<IUser[] | null>(null)
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

  const searchHistoryIds = searchHistory.value?.map((user) => user.id)
  await updateUser(currentUser!.id, {
    searchHistory: searchHistoryIds
  })
}

const addSearchHistory = async (user: IUser) => {
  searchHistory.value = unionBy([user], searchHistory.value, 'id')
  await updateSearchHistory()
}

const removeSearchHistory = async (user: IUser) => {
  searchHistory.value = remove(searchHistory.value!, (item) => item.id !== user.id)
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
  closeDeleteAllPopup()
  await updateSearchHistory()
}

const closeDeleteAllPopup = () => {
  deleteAllPopup.value = false
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
          v-click-outside="
            () => {
              isFocus = false
            }
          "
        />
        <div v-show="isFocus" class="absolute top-1/2 right-4 -translate-y-1/2">
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
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between my-4 px-6">
            <span class="text-base font-semibold">Gần đây</span>
            <span
              v-if="searchHistory && searchHistory.length > 0"
              class="text-sm font-semibold text-buttonColor-primary hover:text-link cursor-pointer"
              @click="
                () => {
                  deleteAllPopup = true
                }
              "
              >Xóa tất cả</span
            >
          </div>
          <SearchListVue
            :searchList="searchHistory"
            hasDelete
            notFoundMessage="Không có nội dung tìm kiếm mới đây."
            @clickItem="handleClickHistoryItem"
            @deleteItem="handleDeleteHistoryItem"
          />
        </div>
      </div>
      <div v-else class="flex-shrink flex-grow basis-0 overflow-y-auto">
        <SearchListVue
          :searchList="searchList"
          notFoundMessage="Không tìm thấy kết quả nào."
          @clickItem="handleClickSearchItem"
        />
      </div>
    </div>
    <ConfirmPopup
      v-if="deleteAllPopup"
      title="Xóa lịch sử tìm kiếm?"
      desc="Bạn sẽ không thể hoàn tác
            hành động này. Nếu xóa lịch sử tìm kiếm, có thể bạn vẫn nhìn thấy các tài khoản mình đã
            tìm trong kết quả gợi ý."
      confirmMessage="Clear all"
      cancelMessage="Lúc khác"
      @confirm="handleDeleteAllHistory"
      @cancel="closeDeleteAllPopup"
      @click-outside="closeDeleteAllPopup"
    />
  </div>
</template>
