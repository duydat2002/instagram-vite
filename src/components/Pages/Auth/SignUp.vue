<script lang="ts" setup>
import UiButton from '@/components/Form/UiButton.vue'
import UiInput from '@/components/Form/UiInput.vue'
import LogoText from '@/assets/icons/logo-text.svg'

import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useCheck } from '@/composables/useCheck'
import { useUser } from '@/composables/useUser'

const router = useRouter()

interface AuthError {
  emailOrPhoneError: string | null
  usernameError: string | null
  signupError: string | null
}

const username = ref('')
const password = ref('')
const fullname = ref('')
const emailOrPhone = ref('')
const authError = ref<AuthError>({
  emailOrPhoneError: null,
  usernameError: null,
  signupError: null
})
const isShowError = ref(false)
const checkContact = ref<Nullable<boolean>>(null)
const checkUsername = ref<Nullable<boolean>>(null)
const checkPassword = ref<Nullable<boolean>>(null)
const loading = ref(false)

const isDisable = computed(() => {
  return !(username.value != '' && emailOrPhone.value != '' && password.value.length >= 8)
})

const submitSignupForm = async () => {
  const { authError: authErr, signUp } = useAuth()

  loading.value = true

  if (authError.value.emailOrPhoneError || authError.value.usernameError) {
    isShowError.value = true
  } else {
    await signUp(emailOrPhone.value, password.value, fullname.value, username.value)

    if (authError.value) {
      authError.value.signupError = authErr.value
      isShowError.value = true
    } else {
      isShowError.value = false
      router.push('/')
    }
  }

  loading.value = false
}

const handleCheckContact = async () => {
  const { getUserWithQuery } = useUser()
  const { checkError, checkPhoneNumber, checkEmail } = useCheck()

  let user = null

  isShowError.value = false

  checkContact.value = null
  const regex = /^\+?\d+$/
  const isPhoneNumber = regex.test(emailOrPhone.value)

  if (isPhoneNumber) {
    const checkValue = await checkPhoneNumber(emailOrPhone.value)
    checkContact.value = checkValue
  } else {
    const checkValue = await checkEmail(emailOrPhone.value)
    checkContact.value = checkValue
  }

  if (checkContact.value) {
    user = await getUserWithQuery('email', '==', emailOrPhone.value)
    if (user) {
      authError.value.emailOrPhoneError = 'Một tài khoản khác đang dùng chung email.'
      checkContact.value = false
    }
  } else {
    authError.value.emailOrPhoneError = checkError.value
  }
}

const handleCheckUsername = async () => {
  const { getUserWithQuery } = useUser()

  isShowError.value = false

  const user = await getUserWithQuery('username', '==', username.value)

  if (user == null) {
    checkUsername.value = true
    authError.value.usernameError = null
  } else {
    checkUsername.value = false
    authError.value.usernameError = 'Tên người dùng này đã được sử dụng. Vui lòng thử tên khác.'
  }
}

const handleCheckPassword = () => {
  isShowError.value = false
  checkPassword.value = password.value.length >= 8 ? true : false
}
</script>

<template>
  <div class="w-[350px] flex flex-col mt-3 max-[450px]:mt-0 max-[450px]:w-full">
    <div
      class="flex flex-col items-center py-5 px-10 border rounded-sm border-borderColor max-[450px]:px-4 max-[450px]:border-none"
    >
      <RouterLink to="/" class="w-[175px] mt-[26px] mb-4">
        <LogoText />
      </RouterLink>
      <h2
        class="text-[17px] leading-5 font-semibold text-center text-textColor-secondary mb-[18px]"
      >
        Đăng ký để xem ảnh và video từ bạn bè.
      </h2>
      <form id="signupForm" class="w-full text-center mb-[18px]" @submit.prevent="submitSignupForm">
        <UiButton variant="contained" primary class="mb-[18px]">
          <div class="w-[18px] h-[18px] mr-2 inline-block">
            <fa class="w-full h-full" :icon="['fab', 'square-facebook']" style="color: #ffffff" />
          </div>
          <span>Đăng nhập bằng Facebook</span>
        </UiButton>
        <div class="flex items-center mb-5">
          <div class="separator-small bg-borderColor"></div>
          <span class="px-[18px] text-[13px] font-semibold text-textColor-secondary">HOẶC</span>
          <div class="separator-small bg-borderColor"></div>
        </div>
        <UiInput
          class="mb-[6px]"
          name="email"
          placeholder="Số di động hoặc email"
          v-model:propValue="emailOrPhone"
          :checkValue="checkContact"
          @change="handleCheckContact"
        />
        <UiInput
          class="mb-[6px]"
          name="fullname"
          placeholder="Tên đầy đủ"
          v-model:propValue="fullname"
          :checkValue="fullname"
          @change="isShowError = false"
        />
        <UiInput
          class="mb-[6px]"
          name="username"
          placeholder="Tên người dùng"
          v-model:propValue="username"
          :checkValue="checkUsername"
          @change="handleCheckUsername"
        />
        <UiInput
          name="password"
          placeholder="Mật khẩu"
          type="password"
          v-model:propValue="password"
          :checkValue="checkPassword"
          @change="handleCheckPassword"
        />
        <p class="text-xs text-textColor-secondary my-[15px]">
          <span
            >Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ của bạn lên
            Instagram.
            <RouterLink to="/" class="inline text-link">Tìm hiểu thêm</RouterLink>
          </span>
        </p>
        <p class="text-xs text-textColor-secondary mb-[15px]">
          <span
            >Bằng cách đăng ký, bạn đồng ý với
            <RouterLink to="/" class="inline text-link">Điều khoản</RouterLink>
            ,
            <RouterLink to="/" class="auth-link">Chính sách quyền riêng tư</RouterLink>
            và
            <RouterLink to="/" class="auth-link">Chính sách cookie</RouterLink>
            của chúng tôi.
          </span>
        </p>
        <ui-button type="submit" primary :disabled="isDisable" :isLoading="loading"
          >Đăng ký</ui-button
        >
        <p v-if="isShowError" class="text-sm text-error mt-8 mb-4">
          {{ authError.emailOrPhoneError || authError.usernameError || authError.signupError }}
        </p>
      </form>
    </div>
    <div
      class="p-[25px] my-[10px] text-center border rounded-sm border-borderColor max-[450px]:border-none"
    >
      <span class="">Bạn có tài khoản? </span>
      <RouterLink to="/accounts/login" class="font-semibold text-buttonColor-primary"
        >Đăng nhập</RouterLink
      >
    </div>
    <div class="mt-[10px] text-center">
      <p class="text-sm my-[10px]">Tải ứng dụng.</p>
      <div class="flex my-[10px] flex-wrap items-center justify-center gap-2">
        <RouterLink to="/" class="h-10">
          <img
            class="h-full"
            src="@/assets/images/downloadOnGooglePlay.png"
            alt="Download on Google Play"
          />
        </RouterLink>
        <RouterLink to="/" class="h-10">
          <img
            class="h-full"
            src="@/assets/images/downloadOnMicrosoft.png"
            alt="Download on Microsoft"
          />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
