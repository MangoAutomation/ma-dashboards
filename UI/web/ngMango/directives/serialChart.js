/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'amcharts/serial', 'jquery', 'moment-timezone', 'amcharts/plugins/export/export'],
        function(angular, AmCharts, $, moment) {
'use strict';
/**
 * @ngdoc directive
 * @name ngMango.directive:maSerialChart
 * @restrict E
 * @description
 * `<ma-serial-chart style="height: 300px; width: 100%" series-1-values="point1Values" series-1-point="point1" default-type="column">
</ma-serial-chart>`
 * - The `<ma-serial-chart>` directive allows you to create line and bar charts.
 * - Many different variations on a chart can be created by customizing the attributes.
 * - Values are provided via `<ma-point-values>`. You can provide your time range and rollup settings to
 *   `<ma-point-values>`, then pass the data to `<ma-serial-chart>`.
 * - In the attributes starting with `series-X-` you will replace `X` with the series number from 1 to 10
 * - Note, you will need to set a width and height on the element.
 * - <a ui-sref="ui.examples.charts.lineChart">View Demo</a> / <a ui-sref="ui.examples.charts.advancedChart">View Advanced Demo</a>
 *
 * @param {object[]} values Inputs an array of value objects generated by `<ma-point-values>`.
 * @param {object[]=} points Inputs an array of points from `<ma-point-query>`.
 *     ([See Example](/modules/mangoUI/web/ui/#/dashboard/examples/point-arrays/point-array-line-chart))
 * @param {object[]=} graph-options An array of graph options objects, see [AmGraph](https://docs.amcharts.com/3/javascriptcharts/AmGraph)
 * @param {string=} time-format The moment.js time format to be used in displaying timestamps on the X axis.
 * @param {string=} timezone The timezone to render the date/time in if the time-format option is specified
 * @param {string=} stack-type Stacking mode of the axis. Possible values are: `"none"`, `"regular"`, `"100%"`, `"3d"`.
 * @param {string=} default-type The type of chart used for all graphs. The possible values for chart type are
 *     `"line"`, `"smoothedLine"`, `"column"`, or `"step"`.
 * @param {string=} default-color The default color used for all graphs. Can be a color string or hex value.
 * @param {string=} default-axis The default axis used for all graphs. Can be `"right"`, `"left"`, `"right-2"`, `"left-2"`.
 * @param {string=} default-balloon-text Overides the balloon text with a specified string.
 * @param {object=} default-graph-options Default config object for the all series, see [AmGraph](https://docs.amcharts.com/3/javascriptcharts/AmGraph)
 * @param {object[]} series-X-values Inputs a values array generated by `<ma-point-values>`.
 * @param {object=} series-X-point Inputs a point object from `<ma-point-list>`.
 * @param {string=} series-X-type The type of chart used for the given series (replace `X` with series number starting with 1).
 *     The possible values for chart type are `"line"`, `"smoothedLine"`, `"column"`, or `"step"`.
 * @param {string=} series-X-color The default color used for the given series (replace `X` with series number starting with 1).
 *     Can be a color string or hex value.
 * @param {string=} series-X-axis The defaults axis used for the given series (replace `X` with series number starting with 1).
 *     Can be `"right"`, `"left"`, `"right-2"`, `"left-2"`.
 * @param {string=} series-X-balloon-text Overides the balloon text with a specified string for the given series
 *     (replace `X` with series number starting with 1).
 * @param {string=} series-X-title Sets the text in the legend for the given series (replace `X` with series number starting with 1).
 * @param {object=} series-X-graph-options Config object for the series, see [AmGraph](https://docs.amcharts.com/3/javascriptcharts/AmGraph)
 * @param {boolean=} export If set to true, chart export functionality will be turned on. Defaults to off.
 * @param {boolean=} one-balloon If set to true, display only one balloon at a time. Defaults to all graphs display balloon.
 * @param {string=} bullet Set to add bullets to values on graphs. Options are: `"circle"`, `"square"`, `"diamond"`,
 *     `"triangleUp"`, `"triangleDown"`, `"triangleLeft"`, `"triangleRight"`, `"bubble"`, `"xError"`, and `"yError"`.
 * @param {string=} custom-bullet Set to image path of a custom bullet image.
 * @param {boolean=} legend If set to true, chart's legend will be turned on. Defaults to off.
 * @param {boolean=} annotate-mode If set to true, clicking on value of a graph will open annotation dialog.
 * @param {number=} line-thickness Set to a number to increase/decrease line thickness of each graph. (Defaults to `2.0` for line
 * chart).
 * @param {function=} on-chart-init Set to function call which will be triggered by init chart event. (eg.
 * `on-chart-init="$ctrl.getChart($chart)"`)
 * @param {function=} graph-item-clicked Set to function call which will be triggered by graph click event. (eg.
 * `graph-item-clicked="$ctrl.handleChartClick($chart, $event)"`)
 * @param {object=} trend-lines Set trendlines object. (See
 * [amCharts](https://docs.amcharts.com/3/javascriptcharts/TrendLine))
 * @param {object[]=} guides Category axis guides
 *     (see [amCharts Guide](https://docs.amcharts.com/3/javascriptcharts/Guide))
 * @param {object=} options extend AmCharts configuration object for customizing design of the chart
 *     (see [amCharts](https://docs.amcharts.com/3/javascriptcharts/AmSerialChart))
 * 
 * @usage
 * <ma-serial-chart style="height: 300px; width: 100%" series-1-values="point1Values" series-1-point="point1" default-type="column">
</ma-serial-chart>`
 *
 */
serialChart.$inject = ['MA_INSERT_CSS', 'maCssInjector', 'MA_AMCHARTS_DATE_FORMATS', 'maUtil', 'MA_DATE_FORMATS', '$timeout'];
function serialChart(ngMangoInsertCss, cssInjector, MA_AMCHARTS_DATE_FORMATS, Util, mangoDateFormats, $timeout) {
	var MAX_SERIES = 10;

	var scope = {
		options: '<?',
	    timeFormat: '@',
        timezone: '@',
	    stackType: '@',
	    values: '<?',
	    points: '<?',
	    graphOptions: '<?',
	    defaultType: '@',
	    defaultColor: '@',
        defaultAxis: '@',
        defaultBalloonText: '@',
        defaultGraphOptions: '<?',
        'export': '<?',
        oneBalloon: '<?',
        legend: '<?',
        customBullet: '@',
        bullet: '@',
        annotateMode: '<?',
        lineThickness: '@',
        onChartInit: '&?',
        graphItemClicked: '&?',
        trendLines: '<?',
        guides: '<?'
	};

	for (var j = 1; j <= MAX_SERIES; j++) {
		scope['series' + j + 'Values'] = '<?';
		scope['series' + j + 'Type'] = '@';
		scope['series' + j + 'Title'] = '@';
		scope['series' + j + 'Color'] = '@';
		scope['series' + j + 'Axis'] = '@';
        scope['series' + j + 'BalloonText'] = '@';
        scope['series' + j + 'Point'] = '<?';
        scope['series' + j + 'GraphOptions'] = '<?';
	}

    return {
        restrict: 'E',
        designerInfo: {
            translation: 'ui.components.serialChart',
            icon: 'show_chart',
            category: 'pointValuesAndCharts',
            attributes: {
                defaultColor: {type: 'color'},
                series1Color: {type: 'color'},
                series2Color: {type: 'color'},
                series3Color: {type: 'color'},
                series4Color: {type: 'color'},
                series5Color: {type: 'color'},
                series6Color: {type: 'color'},
                series7Color: {type: 'color'},
                series8Color: {type: 'color'},
                series9Color: {type: 'color'},
                series10Color: {type: 'color'}
            },
            size: {
                width: '400px',
                height: '200px'
            }
        },
        scope: scope,
        compile: function() {
            if (ngMangoInsertCss) {
                cssInjector.injectLink(require.toUrl('amcharts/plugins/export/export.css'), 'amchartsExport');
            }
            return postLink;
        }
    };
    
    function postLink($scope, $element, attrs) {
        $element.addClass('amchart');
        
        var options = defaultOptions();

        if ($scope.timeFormat) {
            options.categoryAxis.parseDates = false;
        }

        if ($scope.stackType) {
            options.valueAxes[0].stackType = $scope.stackType;
        }
        
        if ($scope.legend) {
            options.legend = {
                valueWidth: 100,
                valueFunction: dataItemToText
            };
        }
        
        if ($scope['export']) {
            options['export'].enabled = true;
        }
        
        if ($scope.oneBalloon) {
            options.chartCursor = {
                oneBalloonOnly: true
            };
        }

        if ($scope.annotateMode) {
            options.chartCursor = {
                oneBalloonOnly: true,
                graphBulletSize: 2,
                zoomable: false,
                categoryBalloonDateFormat: 'h:mm:ss A - MMM DD, YYYY'
            };
            options.balloon = {
                fillAlpha: 1
            };
        }

        var valueArray = !!attrs.values;

        $.extend(true, options, $scope.options);

        var chart = AmCharts.makeChart($element[0], angular.copy(options));
        
        if ($scope.onChartInit) {
            $scope.onChartInit({$chart: chart});
        }

        chart.addListener('changed', function(event) {
            chart.lastCursorPosition = event.index;
        });
        
        if ($scope.graphItemClicked) {
            chart.addListener('clickGraphItem', function(event) {
                $scope.graphItemClicked({$chart: chart, $event: event});
            });
        }
        
        chart.addListener('drawn', function(event) {
            var columnGraphs = event.chart.graphs.filter(function(graph) {
                return graph.type === 'column' && graph.ownColumns;
            });

            var redrawNeeded = false;
            columnGraphs.forEach(function(graph) {
                var newWidth = Math.floor(graph.width / graph.ownColumns.length * 0.8);
                if (chart.categoryAxis.equalSpacing) {
                    newWidth = undefined;
                }
                
                if (newWidth !== graph.fixedColumnWidth) {
                    graph.fixedColumnWidth = newWidth;
                    redrawNeeded = true;
                }
            });

            if (redrawNeeded)
                chartValidateNow(false, true);
        });
        
        $scope.$watchCollection('trendLines', function(newValue, oldValue) {
            if (newValue === oldValue && newValue === undefined) return;
            $scope.options.trendLines = newValue;
        });

        $scope.$watch('guides', (newValue, oldValue) => {
            if (newValue === oldValue && newValue === undefined) return;
            if (!chart || !chart.categoryAxis) return;

            let guides = newValue;
            if (!Array.isArray(guides)) {
                guides = [];
            }
            // must copy the guides as amCharts turns modifies the guide objects causing infinite digest errors
            chart.categoryAxis.guides = angular.copy(guides);
            chartValidateNow();
        }, true);

        $scope.$watch('options', function(newValue, oldValue) {
            if (!newValue) return;
            
        	$.extend(true, chart, newValue);
            checkForAxisColors();
            watchPointsAndGraphs($scope.graphOptions);
        }, true);

        $scope.$watchGroup([
            'defaultType',
            'defaultColor',
            'defaultAxis',
            'defaultBalloonText',
            'defaultGraphOptions'
        ], graphOptionsChanged.bind(null, null));

        if (valueArray) {
        	$scope.$watchCollection('values', watchValues);
        	$scope.$watchCollection('points', watchPointsAndGraphs);
            $scope.$watch('graphOptions', watchPointsAndGraphs, true);
        }
        
        for (var i = 1; i <= MAX_SERIES; i++) {
            var seriesAttributes = [
                'series' + i + 'Type',
                'series' + i + 'Title',
                'series' + i + 'Color',
                'series' + i + 'Axis',
                'series' + i + 'BalloonText',
                'series' + i + 'GraphOptions'
            ];
            
            if (!valueArray) {
                seriesAttributes.push('series' + i + 'Values');
                seriesAttributes.push('series' + i + 'Point');
            }
            
            var hasSeries = false;
            for (var j = 0; j < seriesAttributes.length; j++) {
                if (!angular.isUndefined(attrs[seriesAttributes[j]])) {
                    hasSeries = true;
                    break;
                }
            }
            
            if (hasSeries) {
                $scope.$watchGroup(seriesAttributes, graphOptionsChanged.bind(null, i));
                if (!valueArray) {
                    $scope.$watchCollection('series' + i + 'Values', valuesChanged.bind(null, i));
                }
            }
        }
        
        /**
         * Debounces the calling of chart.validateNow().
         */
        let validateData;
        let skipEvents;
        let timeoutPromise;
        function chartValidateNow(_validateData, _skipEvents) {
            if (_validateData) {
                validateData = true;
            }
            if (!_skipEvents) {
                skipEvents = false;
            }
            if (_skipEvents && skipEvents === undefined) {
                skipEvents = true;
            }
            
            if (timeoutPromise) return;
            timeoutPromise = $timeout(() => {
                const localValidateData = validateData;
                const localSkipEvents = skipEvents;
                timeoutPromise = null;
                validateData = undefined;
                skipEvents = undefined;
                $scope.$applyAsync(() => {
                    //console.log(`chart.validateNow(${localValidateData}, ${localSkipEvents})`);
                    chart.validateNow(localValidateData, localSkipEvents);
                });
            }, 100, false);
        }

        function watchValues(newValues, oldValues) {
            if (newValues === oldValues && newValues === undefined) return;
            
            chart.dataProvider = newValues;
            checkEqualSpacing();
            chartValidateNow(true);
        }
        
        function checkEqualSpacing() {
            if (options.categoryAxis.equalSpacing) return;

            if (chart.dataProvider) {
                chart.categoryAxis.equalSpacing = !chart.dataProvider.map(function(dataItem, index, array) {
                    if (index === 0) return null;
                    return dataItem.timestamp - array[index - 1].timestamp;
                }).some(function(diff, index, array) {
                    if (index <= 1) return;
                    return diff !== array[index - 1];
                });
            } else {
                chart.categoryAxis.equalSpacing = true;
            }
        }

        function watchPointsAndGraphs(newValues, oldValues) {
            if (newValues === oldValues && newValues === undefined) return;
            
            if (!$scope.points && !$scope.graphOptions) {
                chart.graphs = [];
            }

        	if (newValues) {
        	    var numGraphs = $scope.points && $scope.points.length || 0;
        	    var graphOptionsLength = $scope.graphOptions && $scope.graphOptions.length || 0;
        	    if (graphOptionsLength > numGraphs) {
        	        numGraphs = graphOptionsLength;
        	    }
        	    while (chart.graphs.length > numGraphs) {
        	        chart.graphs.pop();
        	    }
        	    
            	for (var i = 0; i < newValues.length; i++) {
            		var val = newValues[i];
            		if (!val) continue;
            		setupGraph(i + 1);
            	}
        	}

        	sortGraphs();
        	chartValidateNow(true);
        }

        function findGraph(propName, prop, removeGraph) {
            for (var i = 0; i < chart.graphs.length; i++) {
                if (chart.graphs[i][propName] === prop) {
                	var graph = chart.graphs[i];
                	if (removeGraph) chart.graphs.splice(i, 1);
                	return graph;
                }
            }
        }

        function graphOptionsChanged(graphNum, values) {
        	if (isAllUndefined(values)) return;

        	if (graphNum === null) {
        	    // update all graphs
        	    for (var i = 0; i < chart.graphs.length; i++) {
        	        setupGraph(chart.graphs[i]);
        	    }
        	} else {
        	    setupGraph(graphNum);
        	}

        	sortGraphs();
        	chartValidateNow(true);
        }

        function valuesChanged(graphNum, newValues, oldValues) {
        	if (newValues === oldValues && newValues === undefined) return;

        	if (!newValues) {
        		findGraph('graphNum', graphNum, true);
        	} else  {
            	setupGraph(graphNum);
            	sortGraphs();
            }
            updateValues();
        }
        
        function getPointForGraph(graphNum) {
            var point = $scope['series' + graphNum + 'Point'];
            if (!point && $scope.points) {
                point = $scope.points[graphNum - 1];
            }
            return point;
        }

        function setupGraph(graphNum, point) {
            var graph;
            
            // first arg can be the graph itself
            if (typeof graphNum === 'object') {
                graph = graphNum;
                graphNum = graph.graphNum;
            } else {
                graph = findGraph('graphNum', graphNum);
            }
            if (!graph) {
                graph = {};
                chart.graphs.push(graph);
            }
            
        	var hardDefaults = {
        	    graphNum: graphNum,
    	        id: 'series-' + graphNum,
                valueField: 'value_' + graphNum,
                title: 'Series ' + graphNum,
                type: 'smoothedLine',
                valueAxis: 'left',
                clustered: false,
                balloonFunction: function(dataItem, graph) {
                    var valueForBalloon = dataItemToText(dataItem);
                    if ($scope.annotateMode) {
                        return dataItem.dataContext[graph.xid + 'AnnotationBalloonText'] ?
                                dataItem.dataContext[graph.xid + 'AnnotationBalloonText'] :
                                valueForBalloon;
                    } else {
                        return valueForBalloon;
                    }
                }
        	};

        	var pointDefaults;
            point = point || getPointForGraph(graphNum);
        	if (point) {
        	    pointDefaults = {
        	        xid: point.xid,
        	        valueField: 'value_' + point.xid,
        	        title: point.deviceName + ' - ' + point.name,
        	        lineColor: point.chartColour
            	};
        	    
        	    if (typeof point.amChartsGraphType === 'function') {
        	        pointDefaults.type = point.amChartsGraphType();
        	    }
        	}

            var defaultAttributes = {
                type: $scope.defaultType,
                lineColor: $scope.defaultColor,
                lineThickness: $scope.lineThickness,
                valueAxis: $scope.defaultAxis,
                bullet: $scope.bullet,
                customBullet: $scope.customBullet
            };
            
        	var attributeOptions = {
    	        title: $scope['series' + graphNum + 'Title'],
    	        type: $scope['series' + graphNum + 'Type'],
    	        lineColor: $scope['series' + graphNum + 'Color'],
                valueAxis: $scope['series' + graphNum + 'Axis'],
                balloonText: $scope['series' + graphNum + 'BalloonText']
        	};
        	
        	var graphOptions = $scope['series' + graphNum + 'GraphOptions'] ||
        	    ($scope.graphOptions && $scope.graphOptions[graphNum - 1]);

            var annotateOptions = {};

            if ($scope.annotateMode) {
                annotateOptions = {
                    labelText: '[[' + graph.xid + 'AnnotationText]]',
                    labelRotation: 0,
                    labelPosition: 'right',
                    labelOffset: 5,
                    labelColorField: graph.xid + 'AnnotationTextColor',
                    bulletSize: 10,
                    bulletSizeField: graph.xid + 'AnnotationBulletSize',
                    bulletHitAreaSize: 14,
                    bulletAlpha: 1,
                    bulletColor: 'rgba(0, 0, 0, 0)',
                    bullet: 'circle',
                    bulletField: graph.xid + 'AnnotationBullet'
                };
            }

            var opts = $.extend(true, {}, hardDefaults, pointDefaults, $scope.defaultGraphOptions,
                    defaultAttributes, attributeOptions, graphOptions, annotateOptions);

            var graphAxis;
            chart.valueAxes.some(function(axis) {
                if (axis.id === opts.valueAxis) {
                    graphAxis = axis;
                    return true;
                }
            });
            
            if (opts.balloonText)
                delete opts.balloonFunction;
            if (angular.isUndefined(opts.fillAlphas)) {
                var isStacked = graphAxis && graphAxis.stackType && graphAxis.stackType !== 'none';
                if (isStacked || opts.type === 'column') {
                    opts.fillAlphas = 0.7;
                } else {
                    opts.fillAlphas = 0;
                }
            }
            if (angular.isUndefined(opts.lineThickness)) {
                opts.lineThickness = opts.type === 'column' ? 1.0 : 2.0;
            }

            // using smoothing without equal spacing gives strange loopy lines due to bug in amCharts
            // https://stackoverflow.com/questions/45863892/random-curves-in-js-chart-line-graph-by-amcharts
            if (!chart.categoryAxis.equalSpacing && opts.type === 'smoothedLine') {
                opts.type = 'line';
            }

            $.extend(true, graph, opts);
        }
        
        function checkForAxisColors() {
              if ($scope.options && $scope.options.valueAxes) {
                  var customAxisColors = false;
                  $scope.options.valueAxes.some(function(axis, index, array) {
                      if (axis.color) {
                            // Turn on custom color mode
                            customAxisColors = true;
                            return true;
                      }
                  });
                  if (customAxisColors) {
                      $element.addClass('amcharts-custom-color');
                  } else {
                      $element.removeClass('amcharts-custom-color');
                  }
              }
        }

        function sortGraphs() {
        	chart.graphs.sort(function(a, b) {
                return a.graphNum - b.graphNum;
            });
        }

        function combine(output, newValues, valueField, point) {
            if (!newValues) return;

            for (var i = 0; i < newValues.length; i++) {
                var value = newValues[i];
                var timestamp;
                if ($scope.timeFormat) {
                    var m = $scope.timezone ? moment.tz(value.timestamp, $scope.timezone) : moment(value.timestamp);
                    timestamp = m.format($scope.timeFormat);
                } else {
                    timestamp = value.timestamp;
                }

                if (!output[timestamp]) {
                    output[timestamp] = {timestamp: timestamp};
                }
                
                if (typeof value.value === 'string') {
                    output[timestamp][valueField] = Util.parseInternationalFloat(value.value);
                    output[timestamp][valueField + '_rendered'] = value.value;
                } else {
                    output[timestamp][valueField] = value.value;
                    output[timestamp][valueField + '_rendered'] = value.rendered || Util.pointValueToString(value.value, point);
                }
            }
        }

        function updateValues() {
        	var values = $scope.timeFormat ? {} : [];

        	for (var i = 1; i <= MAX_SERIES; i++) {
        		var seriesValues = $scope['series' + i + 'Values'];

        		var point = getPointForGraph(i);
        		var valueField = 'value_' + (point ? point.xid : i);
        		
        		combine(values, seriesValues, valueField, point);
        	}

            // normalize sparse array or object into dense array
            var output = [];
            for (var timestamp in values) {
                output.push(values[timestamp]);
            }

            // XXX sparse array to dense array doesnt result in sorted array
            // manually sort here
            if (output.length && typeof output[0].timestamp === 'number') {
                output.sort(function(a,b) {
                    return a.timestamp - b.timestamp;
                });
            }

            chart.dataProvider = output;
            checkEqualSpacing();
            chartValidateNow(true);
        }

        function isAllUndefined(a) {
        	for (var i = 0; i < a.length; i++) {
        		if (a[i] !== undefined) return false;
        	}
        	return true;
        }
        
        function dataItemToText(dataItem) {
            if (dataItem.dataContext) {
                var graph = dataItem.graph;

                var value = extractField(dataItem.dataContext, graph.valueField);
                if (value) return value;
                
//                for (var i = dataItem.index - 1; i >= 0; i--) {
//                    value = extractField(chart.dataProvider[i], graph.valueField);
//                    if (value) return value;
//                }
            }
            return '';
        }
        
        function extractField(data, fieldName) {
            var rendered = data[fieldName + '_rendered'];
            if (rendered) return rendered;
            
            var value = data[fieldName];
            if (value != null) {
                return Util.pointValueToString(value);
            }
        }
    }

    function defaultOptions() {
        return {
            type: 'serial',
            theme: 'light',
            addClassNames: true,
            synchronizeGrid: true,
            valueAxes: [{
                id: 'left',
                position: 'left',
                axisThickness: 2
            },{
                id: 'right',
                position: 'right',
                axisThickness: 2
            },{
                id: 'left-2',
                position: 'left',
                offset: 50,
                axisThickness: 2
            },{
                id: 'right-2',
                position: 'right',
                offset: 50,
                axisThickness: 2
            }],
            categoryAxis: {
                parseDates: true,
                minPeriod: 'fff',
                equalSpacing: false,
                axisThickness: 0,
                dateFormats: MA_AMCHARTS_DATE_FORMATS.categoryAxis,
                firstDayOfWeek: moment.localeData(moment.locale()).firstDayOfWeek()
            },
            chartCursor: {
                categoryBalloonDateFormat: MA_AMCHARTS_DATE_FORMATS.categoryBalloon
            },
            startDuration: 0,
            graphs: [],
            plotAreaFillAlphas: 0.0,
            categoryField: 'timestamp',
            'export': {
                enabled: false,
                libs: {autoLoad: false},
                dateFormat: mangoDateFormats.iso,
                fileName: 'mangoChart'
            }
        };
    }
}

return serialChart;

}); // define
