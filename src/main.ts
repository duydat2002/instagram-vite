import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { FontAwesomeIcon } from '@/libs/fontAwesome'
import { ClickOuside } from '@/directives'
import Icon from '@/helpers/Icon.vue'

const app = createApp(App)

app.component('fa', FontAwesomeIcon)
app.component('icon', Icon)
app.directive('click-outside', ClickOuside)

app.use(router)
app.use(createPinia())

app.mount('#app')
