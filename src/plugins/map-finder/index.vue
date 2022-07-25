<template>
<div class="finder-wrapper flex" @wheel="onWheel" @mousedown.prevent="onMousedown">
	<slot name="wrapper" />
	<div :ref="canvasRef" class="finder-canvas" :style="canvasStyle">
		<FinderItem v-for="(item, i) in items" :key="i" v-bind="genItem(item)" :zoom="zoom" />
	</div>
</div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, reactive, computed } from 'vue';
import { toFixed } from '@/common/utils/vt-utils';
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
		map: {
			type: Object,
			default: () => ({
				src: null,
				x: null,
				y: null,
				width: null,
				height: null
			})
		}
	},
	setup( props ) {

		let fixPoint = num => +toFixed( num, props.precision );

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

		//! expt. events
		const canvasState = reactive({ ...props.map });
		const canvasStyle = computed(() => {
			let { x, y, width, height } = canvasState;
			return `top:${x}px;left:${y}px;
				width:${width*zoom.value}px;height:${height*zoom.value}px;`
		});

		onMounted(() => {
			if ( !canvas || !canvas.offsetParent ) return;
			console.log('canvas mounted.');
			if ( canvasState.width == null ) canvasState.width = +toFixed(canvas.offsetParent.clientWidth/zoom.value);
			if ( canvasState.height == null ) canvasState.height = +toFixed(canvas.offsetParent.clientHeight/zoom.value);
		});

		const onWheel = ev => {
			if ( !canvas /* is disabled */) return;
			ev.preventDefault();

			let { width: widthState, height: heightState } = canvasState;
			if ( widthState == null ) widthState = +toFixed(canvas.offsetWidth/zoom.value);
			if ( heightState == null ) heightState = +toFixed(canvas.offsetHeight/zoom.value);

			let d = (ev.deltaY || -ev.wheelDelta || ev.detail) > 0 ? -1 : 1;
			let lastZoom = zoom.value;
			let step = 0.2;
			if ( lastZoom < 1 || ( lastZoom === 1 && d < 0 )) step /= 2;

			let remainder = +toFixed((lastZoom * 10) % (step * 10) / 10, 2);
			if ( remainder ) step = d > 0 ? step - remainder : remainder;

			let nextZoom = +toFixed(lastZoom + (d * step), 2);
			zoom.value = Math.min(Math.max(0.5 /* min */, nextZoom), 4 /* max */);

			if ( lastZoom === zoom.value ) return;

			let rect = canvas.getBoundingClientRect();
			let mouseX = ev.clientX - rect.left;
			let mouseY = ev.clientY - rect.top;
			let { offsetTop: top, offsetLeft: left, offsetWidth: width, offsetHeight: height } = canvas;
			let incrementX = (widthState * zoom.value) - width;
			let incrementY = (heightState * zoom.value) - height;
			top -= fixPoint(incrementY * (mouseY / height));
			left -= fixPoint(incrementX * (mouseX / width));

			let { clientWidth: viewWidth, clientHeight: viewHeight } = canvas.offsetParent;
			let limitY = viewHeight / 2;
			if ( top > limitY ) top = fixPoint(limitY);
			else if ( top + heightState < limitY ) top = fixPoint(limitY - heightState * zoom.value);
			let limitX = viewWidth / 2;
			if ( left > limitX ) left = fixPoint(limitX);
			else if ( left + widthState < limitX ) left = fixPoint(limitX - widthState * zoom.value);

			canvasState.y = top;
			canvasState.x = left;
		}

		const onMousedown = () => {}

		return {
			genItem,
			zoom,
			canvasElement, canvasRef,

			//! expt. events
			canvasStyle,
			onWheel, onMousedown,
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
	&-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		margin: 0 !important;
		padding: 0 !important;

		// # temp
		background: #fff0f0;
	}
	&-item {
		position: absolute;
		width: 0;
		height: 0;
	}
	&-node {
		transform: translate(-50%, -50%);
		// # offsetLeft는 transform 적용전 위치값을,
		// DomRect는 transform 적용된 상태의 위치를 반환.
	}
}

//! expt. finder node
.finder-area-node {
	color: lightseagreen;

	// position: absolute;
	// top: 70%;
	// left: 70%;
	width: 50px;
	height: 50px;
	// border: 1px dashed currentColor;
	border-radius: 50%;
	overflow: hidden;

	&:before {
		content: " ";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		border-radius: 50%;
		background: rgba(32, 178, 170, 0.25);
		// transform: translate(-50%, -50%);

		border: 2px dotted currentColor;
	}

	&:after {
		content: " ";
		display: block;
		width: 100%;
		height: 100%;
		// background: currentColor;
		background: rgba(32, 178, 170, 0.25);
		// background: rgba(255, 255, 255, 0.5);
		border-radius: 50%;
		transform: scale(0);
		pointer-events: none;

		animation: vt-area-ripple 2s linear infinite;
		// animation: vt-area-ripple 1s ease-in infinite;
		// animation: vt-area-ripple 1s ease-out infinite;
	}
}
@keyframes vt-area-ripple {
	25% {
		opacity: 1;
		transform: scale(0);
	}
    100% {
        opacity: 0;
        transform: scale(1.25);
    }
}
</style>