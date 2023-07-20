<script lang="ts" setup>
import ShieldIcon from '@icons/shield.svg'
import CommentIcon from '@icons/comment.svg'
import SendIcon from '@icons/send.svg'
import Modal from '@/components/Modal/Modal.vue'

import type { IUser } from '@/types'

defineProps<{
  user: IUser
  onClose: Fn<any, any>
}>()
</script>

<template>
  <Modal isPopup isShow @click-outside="onClose">
    <div class="w-screen max-w-[400px] bg-modal rounded-xl text-center overflow-hidden">
      <div class="flex flex-col p-6">
        <span class="text-xl mt-1 mb-5">Bạn gặp vấn đề với {{ user.username }} ư?</span>
        <div class="flex items-start mb-4">
          <ShieldIcon class="flex-shrink-0 mt-1" />
          <div class="flex-grow ml-4 leading-tight text-left text-textColor-secondary">
            Hạn chế những tương tác không mong muốn mà không phải chặn hoặc bỏ theo dõi người bạn
            biết.
          </div>
        </div>
        <div class="flex items-start mb-4">
          <CommentIcon class="flex-shrink-0 mt-1" />
          <div class="flex-grow ml-4 leading-tight text-left text-textColor-secondary">
            Bạn sẽ kiểm soát liệu người khác có nhìn thấy bình luận họ mới đăng về bài viết của bạn
            không.
          </div>
        </div>
        <div class="flex items-start">
          <SendIcon class="flex-shrink-0 mt-1" />
          <div class="flex-grow ml-4 leading-tight text-left text-textColor-secondary">
            Đoạn chat của họ sẽ được chuyển vào phần Tin nhắn đang chờ, vì vậy họ sẽ không biết khi
            nào bạn đọc tin nhắn.
          </div>
        </div>
      </div>
      <div class="w-full p-4 border-t border-separator-modal select-none">
        <span
          class="font-semibold text-buttonColor-primary hover:text-link cursor-pointer"
          @click="onClose"
          >Hạn chế tài khoản</span
        >
      </div>
      <div class="w-full p-4 border-t border-separator-modal select-none">
        <span class="font-semibold hover:opacity-50 cursor-pointer" @click="onClose">Hủy</span>
      </div>
    </div>
  </Modal>
</template>
