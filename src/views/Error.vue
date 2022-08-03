<template>
<div class="vt-content">
	<h1 class="mb-4">Error {{ $route.params.code }}</h1>
	<p>Params: {{ $route.params }}</p>
	<p>Props:  {{ $props }}</p>
	<p>Query:  {{ $route.query }}</p>
</div>
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