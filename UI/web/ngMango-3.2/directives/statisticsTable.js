/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require', 'moment-timezone'], function(require, moment) {
'use strict';
/**
 * @ngdoc directive
 * @name ngMango.directive:maStatisticsTable
 * @restrict E
 * @description
 * `<ma-statistics-table statistics="statsObj"></ma-statistics-table>`
 * - `<ma-statistics-table>` will display a formatted data table with the values and timestamps from a `statistics` object.
 * - <a ui-sref="ui.examples.statistics.statisticsTable">View Demo</a> 
 *
 * @param {object} statistics Input the statistics object from `<ma-point-statistics>`
 * @param {object=} point Inputs a `point` object from `<ma-point-list>`. If used statistics attribute becomes an output of the
 * `statistics` object. Takes precedence over `point-xid`.
 * @param {string=} point-xid Alternatively you can pass in the `xid` of a point to use.
 * @param {boolean=} hide-starts-and-runtimes If set to `true`, `starts` and `runtimes` statistics will not display for a
 * binary/multistate point
 (Defaults to `false`)
 * @param {string=} timezone The display date will have the given timezone.
 *
 * @usage
 * <ma-point-statistics point="myPoint" from="from" to="to" statistics="statsObj"></ma-point-statistics>
<ma-statistics-table statistics="statsObj"></ma-statistics-table>
 *
 */
statisticsTable.$inject = ['$injector', 'MA_DATE_FORMATS'];
function statisticsTable($injector, mangoDateFormats) {
    return {
        restrict: 'E',
        designerInfo: {
            translation: 'ui.components.statisticsTable',
            icon: 'grid_on',
            category: 'statistics',
            attributes: {
                point: {nameTr: 'ui.app.dataPoint', type: 'datapoint'},
                pointXid: {nameTr: 'ui.components.dataPointXid', type: 'datapoint-xid'},
                from: {defaultValue: 'dateBar.from'},
                to: {defaultValue: 'dateBar.to'},
                hideStartsAndRuntimes: {type: 'boolean', nameTr: 'ui.components.hideStartsAndRuntimes', defaultValue: false}
            }
        },
        scope: {
            point: '<?',
            pointXid: '@',
            statistics: '=?',
            timezone: '@',
            from: '<?',
            to: '<?',
            hideStartsAndRuntimes: '<?'
        },
        templateUrl: function() {
            if ($injector.has('$mdUtil')) {
                return require.toUrl('./statisticsTable-md.html');
            }
            return require.toUrl('./statisticsTable.html');
        },
        link: function($scope, $element, $attrs) {
            $scope.formatTimestamp = function(ts) {
                var m = moment(ts);
                if ($scope.timezone) {
                    m.tz($scope.timezone);
                }
                return m.format(mangoDateFormats.dateTime);
            };
        }
    };
}

return statisticsTable;

}); // define
