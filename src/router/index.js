import { createRouter, createWebHashHistory, RouterView /* START_LOCATION */ } from 'vue-router'
import RouterBridge from './RouterBridge2.vue';

// * 비동기 Chunk 그룹화 주석
// import(/* webpackChunkName: "group-name" */ './Compo.vue')

const routes = [
	{
		path: '/',
		name: 'Main',
		component: () => import('@views/Main.vue'),
		redirect: '/main', // TODO: Conditional Navigation 형태로 변경
		children: [
			{
				path: 'main',
				name: 'MainContent',
				meta: { exposure: false, flexible: true, leaf: true },
				component: () => import('@views/MainContent.vue')
			},
			{
				path: 'guidance',
				name: 'Guidance',
				meta: { title: 'Vue Guidance', leaf: false },
				component: RouterView,
				children: [
					{
						path: 'sfc',
						name: 'SingleFileComponent',
						meta: { title: 'Single File Component', leaf: true },
						component: () => import('@views/basic/SingleFileComponent.vue')
					},
					{
						path: 'scope',
						name: 'Scope',
						meta: { title: 'Vue Scope', leaf: true },
						component: RouterView,
						children: []
					},
					{
						path: 'router',
						name: 'Router',
						meta: { title: 'Vue Router', leaf: true },
						component: RouterView,
						children: []
					},
				]
			},
			{
				path: 'tmpl',
				name: 'Templates',
				meta: { title: 'Templates', leaf: false },
				component: RouterView,
				children: []
			},
			{
				path: 'expt',
				name: 'Experiments',
				meta: { title: 'Experiments', leaf: false },
				component: RouterBridge,
				children: [
					{
						path: 'wheel',
						name: 'WheelEvent',
						meta: { title: 'Wheel Event', leaf: true },
						component: () => import('@views/experiments/wheel-event'),
					},
					{
						path: 'tooltip',
						name: 'Tooltip',
						meta: { title: 'Tooltip', leaf: true },
						component: () => import('@views/experiments/tooltip'),
					},
					{
						path: 'finder',
						name: 'MapFinder',
						meta: { title: 'Map Finder', leaf: true },
						component: () => import('@views/experiments/map-finder'),
					},
					{
						path: 'timer',
						name: 'VtTimer',
						meta: { title: 'VT Timer', leaf: true },
						component: () => import('@views/experiments/Timer'),
					},
				]
			},
			// {
			// 	path: 'user',
			// 	name: 'UserManagement',
			// 	meta: { title: 'User Management', leaf: false },
			// 	component: RouterView,
			// 	children: [
			// 		{
			// 			path: 'list',
			// 			name: 'UserList',
			// 			meta: { title: 'User List', leaf: true },
			// 			component: () => import('@views/Preparing.vue')
			// 		},
			// 		{
			// 			path: 'info',
			// 			name: 'UserInfo',
			// 			meta: { title: 'User Infomation', leaf: true },
			// 			component: () => import('@views/Preparing.vue')
			// 		}
			// 	]
			// },
		]
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		beforeEnter: (to, from, next) => {
			console.log(to);
			next();
		},
		component: () => import('@views/Error.vue')
	}
]

const router = createRouter({
	// linkActiveClass: 'router-link-active',
	// linkExactActiveClass: 'router-link-exact-active',

	// * GitHub Pages 배포를 위해 Hash모드 사용
	// 직접 서버에 배포 및 라우터 처리를 한다면 createWebHistory()모드 사용
	// history: createWebHashHistory(),
	history: createWebHistory(),
	routes
})

// #temp
// router.beforeEach((to, from) => {
// 	console.log('beforeEach: START_LOCATION');
// 	console.log(START_LOCATION);
// 	console.log('from === START_LOCATION', from === START_LOCATION);
// });


// ?expt. Change document title using afterEach navigation guard
import { NavigationFailureType, isNavigationFailure } from 'vue-router';

const appName = process.env.VUE_APP_NAME || document.title;

router.afterEach(( to, from, failure ) => {

	if ( !failure ) {
		console.log('[Router]: Resolved.');
		let { title } = to.meta;
		document.title = `${title ? `${title} - ` : ''}${appName}`;
		return;
	}

	if ( isNavigationFailure(failure, NavigationFailureType.aborted ) ) {
		console.log('[Router]: Aborted.');
	}
	else if ( isNavigationFailure(failure, NavigationFailureType.cancelled ) ) {
		console.log('[Router]: Cancelled.');
	}
	else if ( isNavigationFailure(failure, NavigationFailureType.duplicated ) ) {
		console.log('[Router]: Duplicated.');
	}
});

export default router