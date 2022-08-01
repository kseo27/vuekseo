<template>
<section class="vt-box mt-4" @wheel.prevent="onWheel" @mousedown.prevent="onMousedown">
	<div class="status">
		wheel event area [ zoom: {{ zoom }} ]
	</div>

	<div :ref="canvasRef" class="canvas">
		<Item v-for="item in items" :key="item" :layout="item" :zoom="zoom" />
	</div>
</section>
<Button label="add item" class="my-3" @click="addItem" />
<Button label="point active" class="my-3" @click="pointActive" />
<section style="height: 1500px;">Section for Scrollbar</section>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { toFixed } from '@/common/utils/vt-utils';
import Item from './WheelEventItem.vue';

export default {
	components: {
		Item
	},
	props: {
		precision: null, // 좌표의 소수점 정밀도
		canvas: {
			type: Object,
			default: () => ({
				width: null,
				height: null,
			})
		}
	},
	setup( props ) {

		// ?expt. add component
		const fixedPoint = value => toFixed( value, props.precision );
		const items = ref([]);
		const addItem = ev => {
			let canvas = canvasRef.value;
			console.log(canvas.offsetHeight * Math.random() >> 0, canvas.offsetWidth * Math.random() >> 0);
			items.value.push({
				width: 100, height: 60,
				// top: canvas.offsetHeight * Math.random() >> 0,
				// left: canvas.offsetWidth * Math.random() >> 0,
				top: 120,
				left: 320,
			});
		}
		let activated = false;
		const pointActive = ev => {
			document.querySelectorAll('.vt-point').forEach(el => {
				el.classList.toggle('vt-point-active', (activated = !activated));
			})
		}


		const zoom = ref(1);
		let canvas;
		let canvasSize;
		const canvasRef = el => {
			console.log('canvasRef.', el);
			canvas = el;
			if ( !el ) canvasSize = null;
		}
		// const canvasRef = ref();

		onMounted(() => {
			// let canvas = canvasRef.value;
			console.log('canvas mounted.', canvas);
			canvasSize = {
				width: canvas.offsetWidth,
				height: canvas.offsetHeight,
			}
			// console.log(canvasRef.value.offsetParent);

			// ?expt. add component
			items.value.push({ width: 100, height: 60 });
		});
		onBeforeUnmount(() => {
			console.log('canvas unmounted.');
			canvasSize = null;
			document.removeEventListener('mousemove', mouseMove, false);
			document.removeEventListener('mouseup', mouseUp, false);
		});


		const onWheel = ev => {

			// let canvas = canvasRef.value;
			if ( !canvas ) return;

			let d = (ev.deltaY || -ev.wheelDelta || ev.detail) > 0 ? -1 : 1;
			zoom.value += d * 0.25; // 배율 단계

			// Restriction arrangement
			// let minRatio = +toFixed( Math.min(parent.offsetWidth / canvasSize.width, parent.offsetHeight / canvasSize.height) );
			let minRatio = 0;

			// Zoom Restriction (최소: 0.25배, 최대: 4배)
			zoom.value = Math.min(Math.max(.5, minRatio, zoom.value), 4);


			// zoom으로 인한 canvas 사이즈 변화가 더이상 없을때
			if ( canvas.offsetWidth == +toFixed( canvasSize.width * zoom.value )) return;


			// Apply
			// ev.target.style.transform = `scale(${scale})`;

			// ?expt. mouse position
			// let rect = parent.getBoundingClientRect();
			// let mouseX = +toFixed(ev.clientX - rect.left);
			// let mouseY = +toFixed(ev.clientY - rect.top);


			// let { offsetTop: top, offsetLeft: left } = canvas;
			// let { offsetWidth: width, offsetHeight: height } = parent;

			// // top *= zoom.value;
			// // left *= zoom.value;

			// let { offsetWidth, offsetHeight } = parent;
			// let incrementX = offsetWidth * (zoom.value - 1); // zoom에 따른 width 증가분
			// let incrementY = offsetHeight * (zoom.value - 1); // zoom에 따른 height 증가분
			// // left -= (incrementX * (mouseX / offsetWidth) >> 0);
			// // top -= (incrementY * (mouseY / offsetHeight) >> 0);
			// top = -(incrementY * (mouseY / offsetHeight) >> 0);
			// left = -(incrementX * (mouseX / offsetWidth) >> 0);


			// ?expt. zoom & mouse position
			let rect = canvas.getBoundingClientRect();
			// let mouseX = +toFixed(ev.clientX - rect.left);
			// let mouseY = +toFixed(ev.clientY - rect.top);
			let mouseX = ev.clientX - rect.left;
			let mouseY = ev.clientY - rect.top;
			let { offsetTop: top, offsetLeft: left } = canvas;
			let { offsetWidth: width, offsetHeight: height } = canvas;
			// let incrementX = offsetWidth * (zoom.value - 1); // zoom에 따른 width 증가분
			// let incrementY = offsetHeight * (zoom.value - 1); // zoom에 따른 height 증가분
			let incrementX = (canvasSize.width * zoom.value) - width; // zoom에 따른 width 증가분
			let incrementY = (canvasSize.height * zoom.value) - height; // zoom에 따른 height 증가분
			// top -= (incrementY * (mouseY / height) >> 0);
			// left -= (incrementX * (mouseX / width) >> 0);
			top -= fixedPoint(incrementY * (mouseY / height));
			left -= fixedPoint(incrementX * (mouseX / width));

			console.log(canvasSize, top, left);

			// Position Restriction
			let parent = canvas.offsetParent;
			let limitY = parent.offsetHeight / 2;
			if ( top > limitY ) top = fixedPoint(limitY);
			else if ( top + canvasSize.height * zoom.value < limitY ) top = fixedPoint(limitY - canvasSize.height * zoom.value);
			let limitX = parent.offsetWidth / 2;
			if ( left > limitX ) left = fixedPoint(limitX);
			else if ( left + canvasSize.width * zoom.value < limitX ) left = fixedPoint(limitX - canvasSize.width * zoom.value);

			canvas.style.cssText = `top:${top}px;left:${left}px;
				width:${zoom.value*100}%;height:${zoom.value*100}%;`
		}


		let lastX, lastY, movepos;
		const onMousedown = ev => {
			// let canvas = canvasRef.value;
			let { offsetLeft, offsetTop, offsetParent: parent } = canvas;
			console.log('canvas mousedown.',canvasSize, offsetLeft, offsetTop, parent);
			lastX = ev.clientX;
			lastY = ev.clientY;
			movepos = {
				x: offsetLeft, y: offsetTop,
				minX: ( parent.offsetWidth / 2 ) - ( canvasSize.width * zoom.value ) >> 0,
				maxX: parent.offsetWidth / 2 >> 0,
				minY: ( parent.offsetHeight / 2 ) - ( canvasSize.height * zoom.value ) >> 0,
				maxY: parent.offsetHeight / 2 >> 0,
			}
			document.addEventListener('mousemove', mouseMove, false);
			document.addEventListener('mouseup', mouseUp, false);
		}
		const mouseMove = ev => {
			// let canvas = canvasRef.value;
			let moveX = Math.max( Math.min( movepos.x + (ev.clientX - lastX), movepos.maxX ), movepos.minX );
			let moveY = Math.max( Math.min( movepos.y + (ev.clientY - lastY), movepos.maxY ), movepos.minY );
			// let moveY = offsetTop + (clientY - lastY);
			console.log(moveX, moveY);
			canvas.style.left = `${moveX}px`;
			canvas.style.top = `${moveY}px`;
		}
		const mouseUp = ev => {
			document.removeEventListener('mousemove', mouseMove, false);
			document.removeEventListener('mouseup', mouseUp, false);
		}


		return {
			canvasRef, zoom, onWheel, onMousedown,

			// ?expt. mouse position
			items, addItem, pointActive
		}
	}
}
</script>

<style lang="scss" scoped>
.vt-box {
	position: relative;
	height: 300px;
	overflow: hidden;
}
.status {
	position: absolute;
	top: 20px;
	left: 20px;
	z-index: 1;
}
.canvas {
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
</style>

<style lang="scss">
// ?expt. point
.vt-point {
	color: lightseagreen;

	position: absolute;
	top: 20%;
	left: 20%;
	width: 0;
	height: 0;
	// transform: translate(-50%, -50%);

	// # point
	&:after {
		content: " ";
		position: absolute;
		top: 0;
		left: 0;
		width: 10px;
		height: 10px;

		border-radius: 50%;
		background: currentColor;
		transform: translate(-50%, -50%);
	}
	&.vt-point-active:after {
		width: 12px;
		height: 12px;
		// border: 5px solid red;
		border: 1px solid white;
	}
	// # halo
	&.vt-point-active:before {
		content: " ";
		display: block;
		width: 12px;
		height: 12px;
		background: currentColor;
		border-radius: 50%;
		transform: translate(-50%, -50%) scale(0);
		pointer-events: none;

		// animation: vt-ripple 0.75s linear infinite;
		animation: vt-point-ripple 0.75s ease-out infinite;
	}
}
@keyframes vt-point-ripple {
	50% {
		opacity: 0.75;
	}
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(2.5);
    }
}


// background: rgba(32, 178, 170, .4);
.vt-area {
	color: lightseagreen;

	position: absolute;
	top: 70%;
	left: 70%;
	width: 50px;
	height: 50px;
	// border: 1px dashed currentColor;
	border-radius: 50%;
	overflow: hidden;
	transform: translate(-50%, -50%);
	// # offsetLeft는 transform 적용전 위치값을,
	// DomRect는 transform 적용된 상태의 위치를 반환.

	// # area
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

		border: 1px dashed currentColor;
	}

	// &.vt-area-active:after {
	// 	width: 12px;
	// 	height: 12px;
	// 	// border: 5px solid red;
	// 	border: 1px solid white;
	// }

	// # halo
	// &.vt-area-active:before {
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