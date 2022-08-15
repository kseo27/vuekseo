<template>
<h3 class="vt-heading">COVID-19</h3>
<p>- COVID19 API 
 ( 참조: https://covid19api.com )</p><!-- TODO: external link component로 구현 -->
<section class="grid mt-0">
	<div class="col-6 flex align-items-center">
		<Chart constructorType="stockChart" class="w-12" :options="chartOpts" :callback="onChartLoaded" />
	</div>
	<div class="col-6">
		<div class="vt-ref-code h-full">
			<pre
><span class="vt-ref-fde">// --- COVID19 API Request</span>
&lt;script&gt;
import axios from 'axios';

axios.get('https://api.covid19api.com/country/korea-south/status/confirmed', {
	params: {
		from: '{{ params.from }}',
		to:   '{{ params.to }}'
	}
})
.then((res) => {
	console.log(JSON.stringify(response.data));
})
.catch((err) => {
	console.log(error);
});
&lt;/script&gt;
			</pre>
		</div>
	</div>
</section>

</template>

<script>
import { ref, reactive } from 'vue';
import { useApiRequest } from '@services';

export default {
	setup() {

		const apiReq = useApiRequest({ baseURL: '/' });
		const params = reactive({ from: null, to: null });
		let date = new Date();
		let convert = d => d.toJSON().replace(/T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, 'T00:00:00Z');
		params.to = convert(date);
		date.setDate(date.getDate() - 8);
		params.from = convert(date);

		apiReq.get('https://api.covid19api.com/country/korea-south/status/confirmed', { params })
			.then(({ data }) => {
				let cases = [], newCases = [];
				if ( Array.isArray(data) ) {
					data.reduce((prv, cur, idx) => {
						if ( idx === 1 ) {
							chartOpts.value.plotOptions.series.pointStart = new Date(cur.Date).getTime();
						}
						let increment = cur.Cases - prv.Cases;
						if ( idx > 7 && increment === 0 ) return cur;
						cases.push(cur.Cases);
						newCases.push(increment);
						return cur;
					});
				}
				chartOpts.value.series = [
					{ type: 'column', yAxis: 0, name: '신규 확진자', data: newCases },
					{ type: 'line', yAxis: 1, name: '누적 확진자', data: cases }
				]
			});

		const onChartLoaded = inst => {
			// console.log(inst);
		}

		const chartOpts = ref({
			chart: {
				height: '70%',
				// marginTop: 40,
				spacingTop: 35,
			},
			colors: ['#ff3150', '#1c41d1'],
			rangeSelector: { enabled: false },
			exporting: { enabled: false },
			navigator: { enabled: false },
			scrollbar: { enabled: false },
			xAxis: {
				dateTimeLabelFormats: {
					day: '%m-%d'
				}
			},
			yAxis: [{
				labels: { y: 3 },
				tickWidth: 1,
				lineWidth: 1,
				opposite: false,
				showLastLabel: true,
				// showFirstLabel: false
			}, {
				labels: { align: 'right', x: -3, y: -4 },
				min: 0,
				minPadding: 1,
				showLastLabel: true,
			}],
			legend: {
				enabled: true,
				margin: 10,
				symbolRadius: 0
			},
			plotOptions: {
				series: {
					// showInLegend: false,
					// label: { connectorAllowed: true },
					// pointStart: new Date().getTime(),
					// pointInterval: 3600 * 1000, // hourly data
					pointIntervalUnit: 'day',
				},
			},
			series: [
				// { type: 'column', name: 'Series 1', data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175] },
				// { type: 'line', name: 'Series 2', data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111] }
			]
		});
		const chartOptions = ref({
			chart: {
				height: '65%',
				events: {
					click(ev) {
						let points = this.getSelectedPoints();
						if ( !points.length ) return;
						points.forEach( point => {
							point.select( false );
							point.series.select( false );
							point.series.drawDataLabels();
						});
					}
				}
			},
			yAxis: {
				labels: { y: 3 },
				tickWidth: 1,
				lineWidth: 1,
				opposite: false,
				showLastLabel: true,
			},
			legend: {
				enabled: true,
				layout: 'proximate',
				align: 'right',
				verticalAlign: 'middle',
			},
			navigator: {
				adaptToUpdatedData: false,
				// maskInside: false,
			},
			tooltip: { enabled: false },

			plotOptions: {
				series: {
					// showInLegend: false,
					label: {
						connectorAllowed: true
					},
					pointStart: 2010
				},
				line: {
					className: 'ehc-line',
					allowPointSelect: false, // Custom event 처리를 위해 false로 설정
					stickyTracking: false,
					dataLabels: {
						enabled: true,
						style: { fontSize: 12, fontWeight: 500, pointerEvents: 'none' },
						color: '#333333',
						formatter(options) { // this: label, options: label options
							if ( !this.point.selected ) return undefined;
							return `${this.series.name} asdfasdf`;
						},
					},
					states: {
						hover: { lineWidthPlus: 0 },
						inactive: { enabled: false },
					},
					events: {
						// click(ev) {},
					},
					point: {
						events: {
							// graph.addClass 이용하여 select 기능 구현
							click(ev) {
								let nv = !this.selected;
								let series = this.series;
								this.select( nv );
								if ( !nv ) this.setState( 'hover' );

								let selectedSeries = this.series.chart.getSelectedSeries();
								selectedSeries.forEach( item => {
									// * sync dataLabels
									if ( item === series ) item.select( nv );
									else item.select( false );
									item.drawDataLabels();

									// * async dataLabels
									// if ( item === series ) {
									// 	item.select( nv );
									// } else {
									// 	item.select( false );
									// 	item.drawDataLabels();
									// }
								});
							},
							select(ev) {
								let series = this.series;
								series.select( true );
								series.chart.series.forEach( item => {
									if ( !item.group.hasClass('ehc-line') ) return;
									item.graph.addClass( item === series ? 'ehc-selected' : 'ehc-inactive' );
									item.graph.removeClass( item === series ? 'ehc-inactive' : 'ehc-selected' );
								});

								// * Set Data Label formatter
								let timestemp = new Date().getTime();

								// * sync dataLabels
								series.options.dataLabels.formatter = function() {
									if ( !this.point.selected ) return undefined;
									return `${this.series.name} ${timestemp}.`
								};

								// * async dataLabels
								// setTimeout(() => {
								// 	series.options.dataLabels.formatter = function() {
								// 		if ( !this.point.selected ) return undefined;
								// 		return `${this.series.name} ${timestemp}.`
								// 	};
								// 	series.drawDataLabels();
								// }, 100);
							},
							unselect(ev) {
								let points = this.series.chart.getSelectedPoints();
								if ( points.length ) return;
								this.series.graph.removeClass('ehc-selected');
								this.series.chart.series.forEach( item => {
									if ( !item.group.hasClass('ehc-line') ) return;
									item.graph.removeClass('ehc-inactive');
								});
								// this.series.drawDataLabels();
							}
						}
					},
					marker: {
						enabled: true,
						symbol: 'circle',
						radius: 0.1,
						states: {
							normal: { animation: { duration: 50 }},
							hover: {
								radius: 4
							},
							select: {
								animation: { duration: 50 },
								radius: 5,
								fillColor: 'red',
								lineWidth: 2,
								// lineColor: 'red',
							}
						}
					},
					showInNavigator: true,
					navigatorOptions: {
						type: 'line'
					}
				}
			},

			series: [
				{ name: 'Series 1', data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175] },
				{ name: 'Series 2', data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434] },
				{ name: 'Series 3', data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387] },
				{ name: 'Series 4', data: [null, null, 37988, 42169, 45112, 52452, 64400, 64227] },
				{ name: 'Series 5', data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111] }
			],
		});


		return {
			params,
			chartOpts, chartOptions, onChartLoaded,
		}
	}
}
</script>

<style lang="scss">
.vt-heading:before {
	content: " ";
	display: inline-block;
	width: 0;
	height: 0.8em;
	margin: 0 0.6em 0.1em 0;
	border-left: 0.5em solid;
	vertical-align: bottom;
}
</style>