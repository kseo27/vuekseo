<template>
<div class="finder-wrapper flex">
	<slot name="wrapper" />
	<div :ref="canvasRef" class="finder-canvas">
		<FinderItem v-for="(item, i) in items" :key="i" v-bind="genItem(item)" :zoom="zoom" />
	</div>
</div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import useTemplates from './templates.js';
import FinderItem from './FinderItem.vue';
import _ from 'lodash';

// #expt
import tooltip from '@views/experiments/tooltip/vt-tooltip';

export default {
	directives: {
		tooltip
	},
	components: {
		FinderItem
	},
	props: {
		templates: null,
		items: null,
	},
	setup( props ) {
		const templates = useTemplates(props.templates);
		const genItem = item => {
			return templates[item.template] ? _.assign(templates[item.template], item) : item;
		}

		const zoom = ref(1);

		let canvas;
		const canvasElement = ref();
		const canvasRef = el => {
			canvas = el;
			canvasElement.value = el;
		}

		// #expt

		return {
			genItem,
			zoom,
			canvasElement, canvasRef,

			// #expt
		}
	}
}
</script>

<style lang="scss">
.finder {
	&-wrapper {
		position: relative;
		min-height: 300px;
		border: 1px solid #d9e0e3;
		background: #ffffff;
		overflow: hidden;
	}
}
</style>