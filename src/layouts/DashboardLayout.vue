<script lang="ts" setup>
import Menu from '@/components/Layout/Menu/Menu.vue'
import Suggest from '@/components/Layout/Suggest.vue'
</script>

<template>
  <section class="w-full">
    <Menu />
    <main
      class="flex w-full ml-0 min-[1264px]:ml-nav-medium min-[1264px]:w-[calc(100%-theme(spacing.nav-medium))] min-[768px]:ml-nav-narrow min-[768px]:w-[calc(100%-theme(spacing.nav-narrow))]"
    >
      <div class="flex-grow">
        <slot />
      </div>
      <Suggest />
    </main>
  </section>
</template>
