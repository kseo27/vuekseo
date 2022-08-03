<template>
	<RouterView />
	<Toast />
</template>

<script>
import { usePrimeVue } from "primevue/config"

export default {
	name: 'App',
	setup() {
		const primevue = usePrimeVue();
		primevue.config.locale.accept = 'OK';
		primevue.config.locale.reject = 'Cancel';

		// const toast = useToast();
		// toast.add({
		// 	severity:'info',
		// 	summary: 'Info Message',
		// 	detail:'Message Content',
		// 	life: 3000
		// });
	}
}
</script>

<style lang="scss">
#app {
	position: relative;
	height: 100%;
	z-index: 0;
}
.p-toast {
	// z-index: $z-modal;
	z-index: 500;
}
</style>
