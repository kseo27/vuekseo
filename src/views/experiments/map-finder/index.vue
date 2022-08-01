<template>
<p><span>- Map Finder plugin 예시 </span><code>@/plugins/map-finder</code></p>
<section class="mt-2">
	<Finder ref="finder" :map="mapState" :items="items" :templates="myTemplates">
		<template #wrapper>
			<div class="status">{{ status }}</div>
		</template>
	</Finder>
</section>
<Button label="Get Map" class="mt-2" @click="getFinderMap" />
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { toFixed } from '@utils/vt-utils';
import { useApiRequest } from '@services';
import Finder from '@/plugins/map-finder';

export default {
	components: {
		Finder
	},
	setup() {

		const apiReq = useApiRequest({ baseURL: '/' });

		const finder = ref();
		onMounted(() => {
			console.log(finder.value);
		})

		// ! Required props
		const mapState = ref({
			src: null, // x, y, width, height,
		});
		const items = ref([
			// { `finder-item-schema` }
			{
				template: 'area',
				x: 200, y: 100, // width, height, state, zoomable,
				tooltip: 'my tooltip value'
			},
			{
				template: 'area',
				state: 'red',
				x: 400, y: 200, // width, height, state, zoomable,
				tooltip: 'red state tooltip value'
			}
		]);

		// ?expt. item templates
		let myTemplates = {
			myitem: {
				events: {
					click() {
						console.log('myitem click.');
					}
				}
			}
		};

		const status = ref('my status slot.');

		onBeforeUnmount(() => {
			myTemplates = null;
		});


		// ?expt. map image src
		let imgURL = require('@/assets/temp/sample-map-820.png');

		const getFinderMap = () => {
			if ( finder.value.mapState.src ) {
				finder.value.updateMap({ src: null });
			} else {
				apiReq.get(imgURL, { responseType: 'blob' })
					.then(res => {
						const reader = new FileReader();
						reader.onload = ev => {
							// console.log(ev.target.result);
							finder.value.updateMap({ src: ev.target.result });
						}
						reader.readAsDataURL(res.data);
					})
					.catch(err => {
						console.log('[GetMap Error]', err);
					});
			}
			// apiReq.get()
			// console.log(imgURL);
		}

		return {
			finder,
			//! Required props
			mapState, items,

			// ?expt. item templates
			myTemplates,
			status,
			// ?expt. map image
			getFinderMap
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