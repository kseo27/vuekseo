import { onBeforeUnmount } from 'vue';

export function useTimer() {
	let tTimer, iTimer;

	const vtTimeout = (...args) => {
		clearTimeout(tTimer);
		return tTimer = setTimeout(...args);
	}
	const vtInterval = (...args) => {
		clearInterval(iTimer);
		return iTimer = setInterval(...args);
	}
	vtTimeout.clear = () => clearTimeout(tTimer);
	vtInterval.clear = () => clearInterval(iTimer);

	onBeforeUnmount(() => {
		clearTimeout(tTimer);
		clearInterval(iTimer);
	});

	return [ vtTimeout, vtInterval ];
}