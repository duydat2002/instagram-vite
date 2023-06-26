<script lang="ts" setup>
import Footer from '@/components/Layout/Footer.vue'
</script>

<template>
  <section class="flex flex-col min-h-screen">
    <main class="flex flex-grow w-full justify-center">
      <slot />
    </main>
    <Footer />
  </section>
</template>
