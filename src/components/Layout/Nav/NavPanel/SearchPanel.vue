<script lang="ts" setup>
import Avatar from '@/components/Atom/Avatar.vue'
import { ref } from 'vue'

const isFocus = ref(false)
const isLoading = ref(false)
const searchInput = ref('')
</script>

<template>
  <div
    class="panel flex flex-col w-[400px] h-full py-4 bg-bgColor-primary border-r border-borderColor"
  >
    <span class="block m-2 px-4 text-textColor-primary text-2xl font-semibold">Tìm kiếm</span>
    <div class="flex flex-col mt-8 flex-1">
      <div
        class="relative flex items-center mx-4 px-4 rounded-lg bg-[#EFEFEF] dark:bg-[#262626]"
        :class="{ focus: isFocus }"
      >
        <fa
          class="w-4 mr-3 parent-[.focus]:hidden text-[#8e8e8e]"
          :icon="['fas', 'magnifying-glass']"
        />
        <input
          class="flex-grow w-full py-2 text-base bg-transparent"
          type="text"
          placeholder="Tìm kiếm"
          v-model="searchInput"
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
        <div class="absolute top-1/2 right-4 -translate-y-1/2 hidden parent-[.focus]:block">
          <div v-if="isLoading" class="animate-spin text-[#c8c8c8]">
            <fa :icon="['fas', 'spinner']" />
          </div>
          <fa v-else class="text-[#c8c8c8]" :icon="['fas', 'circle-xmark']" />
        </div>
      </div>
      <div class="mt-6 border-t border-borderColor"></div>
      <div v-if="true" class="flex-shrink flex-grow basis-0 overflow-y-auto">
        <div class="flex flex-col">
          <div class="flex items-center justify-between my-4 px-6">
            <span class="text-base font-semibold">Gần đây</span>
            <span
              class="text-sm font-semibold text-buttonColor-primary hover:text-link cursor-pointer"
              >Xóa tất cả</span
            >
          </div>
          <div class="flex flex-col items-center">
            <div
              v-for="n in 10"
              :key="n"
              class="flex items-center w-full py-2 px-6 cursor-pointer hover:bg-bgColor-secondary"
            >
              <Avatar
                class="flex-shrink-0"
                width="54"
                :hasStory="true"
                avatarUrl="require('../assets/images/defaultAvatar.jpg')"
              />
              <div class="flex flex-col flex-grow flex-shrink ml-3 overflow-hidden">
                <span class="text-sm font-semibold">duydat2002</span>
                <span class="text-sm text-textColor-secondary truncate"
                  >This is descriptionThis is descriptionThis is description</span
                >
              </div>
              <fa
                class="flex-shrink-0 w-5 h-5 p-2 ml-3 text-textColor-secondary fill-textColor-secondary"
                :icon="['fas', 'xmark']"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
