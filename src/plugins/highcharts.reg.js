import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import stockModule from 'highcharts/modules/stock';
// import accessibilityModule from 'highcharts/modules/accessibility';
import exportingModule from 'highcharts/modules/exporting';
import noDataModule from 'highcharts/modules/no-data-to-display';

// List of generated modules: https://github.com/kirjs/publish-highcharts-modules/blob/master/modules.md
// ? Requirements
import highchartsMore from 'highcharts/highcharts-more';
import dataModule from 'highcharts/modules/data';
import boostModule from 'highcharts/modules/boost';
import drilldownModule from 'highcharts/modules/drilldown';

Highcharts.setOptions({
	// options here
	credits: { enabled: false },
	accessibility: { enabled: false }, // 접근성 관련 속성. 끄려면 accessibilityModule 바인딩 해제
	lang: {
		thousandsSep: '\u002C', // 천 단위 구분 기호
	},
	chart: {
		height: '56%',
		// spacing: [10, 5, 5, 5]
		spacingBottom: 5,
	},
	xAxis: {
		dateTimeLabelFormats: {
			// millisecond: '%H:%M:%S.%L',
			// second: '%H:%M:%S',
			// minute: '%H:%M',
			// hour: '%H:%M',
			day: '%Y-%m-%d', // day: '%e. %b',
			// week: '%e. %b',
			// month: '%b \'%y',
			// year: '%Y'
		}
	},
	// Default: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
	colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
});

const HighchartsInstallation = {
	install: (app) => {
		stockModule(Highcharts);
		// accessibilityModule(Highcharts);
		exportingModule(Highcharts);
		noDataModule(Highcharts);
	
		// ? Requirements
		// highchartsMore(Highcharts);
		// dataModule(Highcharts);
		// boostModule(Highcharts);
		// drilldownModule(Highcharts);
	
		app.use(HighchartsVue, { tagName: 'Chart' });
	}
};

export default HighchartsInstallation;