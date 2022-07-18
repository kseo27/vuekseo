import _ from 'lodash';

export default function useTemplates( extraTemplates ) {
	const templates = {
		point: {
			width: 8,
			zoomable: false,
			events: {
				click(ev) {
					ev.stopPropagation();
					console.log('point click.');
				}
			}
		},
		area: {
			width: 50,
			events: {
				click(ev) {
					ev.stopPropagation();
					console.log('area click.');
				},
				mouseenter() {
					console.log('area hover.');
				}
			}
		}
	}

	return _.assign( templates, extraTemplates );
}