<script lang="ts" setup>
import UiButton from '@/components/Form/UiButton.vue'
import UiInput from '@/components/Form/UiInput.vue'
import LogoText from '@/assets/icons/logo-text.svg'

import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()

const username = ref('')
const password = ref('')
const authError = ref<Nullable<string>>(null)
const loading = ref(false)

const isDisable = computed(() => {
  return !(username.value != '' && password.value.length >= 8)
})

const submitLoginForm = async () => {
  const { setCurrentUser } = useUserStore()
  const { getUserInLogin } = useAuth()

  loading.value = true

  const user = await getUserInLogin(username.value, password.value)

  if (user) {
    setCurrentUser(user)
    authError.value = null
    router.push('/')
  } else {
    authError.value = 'Rất tiếc, mật khẩu của bạn không đúng. Vui lòng kiểm tra lại mật khẩu.'
  }

  loading.value = false
}
</script>

<template>
  <div class="w-[350px] flex flex-col mt-3">
    <div class="flex flex-col items-center py-5 px-10 border rounded-sm border-borderColor">
      <RouterLink to="/" class="w-[175px] mt-[26px] mb-10">
        <LogoText />
      </RouterLink>
      <form id="loginForm" class="w-full text-center" @submit.prevent="submitLoginForm">
        <UiInput
          class="mb-[6px]"
          name="username"
          placeholder="Số điện thoại, tên người dùng hoặc email"
          v-model:propValue="username"
        />
        <UiInput
          class=""
          name="password"
          placeholder="Mật khẩu"
          type="password"
          v-model:propValue="password"
        />
        <UiButton type="submit" primary class="mt-4 mb-4" :disabled="isDisable" :isLoading="loading"
          >Đăng nhập</UiButton
        >
        <div class="flex items-center mb-5">
          <div class="separator-small bg-borderColor"></div>
          <span class="px-[18px] text-[13px] font-semibold text-textColor-secondary">HOẶC</span>
          <div class="separator-small bg-borderColor"></div>
        </div>
        <ui-button variant="text">
          <div class="flex w-full items-center justify-center">
            <div class="w-4 h-4 mr-2">
              <img src="@/assets/images/facebookIcon.png" alt="Logo Facebook" />
            </div>
            <span>Đăng nhập bằng Facebook</span>
          </div>
        </ui-button>
        <p v-if="authError" class="text-sm text-error my-8">{{ authError }}</p>
        <router-link to="/" class="text-xs text-link">
          <span>Quên mật khẩu?</span>
        </router-link>
      </form>
    </div>
    <div class="p-[25px] my-[10px] text-center border rounded-sm border-borderColor">
      <span class="">Bạn chưa có tài khoản ư? </span>
      <router-link to="/accounts/signup" class="font-semibold text-buttonColor-primary"
        >Đăng ký</router-link
      >
    </div>
    <div class="mt-[10px] text-center">
      <p class="text-sm my-[10px]">Tải ứng dụng.</p>
      <div class="flex my-[10px] items-center justify-center gap-2">
        <router-link to="/" class="h-10">
          <img
            class="h-full"
            src="@/assets/images/downloadOnGooglePlay.png"
            alt="Download on Google Play"
          />
        </router-link>
        <router-link to="/" class="h-10">
          <img
            class="h-full"
            src="@/assets/images/downloadOnMicrosoft.png"
            alt="Download on Microsoft"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>
