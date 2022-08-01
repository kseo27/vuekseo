<template>
	<div ref="item" :class="itemClass" :style="coords" :d-x="x" :d-y="y" v-if="!disabled">
		<div :class="nodeClass" :style="dimens" v-bind="$attrs" v-on="events" v-tooltip.toggle="cmptdTooltip">{{ text }}</div>
	</div>
</template>

<script>
import { ref, computed } from 'vue';
import { itemKeys } from './templates.js';
import _ from 'lodash';

// ?expt.
import tooltip from '@views/experiments/tooltip/vt-tooltip';

export default {
	directives: {
		tooltip
	},
	props: {
		templates: Object,
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
		canvas: null,
	},
	setup( props ) {

		const item = ref();

		const disabled = computed(() => {
			return (props.x == null || props.y == null);
		});
		const cmptdItem = computed(() => {
			return _.defaultsDeep(_.pick(props, itemKeys()), props.templates[props.template]);
		});
		const itemClass = computed(() => {
			return ['finder-item', props.template && `finder-${props.template}-item`];
		});
		const nodeClass = computed(() => {
			let { state } = cmptdItem.value;
			return ['finder-node', props.template && `finder-${props.template}-node`,
				state && `finder-state-${state}`];
		});

		// coordinates
		const coords = computed(() => {
			let { x, y } = props;
			return `top:${y*props.zoom}px;left:${x*props.zoom}px;`;
		});

		// dimensions
		const dimens = computed(() => {
			let { width, height = width, zoomable } = cmptdItem.value;
			return zoomable ? `width:${width*props.zoom}px;height:${height*props.zoom}px;`
				: `width:${width}px;height:${height}px;`;
		});

		// computed tooltip
		let tooltipCallback = () => {
			console.log('tooltip callback.');
		}
		const cmptdTooltip = computed(() => {
			let tooltip = typeof props.tooltip === 'string' ? { value: props.tooltip } : props.tooltip;
			let cmptd = _.defaults({ viewport: props.canvas }, tooltip);
			// return _.default({  }, tooltip);
			
			return props.tooltip;
		});

		return {
			disabled, itemClass, nodeClass,
			coords, dimens,
			cmptdTooltip,
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