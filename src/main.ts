import './assets/main.css'

import App from './App.vue'
import router from './router'
import { createApp, type App as AppType } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@/libs/fontAwesome'
import { ClickOuside } from '@/directives'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'

let app: AppType<Element> | null = null

onAuthStateChanged(auth, async () => {
  if (!app) {
    app = createApp(App)

    app.component('fa', FontAwesomeIcon)
    app.directive('click-outside', ClickOuside)

    app.use(createPinia())
    app.use(router)

    app.mount('#app')
  }
})
