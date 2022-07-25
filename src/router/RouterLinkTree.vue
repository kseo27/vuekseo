<template>
<div :class="`${routeClass}-wrap`">
	<ul :class="routeClass">
		<RouterLinkTreeNode v-for="(link, i) in route.children" :key="i" :route="link" :depth="depth" :rootPath="rootPath"
			:routeClass="routeClass" :activeClass="activeClass" :selectedPath="selectedPath" :transHooks="transHooks"
			@link-click="onLinkClick">
		</RouterLinkTreeNode>
	</ul>
</div>
</template>

<script>
import { ref, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import RouterLinkTreeNode from './RouterLinkTreeNode.vue';
import _ from 'lodash';

export default {
	name: 'RouterLinkTree',
	// inheritAttrs: false,
	components: {
		RouterLinkTreeNode,
	},
	props: {
		route: null,
		depth: {
			type: Number,
			default: 1
		},
		rootPath: {
			type: String,
			default: '/'
		},
		routeClass: {
			type: String,
			default: 'vr-linktree'
		},
		activeClass: {
			type: String,
			default: 'vr-active'
		},
		transition: {
			type: Boolean,
			default: true
		}
	},
	setup( props ) {

		const route = useRoute();
		const selectedPath = ref('');

		const transHooks = computed(() => {
			return props.transition ? {
				'before-enter'(el) {el.style.maxHeight = '0px'},
				'enter'(el) {el.style.maxHeight = `${el.scrollHeight}px`},
				'after-enter'(el) {el.style.maxHeight = null},
				'before-leave'(el) {el.style.maxHeight = `${el.scrollHeight}px`},
				'leave'(el) {el.style.maxHeight = '0px'},
				'after-leave'(el) {el.style.maxHeight = null}
			} : {};
		});

		watchEffect(() => {
			selectedPath.value = route.path;
		});

		const onLinkClick = (ev, link, navigate) => {

			if ( link.meta.leaf ) return navigate();

			// Check if the link is selected
			let isSelected = _.startsWith(selectedPath.value, link.path);
			selectedPath.value = isSelected ? _.initial(link.path.split('/')).join('/') : link.path;
		}

		return {
			selectedPath, // for Exposure
			transHooks, onLinkClick,
		}
	}
}
</script>

<style lang="scss">
/* Menu list transition */
.vr-link {
	&-enter-from, &-leave-to {
		opacity: 0;
		margin: 0 !important;
	}
	&-enter-to, &-leave-from {
		opacity: 1;
	}
	&-enter-active, &-leave-active {
		transition: all 0.25s ease-in-out;
	}
}
</style>