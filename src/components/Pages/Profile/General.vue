<script lang="ts" setup>
import MoreUserIcon from '@icons/more-user.svg'
import SettingIcon from '@icons/setting.svg'
import UiButton from '@/components/Form/UiButton.vue'

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { formatNumberToSuffix } from '@/helpers'

const { user, currentUser } = storeToRefs(useUserStore())

const mutualFollowersComp = computed(() => {
  if (currentUser && user) {
    const usernames: string[] = []
    const threeFollowers = user.value!.mutualFollowers?.slice(0, 3)
    threeFollowers?.forEach((user) => {
      usernames.push(user.username!)
    })

    return usernames.join(', ')
  }
  return ''
})
</script>

<template>
  <div class="flex w-full mb-11">
    <div class="flex-[1_1_0%]">
      <div class="relative flex justify-center mr-[30px]">
        <div v-if="false" class="animate-spin">
          <fa :icon="['fas', 'spinner']" />
        </div>
        <img
          class="w-[150px] h-[150px] rounded-full overflow-hidden"
          :src="user?.avatar"
          alt="Avatar"
        />
        <button class="avatar-button" title="Thay đổi ảnh đại diện"></button>
      </div>
    </div>
    <form class="hidden" method="post" enctype="multipart/form-data">
      <input ref="inputAvatar" accept="image/jpeg,image/png,image/jpg" type="file" />
    </form>
    <div class="flex flex-col flex-[2_1_0%]">
      <div class="flex items-center">
        <RouterLink to="" class="text-xl">{{ user?.username }}</RouterLink>
        <div class="flex ml-4">
          <UiButton v-if="user?.id === currentUser?.id" class="ml-2" secondary
            >Chỉnh sửa trang cá nhân</UiButton
          >
          <template v-else>
            <UiButton v-if="user?.isCurrentUserFollowing" class="ml-2" secondary>
              <span>Đang theo dõi</span>
              <fa class="text-xs ml-1" :icon="['fas', 'chevron-down']" />
            </UiButton>
            <UiButton v-else class="ml-2" primary>Theo dõi</UiButton>
            <UiButton class="ml-2" secondary>Nhắn tin</UiButton>
            <UiButton class="ml-2" secondary>
              <MoreUserIcon />
            </UiButton>
          </template>
        </div>
        <div class="">
          <UiButton v-if="user?.id === currentUser?.id" class="" variant="text">
            <SettingIcon />
          </UiButton>
          <UiButton v-else variant="text">
            <fa class="text-textColor-primary text-lg" :icon="['fas', 'ellipsis']" />
          </UiButton>
        </div>
      </div>
      <ul class="flex [&>*:not(:last-child)]:mr-10 my-5">
        <li class="text-base">
          <span class="font-semibold" :title="user?.insight?.postsCount?.toString()">{{
            formatNumberToSuffix(user?.insight?.postsCount)
          }}</span>
          bài viết
        </li>
        <li class="text-base">
          <component
            :is="user?.insight?.followersCount == 0 || !currentUser ? 'span' : 'router-link'"
            :to="{ name: 'Followers' }"
          >
            <span class="font-semibold" :title="user?.insight?.followersCount?.toString()">{{
              formatNumberToSuffix(user?.insight?.followersCount)
            }}</span>
            người theo dõi
          </component>
        </li>
        <li class="text-base">
          <component
            :is="user?.insight?.followingCount == 0 || !currentUser ? 'span' : 'router-link'"
            :to="{ name: 'Following' }"
          >
            Đang theo dõi
            <span class="font-semibold" :title="user?.insight?.followingCount?.toString()">{{
              formatNumberToSuffix(user?.insight?.followingCount)
            }}</span>
            người dùng
          </component>
        </li>
      </ul>
      <div class="flex flex-col">
        <span class="font-semibold">{{ user?.fullname }}</span>
        <span class="">{{ user?.bio }}</span>
      </div>
      <div
        v-if="user?.mutualFollowers && mutualFollowersComp"
        class="mt-4 text-xs text-textColor-secondary"
      >
        <router-link :to="{ name: 'MutualFollowers' }"
          >Có
          <span class="text-textColor-primary font-medium">{{ mutualFollowersComp }}</span>
          <span v-if="user.mutualFollowers && user.mutualFollowers.length > 3">
            và {{ user.mutualFollowers.length - 3 }} người khác theo dõi</span
          >
          theo dõi</router-link
        >
      </div>
    </div>
  </div>
</template>