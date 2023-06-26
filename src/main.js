import { ViteSSG } from 'vite-ssg/single-page'
import '@unocss/reset/tailwind.css'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.less'
import 'uno.css'
import '@/styles/global.scss'

export const createApp = ViteSSG(App)
