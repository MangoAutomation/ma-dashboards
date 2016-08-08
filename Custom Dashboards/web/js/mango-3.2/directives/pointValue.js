/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';
/**
 * @ngdoc directive 
 * @name maDashboards.maPointValue
 *
 * @description
 * `<ma-point-value point="myPoint"></ma-point-value>`
 * - The `<ma-point-value>` directive will render the live value or update time from a point onto the page.
 * - You can supply the `display-type` attribute to get the unit converted value or data/time of the update.
 * - You can use the `point-xid` property or pass in a point from `<ma-point-list>`.
 * - <a ui-sref="dashboard.examples.basics.liveValues">View Demo</a> / <a ui-sref="dashboard.examples.basics.getPointByXid">View point-xid Demo</a>
 *
 * @param {object} point The point object that the live value will be outputted to.
 If `point-xid` is used this will be a new variable for the point object.
 If the point object is passed into this attribute from `<ma-point-list>`
 then the point object will be extended with the live updating value.
 * @param {string=} point-xid If used you can hard code in a data point's `xid` to get its live values.
 * @param {string=} display-type Changes how the data point value is rendered on the page. Options are:
 <ul>
     <li>`rendered` (Displays live value in point's text rendered format) *Default</li>
     <li>`converted` (Displays live value in point's unit converted format)</li>
     <li>`dateTime` (Displays the time the of the point's last update)</li>
 </ul>
 * @param {string=} date-time-format If `dateTime` is used with `display-type`
 then you can pass in a [momentJs](http://momentjs.com/) string to format the timestamp. (Defaults to Mango default date format set in system settings)
 *
 * @usage
 *
 <md-input-container class="md-block">
     <label>Choose a point</label>
     <ma-point-list ng-model="myPoint1"></ma-point-list>
 </md-input-container>

Value: <ma-point-value point="myPoint1"></ma-point-value>
Time: <ma-point-value point="myPoint1" display-type="dateTime" date-time-format="LTS">
</ma-point-value>
 *
 */
function pointValue($filter, mangoDefaultDateFormat) {
    return {
        restrict: 'E',
        scope: {
            point: '=?',
            pointXid: '@',
            displayType: '@',
            dateTimeFormat: '@'
        },
        replace: true,
        templateUrl: require.toUrl('./pointValue.html'),
        link: function ($scope, $element, attrs) {
        	var displayType = $scope.displayType || 'rendered';
            var dateTimeFormat = $scope.dateTimeFormat || mangoDefaultDateFormat;

            $scope.valueStyle = {};
            $scope.classes = {};

            $scope.$watch('point.value', function(newValue, oldValue) {
            	var point = $scope.point;
            	if (!point || newValue === undefined) return;

            	$scope.classes['point-disabled'] = !point.enabled;

            	var valueRenderer = point.valueRenderer(point.value);
                var color = valueRenderer ? valueRenderer.color : null;

                switch(displayType) {
                case 'converted':
                	$scope.displayValue = point.convertedValue;
                    break;
                case 'rendered':
                	$scope.displayValue = point.renderedValue;
                    $scope.valueStyle.color = color;
                    break;
                case 'dateTime':
                	$scope.displayValue = $filter('moment')(point.time, 'format', dateTimeFormat);
                    break;
                default:
                	$scope.displayValue = point.value;
                }
            });

            $scope.$watch('point.xid', function(newXid, oldXid) {
                if (oldXid && oldXid !== newXid) {
                    delete $scope.displayValue;
                    $scope.valueStyle = {};
                    $scope.classes = {};
                }
            });
        }
    };
}

pointValue.$inject = ['$filter', 'mangoDefaultDateFormat'];
return pointValue;

}); // define
