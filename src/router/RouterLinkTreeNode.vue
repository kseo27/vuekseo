<template>
	<li :class="[`${routeClass}-item`, `${routeClass}-d${depth}`, isActive && activeClass]" v-if="route.meta.exposure !== false">
		<a :href="href" :class="`${routeClass}-link`" @click="onLinkClick">
			{{ route.meta.title }}
		</a>
		<transition name="vr-link" v-on="transHooks" v-if="childLinks">
			<ul :class="`${routeClass}-list`" v-show="selected">
				<RouterLinkTreeNode v-for="(link, i) in childLinks" :key="i" :route="link" :depth="depth + 1" :rootPath="rootPath"
					:routeClass="routeClass" :activeClass="activeClass" :selectedPath="selectedPath" :transHooks="transHooks"
					@link-click="onChildLinkClick">
				</RouterLinkTreeNode>
			</ul>
		</transition>
	</li>
</template>

<script>
import { computed } from 'vue';
import { useLink } from 'vue-router';
import _ from 'lodash';

export default {
	name: 'RouterLinkTreeNode',
	emits: [ 'link-click' ],
	props: {
		route: null,
		depth: Number,
		rootPath: String,
		selectedPath: String,
		routeClass: String,
		activeClass: String,
		transHooks: null,
	},
	setup( props, { emit }) {

		// const link = useLink({ to: props.route });
		const { route: linkRoute, href, isActive, navigate } = useLink({ to: props.route });
		const selected = computed(() => {
			return _.startsWith( props.selectedPath, linkRoute.value.path );
		});
		const childLinks = computed(() => {
			let children = _.filter(props.route.children, c => c.meta.exposure !== false);
			return children.length ? children : null;
		});

		const onLinkClick = ev => {
			ev.preventDefault();
			emit( 'link-click', ev, linkRoute.value, navigate );
		}
		const onChildLinkClick = (...args) => {
			emit( 'link-click', ...args );
		}

		return {
			linkRoute, href, isActive, navigate, childLinks, selected,
			onLinkClick, onChildLinkClick,
		}
	}
}
</script>

<style>

</style>