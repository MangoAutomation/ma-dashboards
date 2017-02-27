/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require'], function(angular, require) {
    'use strict';


    chartReportsController.$inject = ['$scope', '$timeout', 'Util', 'DateBar'];

    function chartReportsController($scope, $timeout, Util, DateBar) {
        var $ctrl = this;
        var index = 0;


        $ctrl.$onInit = function(changes) {
            $ctrl.localReportStore = {reports: []};
            $ctrl.reportStore = {reports: []};
        };

        $ctrl.$onChanges = function(changes) {
            // console.log(changes);
            if (changes.markerUid.currentValue) {
              delete $ctrl.reportStoreItem;

              delete $ctrl.reportItem;
              delete $ctrl.report;
              

              $ctrl.localReportStore = {reports: []};
              $ctrl.reportStore = {reports: []};
              $ctrl.selectedReport = {};

              $ctrl.reportJsonStoreXid = 'Rpt-' + $ctrl.markerUid;

              // console.log('markerUid updated, new Rpt- xid is', $ctrl.reportJsonStoreXid);
            }

            // if (changes.reportWatchlistXid.currentValue) {
            //   $ctrl.initialWatchListXid = $ctrl.reportWatchlistXid;
            // }
        };

        $ctrl.reportChanged = function() {
          delete $ctrl.reportItem;
          delete $ctrl.report;

          index = $ctrl.localReportStore.reports.indexOf($ctrl.selectedReport);
          DateBar.data = angular.copy($ctrl.selectedReport.dateBar.data);

          $ctrl.initialWatchListXid = $ctrl.selectedReport.watchList || $ctrl.reportWatchlistXid;
        };

        $ctrl.saveReport = function() {
          $ctrl.selectedReport.dateBar.data = angular.copy(DateBar.data);
          $ctrl.selectedReport.watchList = $ctrl.watchList.xid;

          $ctrl.reportStore.reports[index] = angular.copy($ctrl.selectedReport);
          $ctrl.reportStoreItem.$save();

          // Also store chartReport into it's own Json_Data row
          $ctrl.report.report = angular.copy($ctrl.selectedReport);
          
          $ctrl.reportItem.$save();
        };

        $ctrl.addReport = function() {
          delete $ctrl.reportItem;
          delete $ctrl.report;

          $ctrl.localReportStore.reports.push({dateBar: {}});
          index = $ctrl.localReportStore.reports.length-1;

          $ctrl.selectedReport = $ctrl.localReportStore.reports[index];
          $ctrl.selectedReport.uid = 'Report-' + Util.uuid();

          $ctrl.initialWatchListXid = $ctrl.reportWatchlistXid;

          $timeout(function() {
              angular.element(document.querySelector('#report-name-input')).focus();
          }, 500);
        };

        $ctrl.deleteReport = function() {
          // delete Report row from jsondata
          var reportUid = $ctrl.selectedReport.uid;
          $ctrl.reportItem.$delete();

          // and remove from reports array
          $ctrl.reportStore.reports = $ctrl.reportStore.reports.filter(function(report) {
              return report.uid !== reportUid;
          });

          $ctrl.localReportStore.reports = $ctrl.localReportStore.reports.filter(function(report) {
              return report.uid !== reportUid;
          });

          $ctrl.selectedReport = $ctrl.localReportStore.reports[0];
          index = 0;

          $ctrl.reportStoreItem.$save();
        };

        $scope.$watch('$ctrl.reportStore.reports', function(newValue, oldValue) {
            if (newValue === undefined || oldValue === undefined) return;
            // console.log('watch reportStore.reports', newValue, oldValue);

            if ( newValue.length && !oldValue.length) {
                $ctrl.localReportStore.reports = angular.copy($ctrl.reportStore.reports);
                $ctrl.selectedReport = $ctrl.localReportStore.reports[0];

                $ctrl.initialWatchListXid = $ctrl.selectedReport.watchList || $ctrl.reportWatchlistXid;

                DateBar.data = angular.copy($ctrl.selectedReport.dateBar.data);
            }
        });
    }

    return {
        bindings: {
            reportWatchlistXid: '@',
            markerUid: '@',
            markerName: '@',
            dateBar: '='
        },
        controller: chartReportsController,
        templateUrl: require.toUrl('./chartReports.html')
    };
}); // define
