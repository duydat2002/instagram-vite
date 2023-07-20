<script lang="ts" setup>
import CommentItem from './CommentItem.vue'
</script>

<template>
  <div class="">
    <CommentItem />
    <div class="ml-[54px]">
      <div>
        <div class="inline-block w-6 h-[1px] bg-textColor-secondary align-middle mr-4"></div>
        <span class="text-xs text-textColor-secondary font-semibold">Xem câu trả lời (3)</span>
      </div>
      <div class="mt-3">
        <CommentItem />
        <CommentItem />
        <CommentItem />
      </div>
    </div>
  </div>
</template>
