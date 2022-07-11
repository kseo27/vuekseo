import _ from 'lodash/core';
import { DomHandler, ZIndexUtils, UniqueComponentId, ConnectedOverlayScrollHandler } from 'primevue/utils';

function noop() {}
function genConfig({
	modifiers, value: strValue, value: {
		value, disabled = false, escape = false, tooltipClass, viewport = null, callback = noop, props = {}
	}
}) {
	return {
		modifiers, value: value || strValue, disabled, escape, tooltipClass, viewport, callback, props
	}
}

function isDisabled({ tooltipConfig: config }) {
	return !config || !config.value || config.disabled;
}

function bindEvent(el, type, handler) {
	el.tooltipListeners[type] = handler;
	el.addEventListener(type, handler);
}
function bindEvents(el) {
	unbindEvents(el);
	const { modifiers } = el.tooltipConfig;
	if ( modifiers.focus ) {
		bindEvent(el, 'focus', onFocus);
		bindEvent(el, 'blur', onBlur);
	}
	else if ( modifiers.toggle ) {
		bindEvent(el, 'click', onToggle);
	}
	else {
		bindEvent(el, 'mouseenter', onMouseEnter);
		bindEvent(el, 'mouseleave', onMouseLeave);
		bindEvent(el, 'click', onClick);
	}
}
function unbindEvents(el) {
	_.forEach(el.tooltipListeners, (listener, type) => {
		el.removeEventListener(type, listener);
		delete el.tooltipListeners[type];
	})
}

// Event Handlers
function onFocus(ev) {
	show(ev.currentTarget);
}
function onBlur(ev) {
	hide(ev.currentTarget);
}
function onToggle(ev) {
	let tooltipElement = getTooltipElement(ev.currentTarget);
	if (tooltipElement)
		hide(ev.currentTarget);
	else
		show(ev.currentTarget);
}
function onMouseEnter(ev) {
	show(ev.currentTarget);
}
function onMouseLeave(ev) {
	hide(ev.currentTarget);
}
function onClick(ev) {
	hide(ev.currentTarget);
}

function show(el) {
	if ( isDisabled(el) ) return;
	const { modifiers, callback } = el.tooltipConfig;

	let tooltipElement = create(el);
	align(el, tooltipElement);
	callback(el); // * Callback after align
	DomHandler.fadeIn(tooltipElement, 250);

	if ( modifiers.toggle ) return;
	window.addEventListener('resize', function onWindowResize() {
		if ( !DomHandler.isTouchDevice() ) {
			hide(el);
		}
		this.removeEventListener('resize', onWindowResize);
	});

	// bindScrollListener(el);
	// ZIndexUtils.set('tooltip', tooltipElement, el.$_ptooltipZIndex);
}

function hide(el) {
	remove(el);
	// unbindScrollListener(el);
	// ZIndexUtils.clear(el);
}

function getTooltipElement(el) {
	return document.querySelector(`[vt-tooltip="${el.tooltipId}"]`);
}

function create(el) {
	const { tooltipId, tooltipConfig: { value, escape, tooltipClass, viewport }} = el;
	// const id = UniqueComponentId() + '_tooltip';
	// el.$_ptooltipId = id;

	let container = document.createElement('div');
	container.className = `p-tooltip p-component${tooltipClass ? ` ${tooltipClass}` : ''}`;
	container.setAttribute('vt-tooltip', tooltipId);

	let tooltipArrow = document.createElement('div');
	tooltipArrow.className = 'p-tooltip-arrow';
	container.appendChild(tooltipArrow);

	let tooltipText = document.createElement('div');
	tooltipText.className = 'p-tooltip-text';

	if ( escape ) {
		tooltipText.innerHTML = value;
	}
	else {
		tooltipText.innerHTML = '';
		tooltipText.appendChild(document.createTextNode(value));
	}

	container.appendChild(tooltipText);
	( viewport || document.body ).appendChild(container);

	// pre-align
	container.style.display = 'inline-block';
	container.style.left = '-9999px';
	container.style.top = '-9999px';

	// if (el.$_ptooltipFitContent) {
	// 	container.style.width = 'fit-content';
	// }

	return container;
}

function remove(el) {
	if (el) {
		let tooltipElement = getTooltipElement(el);
		if (tooltipElement && tooltipElement.parentElement) {
			tooltipElement.removeAttribute('vt-tooltip');
			tooltipElement.parentElement.removeChild(tooltipElement);
		}
	}
}

function getViewRect(el) { // * 좌표 계산은 offsetParent로 부터 이루어짐
	const { offsetParent, tooltipConfig: { viewport }} = el;
	let { top = 0, left = 0, width, height } = viewport ? offsetParent.getBoundingClientRect() : DomHandler.getViewport();
	return { width, height,
		top: top + DomHandler.getWindowScrollTop(),
		left: left + DomHandler.getWindowScrollLeft()
	};
}
function getHostRect(el, viewRect) {
	let { top, left, width, height } = el.getBoundingClientRect();
	return { width, height,
		top: top - viewRect.top,
		left: left - viewRect.left
	};
}

// function preAlign(el, tooltipElement) {
// 	tooltipElement.style.left = '-9999px';
// 	tooltipElement.style.top = '-9999px';
	// tooltipElement.className = `p-tooltip p-component p-tooltip-${position} ${el.$_ptooltipClass||''}`;
// }
function align(el, tooltipElement) {
	// preAlign(el, tooltipElement);
	const { modifiers } = el.tooltipConfig;
	const viewRect = getViewRect(el);
	const hostRect = getHostRect(el, viewRect);
	if ( modifiers.top || modifiers.bottom ) {
		alignY(el, tooltipElement, hostRect, viewRect);
	}
	else {
		alignX(el, tooltipElement, hostRect, viewRect);
	}

	if ( modifiers.left || modifiers.right ) {
		alignX(el, tooltipElement, hostRect, viewRect);
	}
}
function alignX(el, tooltipElement, hostRect, viewRect) {
	const { modifiers } = el.tooltipConfig;
	const isLeft = isOutOfXBounds(el, tooltipElement, hostRect, viewRect);

	// let { offsetWidth: width } = tooltipElement;
	// let left = hostRect.left + ( isLeft ? -width : hostRect.width );
	// tooltipElement.style.left = `${left}px`;
	if ( isLeft ) {
		tooltipElement.style.left = null;
		tooltipElement.style.right = `${viewRect.width - hostRect.left}px`;
	}
	else {
		tooltipElement.style.right = null;
		tooltipElement.style.left = `${hostRect.left + hostRect.width}px`;
	}

	if ( !modifiers.top && !modifiers.bottom ) {
		let top = hostRect.top + (hostRect.height - tooltipElement.offsetHeight) / 2;
		tooltipElement.style.top = `${top}px`;
	}
}
function alignY(el, tooltipElement, hostRect, viewRect) {
	const { modifiers } = el.tooltipConfig;
	const isTop = isOutOfYBounds(el, tooltipElement, hostRect, viewRect);

	// let { offsetHeight: height } = tooltipElement;
	// let top = hostRect.top + ( isTop ? -height : hostRect.height );
	// tooltipElement.style.top = `${top}px`;
	if ( isTop ) {
		tooltipElement.style.top = null;
		tooltipElement.style.bottom = `${viewRect.height - hostRect.top}px`;
	}
	else {
		tooltipElement.style.bottom = null;
		tooltipElement.style.top = `${hostRect.top + hostRect.height}px`;
	}

	if ( !modifiers.left && !modifiers.right ) {
		let left = hostRect.left + (hostRect.width - tooltipElement.offsetWidth) / 2;
		tooltipElement.style.left = `${left}px`;
	}
}

function isOutOfXBounds(el, tooltipElement, hostRect, viewRect) {
	const { modifiers } = el.tooltipConfig;
	let { width } = tooltipElement.getBoundingClientRect();
	if ( modifiers.left && hostRect.left >= width ) return true;
	else if ( hostRect.left + hostRect.width + width <= viewRect.width ) return false;
	console.log(hostRect.left, viewRect.width - ( hostRect.left + hostRect.width ));
	return hostRect.left > viewRect.width - ( hostRect.left + hostRect.width );
	// true: left / false: right

	// if ( isLeftMod && hostRect.left - width >= viewRect.left ) return true; // is left
	// else if ( hostRect.left + hostRect.width + width <= viewRect.left + viewRect.width ) return false // is right
	// return ( hostRect.left - viewRect.left ) > ( viewRect.left + viewRect.width ) - ( hostRect.left + hostRect.width );

	// return (targetLeft + width > viewport.width) || (targetLeft < 0) || (targetTop < 0) || (targetTop + height > viewport.height);
}
function isOutOfYBounds(el, tooltipElement, hostRect, viewRect) {
	const { modifiers } = el.tooltipConfig;
	let { height } = tooltipElement.getBoundingClientRect();
	if ( modifiers.top && hostRect.top >= height ) return true;
	else if ( hostRect.top + hostRect.height + height <= viewRect.height ) return false;
	return hostRect.top > viewRect.height - ( hostRect.top + hostRect.height );
	// true: top / false: bottom
}


// * Get target element for PrimeVue Components
function getTarget(el) {
	return DomHandler.hasClass(el, 'p-inputwrapper') ? DomHandler.findSingle(el, 'input'): el;
}

const Tooltip = {
	mounted(el, options) {
		// console.log('mounted.', options.value.viewport);
		let element = getTarget(el);
		element.tooltipId = UniqueComponentId();
		element.tooltipListeners = {};
		// element.$_ptooltipModifiers = getModifiers(options);

		if (!options.value) return;
		// else if (typeof options.value === 'string') {
		// 	element.$_ptooltipValue = options.value;
		// 	element.$_ptooltipDisabled = false;
		// 	element.$_ptooltipEscape = false;
		// 	element.$_ptooltipClass = null;
		// 	element.$_ptooltipFitContent = true;
		// }
		// else {
		// 	element.$_ptooltipValue = options.value.value;
		// 	element.$_ptooltipDisabled = options.value.disabled || false;
		// 	element.$_ptooltipEscape = options.value.escape || false;
		// 	element.$_ptooltipClass = options.value.class;
		// 	element.$_ptooltipFitContent = options.value.fitContent || true;
		// }

		// element.$_ptooltipZIndex = options.instance.$primevue && options.instance.$primevue.config && options.instance.$primevue.config.zIndex.tooltip;

		element.tooltipConfig = genConfig(options);
		bindEvents(element);
	},
	updated(el, options) {
		let element = getTarget(el);
		// element.$_ptooltipModifiers = getModifiers(options);

		if (!options.value) return element.tooltipConfig = {};
		// if (!options.value) return;
		// if (typeof options.value === 'string') {
		// 	element.$_ptooltipValue = options.value;
		// 	element.$_ptooltipDisabled = false;
		// 	element.$_ptooltipEscape = false;
		// 	element.$_ptooltipClass = null;
		// }
		// else {
		// 	element.$_ptooltipValue = options.value.value;
		// 	element.$_ptooltipDisabled = options.value.disabled || false;
		// 	element.$_ptooltipEscape = options.value.escape || false;
		// 	element.$_ptooltipClass = options.value.class;
		// }

		element.tooltipConfig = genConfig(options);
		bindEvents(element);
	},
	beforeUnmount(el) {
		let element = getTarget(el);
		remove(element);
		unbindEvents(element);

		delete element.tooltipId;
		delete element.tooltipListeners;
		delete element.tooltipConfig;

		// if (element.$_ptooltipScrollHandler) {
		// 	element.$_ptooltipScrollHandler.destroy();
		// 	element.$_ptooltipScrollHandler = null;
		// }

		// ZIndexUtils.clear(el);
	},
};

export { Tooltip as default };