<template>
	<div class="vt-wrap">
		<Header />
		<Aside :menus="menuList" />
		<main>
			<div :class="['vt-content', flexible]">
				<transition name="title" mode="out-in" appear>
					<h2 :key="title" v-if="title">{{ title }}</h2>
					<span v-else></span>
				</transition>
				<RouterView v-slot="{ Component }">
					<transition name="route" mode="out-in" @enter="onEnter" appear>
						<!-- 같은 TagName을 가진 엘리먼트 사이 트랜지션할 때, 고유 한 `key`속성 부여 -->
						<article :class="flexible" :key="$route.path">
							<component :is="Component" />
						</article>

						<!-- <component :is="Component" :key="$route.path" /> -->

						<!-- * Suspense 사용 시 비동기식 컴포넌트로 작용하여 Dom정보에 바로 접근할 수 없음 -->
						<!-- 
						<Suspense>
							<template #default>
								<component :is="Component" :key="$route.path" />
							</template>
							<template #fallback> Loading... </template>
						</Suspense>
						-->
					</transition>
				</RouterView>
			</div>
		</main>
	</div>
</template>

<script>
import Header from '@components/main/Header.vue';
import Aside from '@components/main/Aside.vue';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter /*, onBeforeRouteLeave, onBeforeRouteUpdate */} from 'vue-router';
// import http from '@/api';

export default {
	name: 'Home',
	components: {
		Header, Aside
	},
	beforeRouteEnter (to, from, next) {

		// TODO: entry point(to.path)가 '/'일때 마지막으로 방문한 페이지로 redirect.
		console.log('[Main]: Entry point.', `'${to.path}'`);

		next(vm => { // access to component public instance via `vm`
			const homeRoute = vm.router.options.routes[0];
			vm.menuList = homeRoute ? homeRoute.children : [];
		})
	},
	setup() {
		onMounted(async () => {
			// try {
			// 	const res = await http.get('/test/service')
			// 		// .then(res => {
			// 		// 	console.log('success', res);
			// 		// })
			// 		// .catch(err => {
			// 		// 	console.log('failed', err);
			// 		// })
			// 	;
			// 	console.log(res);
			// } catch(err) {
			// 	console.log(err.toJSON());
			// 	console.log(Object.keys(err));
			// }

		})

		const route = useRoute();
		const router = useRouter();
		const menuList = ref([]);

		const flexible = ref(null);
		const onEnter = () => {
			flexible.value = route.meta.flexible ? 'vt-flexible' : null;
		}

		return {
			router, menuList,
			title: computed(() => route.meta.title),
			flexible, onEnter,
		}
	}
}
</script>

<style lang="scss">

/* Route transition */
.title {
	// &-enter-from { opacity: 0; }
	&-enter-active { transition: all 0.25s ease-out; }
	// &-leave-to { opacity: 0; }
	&-leave-active { transition: all 0.3s ease-in; }
}
.route {
	&-enter-from {
		opacity: 0;
		transform: translateX(20px);
	}
	&-enter-active {
		transition: all 0.25s ease-out;
	}
	&-leave-to {
		opacity: 0;
		transform: translateX(-20px);
	}
	&-leave-active {
		transition: all 0.3s ease-in;
	}
}
</style>