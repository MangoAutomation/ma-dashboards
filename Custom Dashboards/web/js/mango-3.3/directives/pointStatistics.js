/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular', 'moment-timezone'], function(angular, moment) {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maPointStatistics
 * @restrict E
 * @description
 * `<ma-point-statistics point="myPoint" from="from" to="to" statistics="statsObj"></ma-point-statistics>`
 * - The `<ma-point-statistics>` directive provides access to historical stats over a time range on a data point.
 * - The object returned by the `statistics` attribute contains `first`, `last`, `minimum`, `maximum`, `average`, `integral`, `sum`, & `count` properties.
 Each of these will have a `value` and a `timestamp`.
 * - If you are interested only in the change in a value between two times you can add the optional `first-last="true"` attribute to only return the first and last values,
 then simply calculate the difference with `{{ statsObj.last.value - statsObj.first.value }}`.
 * - <a ui-sref="dashboard.examples.statistics.getStatistics">View Demo</a>
 *
 * @param {object} point Inputs a `point` object from `<ma-point-list>`.
 * @param {object} from Sets the starting time for the time range which is used in the statistical query.
 * @param {object} to Sets the ending time for the time range which is used in the statistical query.
 * @param {object} statistics Outputs the object containg the statistcal information. The object will contain the following properties:
 <ul>
    <li>`first`</li>
    <li>`last`</li>
    <li>`minimum`</li>
    <li>`maximum`</li>
    <li>`average`</li>
    <li>`integral`</li>
    <li>`sum`</li>
    <li>`count`</li>
 </ul>
 Each of these will have a value and a timestamp.
 * @param {boolean=} first-last If you are only interested in calculating the delta value, setting this to `true` will
 run a more efficient query and only return `first` and `last` properties on the `statistics` object.
 * @param {array=} points Alternatively you can input an array of points from `<ma-point-query>`. If used the `statistics` object will output an array.
 * @param {string=} point-xid Alternatively you can pass in the `xid` of a point to use.
 * @param {string=} date-format If you are passing in `to/from` as strings, then you must specify the moment.js format for parsing the values.
 * @param {number=} timeout If provided you can set the timeout (in milliseconds) on the querying of of the statistical provider.
 If not supplied the Mango system default timeout will be used.
 *
 * @usage
 * <ma-point-statistics point="myPoint" from="from" to="to" statistics="statsObj">
 </ma-point-statistics>
 The average for the period is {{ statsObj.average.value }} at {{ statsObj.average.timestamp | moment:'format':'lll' }}
 *
 */
pointValues.$inject = ['Point', 'Util', '$q', 'statistics'];
function pointValues(Point, Util, $q, statistics) {
    return {
        restrict: 'E',
        scope: {
            point: '=?',
            points: '=?',
            pointXid: '@',
            statistics: '=',
            from: '=?',
            to: '=?',
            dateFormat: '@',
            firstLast: '@',
            timeout: '=',
            rendered: '='
        },
        link: function ($scope, $element, attrs) {
            var pendingRequest = null;
        	var stats = {};
            var singlePoint = !attrs.points;

            $scope.$watch('pointXid', function() {
                if (!$scope.pointXid || $scope.point) return;
                $scope.point = Point.get({xid: $scope.pointXid});
            });

            $scope.$watch('point.xid', function(newValue, oldValue) {
            	$scope.points = [$scope.point];
            });

            $scope.$watch(function() {
            	var xids = [];
            	if ($scope.points) {
	            	for (var i = 0; i < $scope.points.length; i++) {
	            		if (!$scope.points[i]) continue;
	            		xids.push($scope.points[i].xid);
	            	}
            	}

            	return {
            		xids: xids,
                    from: moment.isMoment($scope.from) ? $scope.from.valueOf() : $scope.from,
                    to: moment.isMoment($scope.to) ? $scope.to.valueOf() : $scope.to
            	};
            }, function(newValue, oldValue) {
            	var changedXids = Util.arrayDiff(newValue.xids, oldValue.xids);
            	var i;

            	for (i = 0; i < changedXids.removed.length; i++) {
            		var removedXid = changedXids.removed[i];

                	// delete stats for removed xid from stats object
                	delete stats[removedXid];

                	// remove old values
                	if (singlePoint) {
                		delete $scope.statistics;
                	}
            	}

            	if (!$scope.points || !$scope.points.length) return;
            	var points = $scope.points.slice(0);

            	var promises = [];
            	
            	// cancel existing requests if there are any
                if (pendingRequest) {
                    pendingRequest.cancel();
                    pendingRequest = null;
                }

            	for (i = 0; i < points.length; i++) {
            		if (!points[i] || !points[i].xid) continue;
            		var queryPromise = doQuery(points[i]);
            		promises.push(queryPromise);
            	}

            	pendingRequest = $q.all(promises).then(function(results) {
                	if (!results.length) return;
            		var i;

            		for (i = 0; i < results.length; i++) {
            			var point = points[i];
            			var pointStats = results[i];
                        stats[point.xid] = pointStats;
            		}

            		if (singlePoint) {
            			$scope.statistics = stats[points[0].xid];
            		} else {
            			var outputStats = [];
            			for (i = 0; i < points.length; i++) {
            				outputStats.push(stats[points[i].xid]);
            			}
            			$scope.statistics = outputStats;
            		}
            	}, function(error) {
            	    // consume error, most likely a cancel, timeouts will be captured by error interceptor
                }).then(function() {
                    pendingRequest = null;
                });
            }, true);

            function doQuery(point) {
                try {
                    var options = {
                        firstLast: $scope.firstLast,
                        dateFormat: $scope.dateFormat,
                        from: $scope.from,
                        to: $scope.to,
                        timeout: $scope.timeout,
                        rendered: $scope.rendered
                    };
                    
                    return statistics.getStatisticsForXid(point.xid, options).then(function(data) {
                        if (data.startsAndRuntimes) {
                            for (var i = 0; i < data.startsAndRuntimes.length; i++) {
                                var statsObj = data.startsAndRuntimes[i];
                                var valueRenderer = point.valueRenderer(statsObj.value);
                                if (!valueRenderer) continue;
                                statsObj.renderedValue = valueRenderer.text;
                                statsObj.renderedColor = valueRenderer.colour;
                            }
                        }
                        return data;
                    });
                } catch (error) {
                    return $q.reject(error).setCancel(angular.noop);
                }
            }
        }
    };
}

return pointValues;

}); // define
