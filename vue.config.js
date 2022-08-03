const path = require('path');
const combine = path.join.bind(null, __dirname, 'src');
const isProdMode = process.env.NODE_ENV === 'production';

module.exports = {

	/**
	 * [transpileDependencies] node_modules내 패키지 라이브러리에 babel 적용
	 * #build: export 'default' (imported as '__vue_script__') was not found...
	 * #browser: Uncaught TypeError: Cannot assign to read only property 'exports' of object '#<Object>
	 * 위 같은 에러는 트랜스파일 방식이 ES module인 웹팩에서 commonjs 방식을 혼용할 수 없어서 나타남
	 * babel.config.js의 presets: []에 ["@vue/app", {modules: "commonjs"}]추가 형태로 해결
	 */
	// transpileDependencies: ['vue-gtm'],

	/**
	 * [lintOnSave] 린트 오류나 경고를 터미널과 브라우저 오버레이로 출력
	 * 'warning'(=true): 터미널에만 린트 오류나 경고를 출력하고 컴파일 수행
	 * 'default': 실제 린트 오류를 오버레이로도 출력하고 컴파일 실패시킴
	 * 'error': 린트 오류나 경고를 모두 오류로 모두 출력
	 */
	lintOnSave: !isProdMode,

	// 빌드할 경우 디버깅을 위한 js source map을 생성, 필요없으면 꺼야 속도가 향상됨
	productionSourceMap: false,

	/**
	 * GitHub Pages 배포를 위해 다음과 같이 설정
	 * [publicPath] 리포지토리명
	 * [outputDir] github pages root 경로
	 */
	publicPath: isProdMode ? '/vue-tmpl' : '/',
	outputDir: 'docs',
	assetsDir: 'assets',

	devServer: {
		// host: '0.0.0.0',
		port: 3037,
		open: true,
		proxy: {
			[process.env.VUE_APP_API]: {
				target: process.env.VUE_APP_API_SERVER,
				// changeOrigin: true,
				pathRewrite: {
					['^' + process.env.VUE_APP_API]: ''
				}
			}
		},
		// disableHostCheck: true
	},

	configureWebpack: {
		resolve: {
			alias: {
				// '@': combine(),
				'@components': combine('components'),
				'@composables': combine('composables'),
				'@const': combine('common/constants'),
				'@services': combine('services'),
				'@store': combine('store'),
				'@utils': combine('common/utils'),
				'@views': combine('views'),
			}
		},
		optimization: {
			splitChunks: {
				// chunks: 'async',
				// chunks: 'all',
				cacheGroups: {
					// defaultVendors: {
					// 	test: /[\\/]node_modules[\\/]/,
					// 	priority: -10,
					// 	reuseExistingChunk: true,
					// },
					// default: {
					// 	minChunks: 2,
					// 	priority: -20,
					// 	reuseExistingChunk: true,
					// },
					// primevue: {
					// 	name: 'chunk-prime',
					// 	test: /[\\/]node_modules[\\/]prime(vue|flex|icons)(.*)/,
					// 	priority: 10
					// },
				},
			}
		}
	},

	/**
	 * [scss setup] $ npm install -D sass-loader@^10 sass
	 * 위와 같이 package 설치 후 아래와 같이 설정하여 사용할 scss파일을 불러옴
	 */
	css: {
		loaderOptions: {
			scss: {
				additionalData: `
					@import "~@/assets/scss/_functions.scss";
					@import "~@/assets/scss/_variables.scss";
					@import "~@/assets/scss/_mixins.scss";
				`
			}
		}
	}
}