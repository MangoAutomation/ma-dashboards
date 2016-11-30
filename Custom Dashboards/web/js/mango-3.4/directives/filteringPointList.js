/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require', 'rql/query'], function(require, query) {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maFilteringPointList
 * @restrict E
 * @description
 * `<ma-filtering-point-list ng-model="myPoint"></ma-filtering-point-list>`
 * - Creates a self-filtering point list that allows you to select a data point by filtering on device names or point names that contain the text.
     Search results will update as you type.
 * - <a ui-sref="dashboard.examples.basics.pointList">View Demo</a>
 *
 * @param {object} ng-model Variable to hold the selected data point.
 * @param {number=} limit Limits the results in the list to a specified number of data points (200 defualt)
 * @param {boolean=} auto-init If set, enables auto selecting of the first data point in the list.
 * @param {string=} point-xid Used with `auto-init` to pre-select the specified point by xid. 
 * @param {string=} point-id Used with `auto-init` to pre-select the specified point by data point id. 
 
 *
 * @usage
 * <ma-filtering-point-list ng-model="myPoint"></ma-filtering-point-list>
 */
pointList.$inject = ['Point', '$filter', '$injector', '$parse', '$timeout', 'Translate'];
function pointList(Point, $filter, $injector, $parse, $timeout, Translate) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngChange: '@',
            limit: '=?',
            autoInit: '=?',
            pointXid: '@',
            pointId: '@',
            label: '@'
        },
        templateUrl: require.toUrl('./filteringPointList.html'),
        link: function ($scope, $element, attrs) {
            if (!$scope.label)
                $scope.label = Translate.trSync('dashboards.v3.app.searchBy', 'points', 'name or device');
            
            if ($scope.autoInit) {
                if (!$scope.pointXid && !$scope.pointId) {
                    Point.rql({query: 'limit(1)'}).$promise.then(function(item) {
                        $scope.ngModel = item[0];
                        $scope.selectedItem = item[0];
                    });
                }
                else if ($scope.pointXid) {
                    Point.rql({query: 'xid='+$scope.pointXid}).$promise.then(function(item) {
                        $scope.ngModel = item[0];
                        $scope.selectedItem = item[0];
                    });
                }
                else if ($scope.pointId) {
                    Point.rql({query: 'id='+$scope.pointId}).$promise.then(function(item) {
                        $scope.ngModel = item[0];
                        $scope.selectedItem = item[0];
                    });
                }
                
            }

            var change = $parse(attrs.ngChange);
            $scope.changed = function() {
                $timeout(function() {
                    change($scope.$parent);
                }, 0);
            };
            
            $scope.storeItem = function(selectedItem) {
                if (selectedItem && selectedItem!=null) {
                    $scope.ngModel = selectedItem;
                }
            };

            $scope.querySearch = function(inputText) {
                var rqlQuery, queryString;
                
                if (inputText) {
                    rqlQuery = new query.Query();
                    var nameLike = new query.Query({name: 'like', args: ['name', '*' + inputText + '*']});
                    var deviceName = new query.Query({name: 'like', args: ['deviceName', '*' + inputText + '*']});
                    rqlQuery.push(nameLike);
                    rqlQuery.push(deviceName);
                    rqlQuery.name = 'or';
                }

                if (attrs.query) {
                    if (rqlQuery) {
                        queryString = rqlQuery.toString();
                    }
                    queryString =+ attrs.query;
                } else {
                    var q = new query.Query();
                    if (rqlQuery)
                        q.push(rqlQuery);

                    queryString = q.sort('deviceName', 'name')
                        .limit($scope.limit || 150)
                        .toString();
                }
                
                return Point.rql({
                    rqlQuery: queryString
                }).$promise.then(null, function() {
                    return [];
                });
            };

            $scope.pointLabel = function(point) {
                return point.deviceName + ' - ' + point.name;
            };
        }
    };
}

return pointList;

}); // define
