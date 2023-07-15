<script lang="ts" setup>
import { formatNumberToSuffix } from '@/helpers'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

defineProps<{
  mutualFollowersComp: string
}>()

const { user, currentUser } = storeToRefs(useUserStore())
</script>

<template>
  <div class="flex flex-col pb-5 px-4">
    <div class="flex flex-col">
      <span class="font-semibold">{{ user?.fullname }}</span>
      <span class="">{{ user?.bio }}</span>
    </div>
    <div
      v-if="user?.mutualFollowers && mutualFollowersComp"
      class="mt-4 text-xs text-textColor-secondary"
    >
      <RouterLink :to="{ name: 'MutualFollowers' }"
        >Có
        <span class="text-textColor-primary font-medium">{{ mutualFollowersComp }}</span>
        <span v-if="user.mutualFollowers && user.mutualFollowers.length > 3">
          và {{ user.mutualFollowers.length - 3 }} người khác theo dõi</span
        >
        theo dõi
      </RouterLink>
    </div>
  </div>

  <ul
    class="order-1 flex justify-around items-center [&>*]:flex-[1_1] border-t border-borderColor py-3"
  >
    <li
      class="text-center text-sm leading-tight text-textColor-secondary flex flex-col items-center"
    >
      <span
        class="text-textColor-primary font-semibold"
        :title="user?.insight?.postsCount?.toString()"
        >{{ formatNumberToSuffix(user?.insight?.postsCount) }}</span
      >
      <span>bài viết</span>
    </li>
    <li class="text-center text-sm leading-tight text-textColor-secondary">
      <component
        :is="user?.insight?.followersCount == 0 || !currentUser ? 'span' : 'router-link'"
        :to="{ name: 'Followers' }"
        class="flex flex-col items-center"
      >
        <span
          class="text-textColor-primary font-semibold"
          :title="user?.insight?.followersCount?.toString()"
          >{{ formatNumberToSuffix(user?.insight?.followersCount) }}</span
        >
        <span>người theo dõi</span>
      </component>
    </li>
    <li class="text-center text-sm leading-tight text-textColor-secondary">
      <component
        :is="user?.insight?.followingCount == 0 || !currentUser ? 'span' : 'router-link'"
        :to="{ name: 'Following' }"
        class="flex flex-col items-center"
      >
        <span>Đang theo dõi</span>
        <span
          class="text-textColor-primary font-semibold"
          :title="user?.insight?.followingCount?.toString()"
          >{{ formatNumberToSuffix(user?.insight?.followingCount) }}</span
        >
        <span>người dùng</span>
      </component>
    </li>
  </ul>
</template>
