/**
 * Copyright (C) 2015 Deltamation Software. All rights reserved.
 * http://www.deltamation.com.au/
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function pointList(Point, $filter) {
    return {
        restrict: 'E',
        scope: {
            order: '@',
            query: '@',
            ngModel: '=?',
            initPoint: '@'
        },
        template: '<select ng-options="pointLabel(point) for point in points | orderBy: orderArray track by point.id"></select>',
        replace: true,
        link: function ($scope, $element, attr) {
            $scope.orderArray = ['deviceName', 'name'];
            $scope.initPoint = 'true';
            
            $scope.$watch('order', function() {
                if ($scope.order) {
                    $scope.orderArray = $scope.order.split(',');
                }
            });
            
            $scope.$watch('query', function(value) {
                if (value) {
                	$scope.points = Point.rql({
                    	query: value
                    });
                } else {
                	$scope.points = Point.query();
                }
                
                if ($scope.initPoint.toLowerCase().trim() === 'true') {
                    $scope.points.$promise.then(function(points) {
                    	if (points.length) {
                        	$scope.ngModel = $filter('orderBy')(points, $scope.orderArray)[0];
                    	}
                    });
                }
            });
            
            $scope.pointLabel = function(point) {
                return point.deviceName + ' - ' + point.name;
            };
        }
    };
}

pointList.$inject = ['Point', '$filter'];
return pointList;

}); // define
