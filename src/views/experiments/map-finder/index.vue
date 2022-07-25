<template>
<p><span>- Map Finder plugin 예시 </span><code>@/plugins/map-finder</code></p>
<section class="mt-2">
	<Finder :items="myItems" :templates="myTemplates">
		<template #wrapper>
			<div class="status">{{ status }}</div>
		</template>
	</Finder>
</section>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { toFixed } from '@/common/utils/vt-utils';
import Finder from '@/plugins/map-finder';

export default {
	components: {
		Finder
	},
	setup() {
		let myTemplates = {
			myitem: {
				events: {
					click() {
						console.log('myitem click.');
					}
				}
			}
		};
		const myItems = ref([
			{
				template: 'area',
				x: 200, y: 100,
				tooltip: 'my tooltip value'
			}
		]);

		const status = ref('my status slot.');

		onBeforeUnmount(() => {
			myTemplates = null;
		});


		//! expt. map
		let imgURL = require('@/assets/temp/sample-map-820.png');

		return {
			myTemplates, myItems,
			status,
		}
	}
}
</script>

<style lang="scss" scoped>
.status {
	position: absolute;
	top: 20px;
	left: 20px;
	z-index: 1;
}
</style>