import { createApp } from 'vue'
import App from '@/App.vue'
// import store from '@/store'
import router from '@/router'
import PrimeVue from 'primevue/config'


import 'primevue/resources/themes/saga-blue/theme.css'  // theme
import 'primevue/resources/primevue.min.css'  // core css
import 'primeflex/primeflex.min.css'  // flex css
import 'primeicons/primeicons.css'  // icons
import '@/assets/scss/vt-style.scss';

const app = createApp(App)
// app.use(store)
app.use(router)
app.use(PrimeVue, {
	ripple: true,
	inputStyle: 'filled',
	zIndex: {
		modal: 1100,   // dialog, sidebar, toast
		overlay: 1000, // dropdown, overlaypanel
		menu: 1000,    // overlay menus
		tooltip: 1100  // tooltip
	}
})


app.mount('#app')
