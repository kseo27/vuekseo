<template>
	<p class="vt-box mb-2">Time out Count : {{ count }}</p>
	<Button label="Set Timeout" @click="timeoutTest" />
	<Button label="Clear Timer" @click="clearTimer" />
</template>

<script>
import { ref } from 'vue';
import { useToast } from "primevue/usetoast";
import { useTimer } from '@composables/vt-timer';

export default {
	setup() {
		let [ timeout, interval ] = useTimer();
        const toast = useToast();

		const count = ref(0);
		const timeoutTest = () => {
			timeout(() => {
				toast.add({ severity:'info', summary: 'Message', detail:'Timeout works !', life: 5000 });
				count.value++
			}, 1000);
		}
		const clearTimer = timeout.clear;

		return {
			count, timeoutTest, clearTimer,
		}
	}
}
</script>

<style>

</style>