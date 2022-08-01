<template>
	<aside>
		<RouterLinkTree class="mt-4" :route="mainRoute" routeClass="vt-snb" activeClass="vt-active" />

		<!-- <ul class="vt-snb">
			<RouterLink v-for="d1 in menus" :key="d1.name" :to="d1" v-slot="{ href, route, navigate, isActive }" custom>
				<li :class="['vt-snb-d1', isActive && 'vt-active']">
					<a :href="href" @click.prevent="onMenuClick($event, route, navigate)">{{ route.meta.title }}</a>
					<transition v-if="d1.children && d1.children.length" name="menu" v-on="transitionHooks">
						<ul v-show="opened == route.name">
							<RouterLink v-for="d2 in d1.children" :key="d2.name" :to="d2" v-slot="{ href, route, navigate, isActive }" custom>
								<li :class="['vt-snb-d2', isActive && 'vt-active']">
									<a :href="href" @click.prevent="onMenuClick($event, route, navigate)">{{ route.meta.title }}</a>
								</li>
							</RouterLink>
						</ul>
					</transition>
				</li>
			</RouterLink>
		</ul> -->

		<!-- <router-link
				to="/foo"
				custom
				v-slot="{ href, route, navigate, isActive, isExactActive }"
			>
				<li
					:class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
				>
					<a :href="href" @click="navigate">{{ route.fullPath }}</a>
				</li>
			</router-link> -->

	</aside>
</template>

<script>
// import { ref, onMounted } from 'vue';
// import { useRoute } from 'vue-router';

// ?expt. for router link tree
import RouterLinkTree from '@/router/RouterLinkTree.vue';
import { useRouter } from 'vue-router';
import _ from 'lodash';

export default {
	components: { RouterLinkTree },
	props: {
		menus: {
			type: null,
			default: null
		}
	},
	setup() {
		// onMounted(() => {
		// 	console.log(props.menus);
		// });

		// const route = useRoute();
		// const opened = ref(route.matched[1] ? route.matched[1].name : null);
		// const onMenuClick = (event, route, navigate) => {
		// 	if ( route.meta.leaf ) return navigate(route.name);
		// 	opened.value = opened.value == route.name ? null : route.name;
		// }
		// const transitionHooks = {
		// 	'beforeEnter'(el) {el.style.maxHeight = '0px'},
		// 	'enter'(el) {el.style.maxHeight = `${el.scrollHeight}px`},
		// 	'afterEnter'(el) {el.style.maxHeight = null},
		// 	'beforeLeave'(el) {el.style.maxHeight = `${el.scrollHeight}px`},
		// 	'leave'(el) {el.style.maxHeight = '0px'},
		// 	'afterLeave'(el) {el.style.maxHeight = null},
		// }


		// ?expt. for router link tree
		const router = useRouter()
		const mainRoute = _.find( router.options.routes, { name: 'Main' });


		return {
			// opened, onMenuClick, transitionHooks,

			// ?expt. for router link tree
			mainRoute,
		}
	}
}
</script>

<style lang="scss">

/* Menu list transition */
// .menu {
// 	&-enter-from, &-leave-to {
// 		opacity: 0;
// 		margin: 0 !important;
// 	}
// 	&-enter-to, &-leave-from {
// 		opacity: 1;
// 	}
// 	&-enter-active, &-leave-active {
// 		transition: all 0.25s ease-in-out;
// 	}
// }
</style>