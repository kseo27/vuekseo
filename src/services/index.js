import axios from 'axios';
import { onBeforeUnmount } from 'vue';

// Create axios instance
const apiInstance = axios.create({
	baseURL: process.env.VUE_APP_API || '/',
});

// Interceptor
apiInstance.interceptors.request.use(
	function (config) {
		// 요청 성공 직전 호출됩니다.
		// axios 설정값을 넣습니다. (사용자 정의 설정도 추가 가능)
		// config.headers["Content-Type"] = "application/json; charset=utf-8";
		// config.headers["Authorization"] = " 토큰 값";
		return config;
	},
	function (error) {
		console.log('[request-interceptor]: ', error);
		return Promise.reject(error);
	}
);
apiInstance.interceptors.response.use(
	function (response) {
		// return response.data.data;
		return response;
	},
	function (error) {
		// errorController(error);
		console.log('[response-interceptor]: ', error);
		return Promise.reject(error);
	}
);

export const copyInstance = ( instance, config ) => {
	const cloneInstance = instance.create(config);
	instance.interceptors.request.handlers.forEach(h => {
		if ( h.fulfilled || h.rejected ) {
			cloneInstance.interceptors.request.use(h.fulfilled, h.rejected, h.runWhen);
		}
	});
	instance.interceptors.response.handlers.forEach(h => {
		if ( h.fulfilled || h.rejected ) {
			cloneInstance.interceptors.response.use(h.fulfilled, h.rejected, h.runWhen);
		}
	});
	return cloneInstance;
}

export const useApiRequest = ( extConfig = {} ) => {
	const source = axios.CancelToken.source();
	const $clone = copyInstance(apiInstance, {cancelToken: source.token, ...extConfig});

	onBeforeUnmount(() => {
		source.cancel('Request canceled.');
	})

	return $clone;
}

export default apiInstance;