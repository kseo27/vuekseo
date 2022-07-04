<template>
- Custom Directives를 활용하여 Tooltip을 등록
 ( 참조: https://vuejs.org/guide/reusability/custom-directives.html )<!-- TODO: external link component로 구현 -->
<section class="grid mt-0">
	<div class="col-6">
		<section class="vt-box">
			<div class="vt-point vt-point-active" v-tip.toggle="'tooltip value tooltip value.'"></div>
			<div class="vt-area" v-tip.toggle="'tooltip value tooltip value.'"></div>
		</section>
	</div>
	<div class="col-6">
		<div class="vt-ref-code">
			<pre
><span class="vt-ref-fde">// --- Bind Globally in main.js</span>
import tooltip from '@/tooltipDirectiveSource.js'
app.directive('tooltip', tooltip)

<span class="vt-ref-fde">// --- Bind Locally</span>
&lt;script&gt;
import tooltip from '@/tooltipDirectiveSource.js'
export default {
	directives: {
		tooltip
	},
}
&lt;/script&gt;

<span class="vt-ref-fde">// --- Template.vue</span>
&lt;template&gt;
	&lt;div v-tooltip="value"&gt;&lt;/div&gt;
&lt;/template&gt;
			</pre>
		</div>
	</div>
</section>

<section class="vt-fig">
	<SingleRootComponent v-tip.toggle="'tooltip value tooltip value.'" v-if="isSingleRoot" />
	<MultiRootComponent v-tip.toggle="'tooltip value tooltip value.'" v-else />
</section>
<Button label="Change Component" class="mt-2" @click="isSingleRoot = !isSingleRoot" />

</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import tip from './tooltip.ext';
// import { toFixed } from '@/common/vt-utils';
import SingleRootComponent from './SingleRootComponent.vue';
import MultiRootComponent from './MultiRootComponent.vue';

export default {
	directives: { tip },
	components: {
		SingleRootComponent,
		MultiRootComponent
	},
	setup( props ) {

		const isSingleRoot = ref(true);

		return {
			isSingleRoot,
		}
	}
}
</script>

<style lang="scss" scoped>
.vt-box {
	position: relative;
	min-height: 100%;
	height: 300px;
	overflow: hidden;
}
.vt-ref-code {
	min-height: 100%;
}
.vt-fig {
	padding: 1.5rem;
	@include themify((
		'border': 1px solid box-line,
		'background-color': base-bg
	))
}
</style>

<style lang="scss">
// # expt point
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
		width: 8px;
		height: 8px;

		border-radius: 50%;
		background: currentColor;
		transform: translate(-50%, -50%);
	}
	&.vt-point-active:after {
		width: 10px;
		height: 10px;
		// border: 5px solid red;
		border: 1px solid white;
	}
	// # halo
	&.vt-point-active:before {
		content: " ";
		display: block;
		width: 10px;
		height: 10px;
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