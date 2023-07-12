<script lang="ts" setup>
import type { IUser } from '@/types'
import ConfirmPopup from './ConfirmPopup.vue'
import Avatar from '@/components/Atom/Avatar.vue'

withDefaults(
  defineProps<{
    user: IUser
    onConfirm?: Fn<any, any>
    onCancel?: Fn<any, any>
    onClickOutside?: Fn<any, any>
  }>(),
  {
    onConfirm: () => {},
    onCancel: () => {},
    onClickOutside: () => {}
  }
)
</script>

<template>
  <ConfirmPopup
    confirm-message="Bỏ theo dõi"
    @confirm="onConfirm"
    @cancel="onCancel"
    @click-outside="onClickOutside"
  >
    <div class="flex flex-col flex-center">
      <Avatar width="98" :avatar-url="user.avatar" />
      <span class="text-center mt-6"
        >Nếu đổi ý, bạn sẽ phải yêu cầu theo dõi lại @{{ user.username }}.</span
      >
    </div>
  </ConfirmPopup>
</template>
