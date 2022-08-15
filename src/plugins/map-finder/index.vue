<template>
<div :ref="wrapperRef" class="finder-wrapper flex" unselectable="on" @wheel="onWheel" @mousedown.prevent="onMouseDown">
	<slot name="wrapper" />
	<div :ref="canvasRef" class="finder-canvas" :style="canvasStyle">
		<img :src="mapState.src" class="finder-map" alt="finder map" @load="onMapLoad" @error="onMapError" v-if="mapState.src" />
		<template v-if="!isDisabled">
			<!-- <FinderItem v-for="(item, i) in items" :key="i" v-bind="genItem(item)" :zoom="zoom" /> -->
			<FinderCmptdItem v-for="(item, i) in items" :key="i" :disabled="isDisabled" v-bind="item" :canvas="canvasElement" :templates="cmptdTemplates" :zoom="zoom" />
		</template>
	</div>
</div>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { toFixed } from '@utils/vt-utils';
import { useTemplates } from './templates.js';
// import FinderItem from './FinderItem.vue';
import FinderCmptdItem from './FinderCmptdItem.vue';
import _ from 'lodash';

// ?expt.
import tooltip from '@views/experiments/tooltip/vt-tooltip';

export default {
	directives: {
		tooltip
	},
	components: {
		// FinderItem,
		FinderCmptdItem
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

		// ?expt. functional templates
		const templates = useTemplates(props.templates);
		const genItem = item => {
			return templates[item.template] ? _.assign(templates[item.template], item) : item;
		}
		// ?expt. computed templates
		const cmptdTemplates = computed(() => {
			return useTemplates(props.templates);
		});

		// --- properties
		const zoom = ref(1);
		const mapState = reactive({ ...props.map });
		const updateMap = state => {
			console.log('update map.', state);
			if ( typeof state === 'string' ) mapState.src = state;
			else _.assign(mapState, state);
			console.log(mapState);
		}

		// ?#expt. fit to viewport
		const fitToView = () => {
			let { clientWidth: vw, clientHeight: vh } = wrapper;
			let { width, height } = canvasState;
			console.log(vw, vh);

			let horz = toFixed(vw/width, 2), vert = toFixed(vh/height, 2);
			let minScale = Math.min(horz, vert);
			let maxScale = Math.max(horz, vert);
			console.log(minScale, maxScale);

			let stdBase = Math.sqrt(Math.pow(vw,2) + Math.pow(vh,2))*3;
			let fixBase = Math.pow(maxScale, 2);

			console.log( stdBase );
			console.log( fixBase );
			console.log( stdBase / fixBase );

			// min zoom
			zoom.value = Math.min(toFixed(vw/width, 2), toFixed(vh/height, 2));
		}

		const onMapLoad = ev => {
			let { naturalWidth, naturalHeight } = ev.target;
			canvasState.width = naturalWidth;
			canvasState.height = naturalHeight;
			disabled.value = false;

			// TODO: fit to wrapper 함수로 분할, 아래 수행이후 zoom수치 이용하여 중앙정렬
			// let { clientWidth, clientHeight } = wrapper;
			// zoom.value = Math.min(toFixed(clientWidth/naturalWidth, 2), toFixed(clientHeight/naturalHeight, 2));
			fitToView();
		}
		const onMapError = ev => {
			disabled.value = true;
			mapState.src = null;
		}
		const disabled = ref(true);
		const isDisabled = computed(() => {
			return (!mapState.src || disabled.value);
		});

		let wrapper;
		const wrapperRef = el => {
			wrapper = el;
		}
		let canvas;
		const canvasElement = ref();
		const canvasRef = el => {
			canvas = el;
			canvasElement.value = el;
		}

		// ?expt. events
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
			if ( isDisabled.value ) return;
			ev.preventDefault();

			let { width: widthState, height: heightState } = canvasState;
			// if ( widthState == null ) widthState = +toFixed(canvas.offsetWidth/zoom.value);
			// if ( heightState == null ) heightState = +toFixed(canvas.offsetHeight/zoom.value);
			console.log(widthState, heightState);

			let d = (ev.deltaY || -ev.wheelDelta || ev.detail) > 0 ? -1 : 1;
			let lastZoom = zoom.value;
			let step = 0.2;
			if ( lastZoom < 1 || ( lastZoom === 1 && d < 0 )) step /= 2;

			let remainder = +toFixed((lastZoom * 10) % (step * 10) / 10, 2);
			if ( remainder ) step = d > 0 ? step - remainder : remainder;

			let nextZoom = +toFixed(lastZoom + (d * step), 2);
			zoom.value = Math.min(Math.max(0.5 /* min */, nextZoom), 100 /* max */);

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
			else if ( top + heightState * zoom.value < limitY ) top = fixPoint(limitY - heightState * zoom.value);
			let limitX = viewWidth / 2;
			if ( left > limitX ) left = fixPoint(limitX);
			else if ( left + widthState * zoom.value < limitX ) left = fixPoint(limitX - widthState * zoom.value);

			canvasState.y = top;
			canvasState.x = left;
		}

		// --- Canvas move
		let lastX, lastY, restc;
		const onMouseDown = ev => {
			if ( isDisabled.value || ( ev.target !== canvas && ev.target !== wrapper )) return;
			let { offsetLeft, offsetTop, offsetWidth, offsetHeight } = canvas;
			let { clientWidth, clientHeight } = wrapper;
			lastX = ev.clientX;
			lastY = ev.clientY;
			restc = {
				x: offsetLeft, y: offsetTop,
				minX: ( clientWidth / 2 ) - offsetWidth >> 0,
				maxX: clientWidth / 2 >> 0,
				minY: ( clientHeight / 2 ) - offsetHeight >> 0,
				maxY: clientHeight / 2 >> 0,
			}
			document.addEventListener('mousemove', mouseMove, false);
			document.addEventListener('mouseup', mouseUp, false);
		}
		let mouseMove = ev => {
			let moveX = Math.max( Math.min( restc.x + (ev.clientX - lastX), restc.maxX ), restc.minX );
			let moveY = Math.max( Math.min( restc.y + (ev.clientY - lastY), restc.maxY ), restc.minY );
			canvas.style.left = `${moveX}px`;
			canvas.style.top = `${moveY}px`;
		}
		let mouseUp = ev => {
			// TODO: canvasState.(width/height) 지정할당
			document.removeEventListener('mousemove', mouseMove, false);
			document.removeEventListener('mouseup', mouseUp, false);
		}

		// --- Clear memory
		onBeforeUnmount(() => {
			restc = null;
			document.removeEventListener('mousemove', mouseMove, false);
			document.removeEventListener('mouseup', mouseUp, false);
		});

		return {
			genItem, // ?expt. functional templates
			cmptdTemplates, // ?expt. computed templates

			// exposure properties
			isDisabled, zoom, mapState, updateMap, onMapLoad, onMapError,
			wrapperRef, canvasElement, canvasRef,

			// ?expt. events
			canvasStyle,
			onWheel, onMouseDown,
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
	&-map {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
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

// ?expt. finder node
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