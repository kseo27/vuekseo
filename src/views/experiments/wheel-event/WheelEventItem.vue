<template>
	<div ref="item" class="we-item" :style="itemStyle" @mousedown="onMousedown">
		wheel event item
		<div class="vt-point"></div>
		<div class="vt-area"></div>
	</div>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';

export default {
	props: {
		layout: {
			type: Object,
			default: () => ({
				width: 80,
				height: 50,
			})
		},
		zoom: {
			type: Number,
			default: 1
		},
	},
	setup(props) {
		const item = ref();
		const status = reactive({ ...props.layout });
		const itemStyle = computed(() => {
			let { top, left, width, height } = status;

			// # expt mouse position
			// top *= props.zoom;
			// left *= props.zoom;

			return `top:${top*props.zoom}px;left:${left*props.zoom}px;
				width:${width*props.zoom}px;height:${height*props.zoom}px`;

			// if ( parent && props.mouse.x ) {
			// 	// let adj = (left - props.mouse.x) * props.zoom;
			// 	// left += adj;
			// 	let { offsetWidth, offsetHeight } = parent;

			// 	let incrX = offsetWidth * (props.zoom - 1); // zoom에 따른 증가분
			// 	let incrY = offsetHeight * (props.zoom - 1); // zoom에 따른 증가분
			// 	left -= (incrX * (props.mouse.x / offsetWidth) >> 0);
			// 	top -= (incrY * (props.mouse.y / offsetHeight) >> 0);
				
			// 	// console.log(increment, ratio, adjX);

			// 	// left += adjX;

			// 	// TODO: 위치값을 누적하려면 layout값 업데이트
			// 	// emit('update:layout', { top, left, width... })
			// }

		});

		let parent;
		onMounted(() => {
			console.log('item mounted.', parent);
			parent = item.value.offsetParent;
			console.log(item.value.offsetTop);
			if ( !props.layout.top ) status.top = parent.offsetHeight / 2 - item.value.offsetHeight;
			if ( !props.layout.left ) status.left = parent.offsetWidth / 2 - item.value.offsetWidth;
		});
		onBeforeUnmount(() => {
			parent = null;
		});

		// # expt mousedown captureing
		const onMousedown = ev => {
			console.log('item mousedown.');
			ev.preventDefault();
			ev.stopPropagation();
		}

		return {
			item, itemStyle,
			// # expt mousedown captureing
			onMousedown,
		}
	}
}
</script>

<style scoped>
.we-item {
	position: absolute;
	border: 1px solid #ddd;
}
</style>