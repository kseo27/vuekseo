<template>
<div ref="item" :class="['finder-item', template && `finder-${template}-item`]" :style="coords">
	<div :class="['finder-node', template && `finder-${template}-node`]" :style="dims" v-on="events" v-tooltip="tooltip">
		{{ text }}
	</div>
	<!-- ?expt. item status -->
	<div class="finder-item-expt">{{ $props }}<br/>{{ $attrs }}</div>
</div>
</template>

<script>
import { ref, computed } from 'vue';

// ?expt.
import tooltip from '@views/experiments/tooltip/vt-tooltip';

export default {
	directives: {
		tooltip
	},
	props: {
		template: String,
		x: null,
		y: null,
		width: null,
		height: null,
		text: null,
		tooltip: null,
		events: {
			type: Object,
			default: () => ({})
		},
		zoom: {
			type: Number,
			default: 1
		},
		zoomable: {
			type: Boolean,
			default: true
		},
	},
	setup( props ) {

		const item = ref();

		// coordinates
		const coords = computed(() => {
			let { x, y } = props;
			return `top:${y*props.zoom}px;left:${x*props.zoom}px;`;
		});

		// dimensions
		const dims = computed(() => {
			let zoom = props.zoomable ? props.zoom : 1;
			let { width, height } = props;
			if ( height == null ) height = width;
			return `width:${width*zoom}px;height:${height*zoom}px`;
		});

		return {
			coords, dims,
		}
	}
}
</script>

<style lang="scss">

// ?expt.
.finder-item-expt {
	position: absolute;
	top: 100%;
	left: 0;
    padding: 0.25em;
    line-height: 1.4;
    white-space: nowrap;
}
</style>