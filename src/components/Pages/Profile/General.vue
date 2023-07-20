<script lang="ts" setup>
import MoreUserIcon from '@icons/more-user.svg'
import SettingIcon from '@icons/setting.svg'

import UiButton from '@/components/Form/UiButton.vue'
import Avatar from '@/components/Atom/Avatar.vue'
import FollowActionsPopup from '@/components/Popup/Profile/FollowActionsPopup.vue'
import RestrictionPopup from '@/components/Popup/Profile/RestrictionPopup.vue'
import ChangeAvatarPopup from '@/components/Popup/Profile/ChangeAvatarPopup.vue'
import Stories from '@/components/Molecules/Stories/Stories.vue'
import GeneralMobile from '@/components/Pages/Profile/GeneralMobile.vue'

import { ref, computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore, useResizeStore } from '@/store'
import { useFollow, useUser, useStorage } from '@/composables'
import { formatNumberToSuffix } from '@/helpers'
import { Navigation } from 'swiper/modules'

defineProps<{
  isCurrentUser: boolean
}>()

const { user, currentUser } = storeToRefs(useUserStore())
const { dimensions } = storeToRefs(useResizeStore())
const isLoadingFollow = ref(false)
const followActionsPopupActive = ref(false)
const restrictionPopupActive = ref(false)
const avatarPopupActive = ref(false)

const inputAvatar = ref<Nullable<HTMLInputElement>>(null)
const isLoadingAvatar = ref(false)

const storiesSwiperOptions = reactive({
  modules: [Navigation],
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 0,
  allowTouchMove: true,
  navigation: {
    nextEl: '.navigation-next',
    prevEl: '.navigation-prev',
    disabledClass: 'disabled'
  },
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 3,
      slidesPerGroup: 4,
      spaceBetween: 10
    },
    400: {
      slidesPerView: 5,
      spaceBetween: 12
    },
    800: {
      slidesPerView: 6
    },
    1000: {
      slidesPerView: 7
    }
  }
})

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

const isGeneralMobile = computed(() => {
  return dimensions.value.width < 736
})

const follow = async () => {
  if (currentUser) {
    const { setFollow } = useFollow()

    isLoadingFollow.value = true
    await setFollow(currentUser.value!.id, user.value!.id)
    isLoadingFollow.value = false
    user.value!.isCurrentUserFollowing = true
  }
}

const unfollow = async () => {
  if (currentUser) {
    const { deleteFollow } = useFollow()

    isLoadingFollow.value = true
    await deleteFollow(currentUser.value!.id, user.value!.id)
    isLoadingFollow.value = false
    user.value!.isCurrentUserFollowing = false
  }
}

const hanldeClickChangeAvatar = () => {
  if (user.value!.avatar == '') inputAvatar.value?.click()
  else {
    avatarPopupActive.value = true
  }
}

const getInputAvatar = async (event: Event) => {
  if (currentUser.value) {
    const file = (event.target as HTMLInputElement).files![0]
    const fileName = file.name
    console.log(file, fileName)

    const { setAvatar } = useStorage()
    const { updateAvatar } = useUser()

    avatarPopupActive.value = false
    isLoadingAvatar.value = true
    const urlAvatar = await setAvatar(currentUser.value.id, file)
    if (urlAvatar) await updateAvatar(currentUser.value.id, urlAvatar)
    isLoadingAvatar.value = false
  }
}

const deleteAvatar = async () => {
  if (currentUser.value) {
    const { deleteAvatar } = useStorage()
    const { updateAvatar } = useUser()

    avatarPopupActive.value = false
    isLoadingAvatar.value = true
    await Promise.all([deleteAvatar(currentUser.value.id), updateAvatar(currentUser.value.id, '')])
    isLoadingAvatar.value = false
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex w-full mb-6 min-[736px]:mb-11 px-4 min-[736px]:px-0">
      <div class="flex-[0_1] min-[736px]:flex-[1_1_0%]">
        <div class="relative flex justify-center mr-[30px]">
          <div
            v-if="isLoadingAvatar"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <fa class="text-white animate-spin" :icon="['fas', 'spinner']" />
          </div>
          <Avatar
            :width="isGeneralMobile ? '77' : '150'"
            :avatar-url="user!.avatar"
            class="cursor-pointer"
            title="Thay đổi ảnh đại diện"
            @click="hanldeClickChangeAvatar"
          />
          <ChangeAvatarPopup
            v-if="avatarPopupActive"
            @upload-avatar="
              () => {
                inputAvatar?.click()
              }
            "
            @delete-avatar="deleteAvatar"
            @close="
              () => {
                avatarPopupActive = false
              }
            "
          />
        </div>
      </div>
      <form class="hidden" method="post" enctype="multipart/form-data">
        <input
          ref="inputAvatar"
          accept="image/jpeg,image/png,image/jpg"
          type="file"
          @change="getInputAvatar"
        />
      </form>
      <div class="flex flex-col flex-[2_1_0%]">
        <div class="flex flex-col min-[736px]:flex-row items-start min-[736px]:items-center">
          <div class="flex mb-4 min-[736px]:mb-0">
            <RouterLink to="" class="text-xl mr-2">{{ user?.username }}</RouterLink>
            <div v-if="isGeneralMobile">
              <UiButton v-if="isCurrentUser" class="" variant="text">
                <SettingIcon />
              </UiButton>
              <UiButton v-else variant="text">
                <fa class="text-textColor-primary text-lg" :icon="['fas', 'ellipsis']" />
              </UiButton>
            </div>
          </div>
          <div class="flex flex-wrap ml-0 min-[736px]:ml-4">
            <UiButton v-if="isCurrentUser" secondary>Chỉnh sửa trang cá nhân</UiButton>
            <template v-else>
              <UiButton
                class="mr-2 mb-1"
                v-if="user?.isCurrentUserFollowing"
                secondary
                :isDisabled="isLoadingFollow"
                :isLoading="isLoadingFollow"
                @click="
                  () => {
                    followActionsPopupActive = true
                  }
                "
              >
                <span>Đang theo dõi</span>
                <fa class="text-xs ml-1" :icon="['fas', 'chevron-down']" />
              </UiButton>
              <UiButton
                v-else
                class="mr-2"
                primary
                :isDisabled="isLoadingFollow"
                :isLoading="isLoadingFollow"
                @click="follow"
                >Theo dõi</UiButton
              >
              <UiButton class="mr-2" secondary>Nhắn tin</UiButton>
              <UiButton secondary>
                <MoreUserIcon />
              </UiButton>
            </template>
          </div>
          <div v-if="!isGeneralMobile">
            <UiButton v-if="isCurrentUser" class="" variant="text">
              <SettingIcon />
            </UiButton>
            <UiButton v-else variant="text">
              <fa class="text-textColor-primary text-lg" :icon="['fas', 'ellipsis']" />
            </UiButton>
          </div>
        </div>
        <template v-if="!isGeneralMobile">
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
            <RouterLink :to="{ name: 'MutualFollowers' }"
              >Có
              <span class="text-textColor-primary font-medium">{{ mutualFollowersComp }}</span>
              <span v-if="user.mutualFollowers && user.mutualFollowers.length > 3">
                và {{ user.mutualFollowers.length - 3 }} người khác theo dõi</span
              >
              theo dõi
            </RouterLink>
          </div>
        </template>
      </div>
    </div>

    <GeneralMobile v-if="isGeneralMobile" :mutual-followers-comp="mutualFollowersComp" />

    <Stories
      class="mb-5 min-[736px]:mb-11"
      :options="storiesSwiperOptions"
      :image-size="isGeneralMobile ? '55' : '77'"
      :has-add-story="isCurrentUser"
    />

    <FollowActionsPopup
      v-if="followActionsPopupActive"
      :user="user!"
      :onUnfollow="
        () => {
          followActionsPopupActive = false
          unfollow()
        }
      "
      :onClose="
        () => {
          followActionsPopupActive = false
        }
      "
      :onClickOutside="
        () => {
          followActionsPopupActive = false
        }
      "
      @open-restriction-popup="
        () => {
          followActionsPopupActive = false
          restrictionPopupActive = true
        }
      "
    />

    <RestrictionPopup
      v-if="restrictionPopupActive"
      :user="user!"
      :onClose="
        () => {
          restrictionPopupActive = false
        }
      "
    />
  </div>
</template>
