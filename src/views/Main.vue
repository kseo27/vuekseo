<template>
	<div class="vt-wrap">
		<Header />
		<Aside :menus="menuList" />
		<main>
			<div :class="['vt-content', $route.meta.flexible && 'vt-flexible']">
				<h2>{{ $route.meta.title }}</h2>
				<RouterView v-slot="{ Component }">
					<transition name="route" mode="out-in" appear>

						<component :is="Component" :key="$route.path" />

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
import { ref, onMounted } from 'vue';
import { useRouter /*, onBeforeRouteLeave, onBeforeRouteUpdate */} from 'vue-router';
// import http from '@/api';

export default {
	name: 'Home',
	components: {
		Header, Aside
	},
	beforeRouteEnter (to, from, next) {
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

		const router = useRouter();
		const menuList = ref([]);

		return {
			router, menuList
		}
	}
}
</script>

<style lang="scss">

/* Route transition */
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