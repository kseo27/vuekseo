import { createApp } from 'vue'
import App from '@/App.vue'
// import store from '@/store'
import router from '@/router'
import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Check from 'primevue/checkbox'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Confirm from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'


// import 'primevue/resources/themes/saga-blue/theme.css'  // theme // ? vt-style 내에서 중복되는 상태
// import 'primevue/resources/primevue.min.css'  // core css // ? vt-style 내에서 중복되는 상태
import 'primeflex/primeflex.min.css'  // flex css
import 'primeicons/primeicons.css'  // icons
import '@/assets/scss/vt-style.scss'
// for Reference page
import '@/assets/scss/vt-ref.scss'


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
app.component('Input', InputText)
app.component('Check', Check)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('Confirm', Confirm)
app.use(ConfirmationService)
app.component('Toast', Toast)
app.use(ToastService)


// !#Ref:Highcharts: Installer
import Highcharts from '@/plugins/highcharts.reg';
app.use(Highcharts);


app.mount('#app')
