/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maSwitchImg
 * @restrict E
 * @description
 * `<ma-switch-img>`
 * - `<ma-switch-img>` displays an image who's image source will be switched based on a point's value.
 * - Use default-src to set the default image that will display if no match is found or the point is disabled.
 * - <a ui-sref="dashboard.examples.singleValueDisplays.switchImage">View Demo</a> 
 *
 * @param {object} point Input the point object whos value will be used in
 determining the image displayed. (using `<ma-get-point-value point="myPoint"></ma-point-value>`)
 * @param {string} default-src Set the default image path that will display if no match is found or the point is disabled.
 * @param {object=} src-map Use an object to map any data point value to an image path: (`'value1': 'img/image1.png', 'value2': 'img/image2.png'}`)
 * @param {string=} src-### The part of attribute after `src-` (the `###`) is used to compare against the point value.
 For strings with spaces replace the spaces in the point value with dashes in attribute name. *Not to be used with `src-map` attribute.
 *
 * @usage
 <ma-point-list limit="200" ng-model="myPoint"></ma-point-list>
 <ma-point-value point="myPoint"></ma-point-value>
 <div flex="50">
		<p>Map example</p>
		<ma-switch-img point="myPoint" default-src="img/close.png" src-map="{'false': 'img/ligthbulb_off.png', 'true': 'img/ligthbulb_on.png'}">
		</ma-switch-img>
	</div>
	<div flex="50">
		<p>Binary example</p>
		<ma-switch-img point="myPoint" src-false="img/ligthbulb_off.png" src-true="img/ligthbulb_on.png" default-src="img/close.png">
		</ma-switch-img>
	</div>
	<div flex="50">
		<p>Multi-state example</p>
		<ma-switch-img point="myPoint" src-1="img/arrow_up.png" src-2="img/arrow_right.png" src-3="img/arrow_down.png" src-4="img/arrow_left.png" default-src="img/close.png">
		</ma-switch-img>
	</div>
	<div flex="50">
		<p>String example</p>
		<ma-switch-img point="myPoint" src-test="img/ligthbulb_off.png" src-test-my-string="img/ligthbulb_on.png" default-src="img/close.png">
		</ma-switch-img>
	</div>
</div>
 *
 */
function switchImg() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        	point: '=',
        	srcMap: '=?',
        	defaultSrc: '@'
        },
        template: '<img ng-src="{{src}}" ng-class="classes">',
        link: function ($scope, $element, attributes) {
        	$scope.classes = {};

            $scope.$watch('point.value', function(newValue, oldValue) {
                if (newValue === undefined) {
                	delete $scope.src;
                } else {
                	// TODO better conversion to attr name for symbols etc
                	var attrName = typeof newValue === 'string' ? replaceAll(newValue, ' ', '-').toLowerCase() : newValue;
                	$scope.src = $element.attr('src-' + attrName);
                    if (!$scope.src && $scope.srcMap) {
                    	$scope.src = $scope.srcMap[newValue];
                    }
                }
                if (!$scope.src) {
                	$scope.src = $scope.defaultSrc || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                }
            });

            $scope.$watch('point.enabled', function(newValue) {
            	var disabled = newValue !== undefined && !newValue;
            	$scope.classes['point-disabled'] = disabled;
            });
        }
    };
}

function replaceAll(target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement);
}

return switchImg;

}); // define
