<script lang="ts" setup>
import HomeLogin from '@/components/Pages/Home/HomeLogin.vue'
import HomePage from '@/components/Pages/Home/HomePage.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

import { auth } from '@/firebase'
</script>

<template>
  <div class="flex justify-center w-full">
    <!-- Home -->
    <DashboardLayout v-if="auth.currentUser">
      <HomePage />
    </DashboardLayout>
    <!-- Login -->
    <AuthLayout v-else>
      <HomeLogin />
    </AuthLayout>
  </div>
</template>
