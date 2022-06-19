<template>
  Error {{ $route.params.code }}
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
export default {
	setup() {
		onMounted(() => {
			console.log('onMounted Error!');
		})

		const router = useRouter();
		console.log(router)
	}
}
</script>

<style>

</style>