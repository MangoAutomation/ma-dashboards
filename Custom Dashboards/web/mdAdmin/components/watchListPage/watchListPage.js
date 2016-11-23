/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */

define(['angular', 'require', 'rql/query'], function(angular, require, query) {
'use strict';

watchListPageController.$inject = ['$mdMedia', 'WatchList', 'Translate', '$stateParams', 'localStorageService', '$state', 'PointHierarchy', 'mdAdminSettings', 'DateBar', '$mdDialog'];
function watchListPageController($mdMedia, WatchList, Translate, $stateParams, localStorageService, $state, PointHierarchy, mdAdminSettings, DateBar, $mdDialog) {
    this.baseUrl = require.toUrl('.');
    this.watchList = null;
    this.selectWatchList = null;
    this.dataSource = null;
    this.deviceName = null;
    this.hierarchyFolders = [];
    this.settings = mdAdminSettings;
    this.dateBar = DateBar;

    this.selectFirstWatchList = false;
    this.localStorage = localStorageService.get('watchListPage');
    
    if ( $stateParams.watchListXid || (this.localStorage && this.localStorage.watchListXid) ) {
        this.listType = 'watchLists';
    } else if ( $stateParams.dataSourceXid || (this.localStorage && this.localStorage.dataSourceXid) ) {
        this.listType = 'dataSources';
    } else if ( $stateParams.deviceName || (this.localStorage && this.localStorage.deviceName) ) {
        this.listType = 'deviceNames';
    } else if ( $stateParams.hierarchyFolderId || (this.localStorage && this.localStorage.hierarchyFolderId) ) {
        this.listType = 'hierarchy';
        var hierarchyFolderId = $stateParams.hierarchyFolderId || this.localStorage.hierarchyFolderId;
        
        PointHierarchy.get({id: hierarchyFolderId, points: false}).$promise.then(function(folder) {
            var folders = [];
            PointHierarchy.walkHierarchy(folder, function(folder, parent, index) {
                folders.push(folder);
            });
            this.hierarchyFolders = folders;
            this.hierarchyChanged();
        }.bind(this));
    } else {
        if ($mdMedia('gt-md')) {
            this.selectFirstWatchList = true;
        }
        this.listType = 'watchLists';
    }
    
    this.$mdMedia = $mdMedia;
    this.numberOfRows = $mdMedia('gt-sm') ? 200 : 25;

    this.watchListChanged = function watchListChanged() {
        this.watchList = this.selectWatchList;
        if (this.watchList) {
            
            // clear checked points from table/chart or Load from watchList
            if (this.watchList.data && this.watchList.data.selectedPoints.length > 0) {
                this.selected = this.watchList.data.selectedPoints;
            }
            else {
                this.selected = [];
            }
			
			if (this.watchList.data && this.watchList.data.chartConfig) {
                this.chartConfig = this.watchList.data.chartConfig;
            }
            else {
                this.chartConfig = {
                    graphOptions: [],
                    selectedAxis: 'left',
                    selectedColor: '#C2185B',
                    assignColors: false,
                    chartType: 'smoothedLine',
                    stackType: {
                        selected: 'none',
                        left: 'none',
                        right: 'none',
                        'left-2': 'none',
                        'right-2': 'none'
                    },
                    axisColors: { 
                        left2AxisColor: "#FFFFFF",
                        leftAxisColor: "#FFFFFF",
                        right2AxisColor: "#FFFFFF",
                        rightAxisColor: "#FFFFFF"
                    }
                };
            }
            
            if (this.watchList.data && this.watchList.data.paramValues) {
                this.watchListParams = this.watchList.data.paramValues;
            }
            
            this.updateWatchListParameters();
        }
            
        
        // clear other selections
        this.dataSource = null;
        this.deviceName = null;
        this.hierarchyFolders = [];
        
        // clear hierarchy state
        $stateParams.hierarchyFolderId = null;
        $state.go('.', $stateParams, {location: 'replace', notify: false});
        
        
    };
    
    this.updateWatchListParameters = function updateWatchListParameters(parameters) {
        if (parameters) {
            this.watchListParams = parameters;
        }
        this.watchList.$getPoints(this.watchListParams);
    };
    
    this.dataSourceChanged = function dataSourceChanged() {
        if (this.dataSource) {
            var dsQuery = new query.Query()
                .eq('dataSourceXid', this.dataSource.xid)
                .sort('name')
                .limit(200);

            this.chartConfig = {
                    graphOptions: [],
                    selectedAxis: 'left',
                    selectedColor: '#C2185B',
                    assignColors: false,
                    chartType: 'smoothedLine',
                    stackType: {
                        selected: 'none',
                        left: 'none',
                        right: 'none',
                        'left-2': 'none',
                        'right-2': 'none'
                    },
                    axisColors: { 
                        left2AxisColor: "#FFFFFF",
                        leftAxisColor: "#FFFFFF",
                        right2AxisColor: "#FFFFFF",
                        rightAxisColor: "#FFFFFF"
                    }
                };

            var watchList = new WatchList();
            watchList.isNew = true;
            watchList.type = 'query';
            watchList.name = Translate.trSync('dashboards.v3.app.dataSourceX', [this.dataSource.name]);
            watchList.query = dsQuery.toString();
            watchList.$getPoints();
            this.watchList = watchList;
        } else {
            this.watchList = null;
        }

        // clear other selections
        this.selectWatchList = null;
        this.deviceName = null;
        this.hierarchyFolders = [];
        
        // clear hierarchy state
        $stateParams.hierarchyFolderId = null;
        $state.go('.', $stateParams, {location: 'replace', notify: false});
        
        // clear checked points from table/chart
        this.selected = [];
    };
    
    this.deviceNameChanged = function deviceNameChanged() {
        if (this.deviceName) {
            var dnQuery = new query.Query()
                .eq('deviceName', this.deviceName)
                .sort('name')
                .limit(200);

            this.chartConfig = {
                    graphOptions: [],
                    selectedAxis: 'left',
                    selectedColor: '#C2185B',
                    assignColors: false,
                    chartType: 'smoothedLine',
                    stackType: {
                        selected: 'none',
                        left: 'none',
                        right: 'none',
                        'left-2': 'none',
                        'right-2': 'none'
                    },
                    axisColors: { 
                        left2AxisColor: "#FFFFFF",
                        leftAxisColor: "#FFFFFF",
                        right2AxisColor: "#FFFFFF",
                        rightAxisColor: "#FFFFFF"
                    }
                };
            
            var watchList = new WatchList();
            watchList.isNew = true;
            watchList.type = 'query';
            watchList.name = Translate.trSync('dashboards.v3.app.deviceNameX', [this.deviceName]);
            watchList.query = dnQuery.toString();
            watchList.$getPoints();
            this.watchList = watchList;
        } else {
            this.watchList = null;
        }
        
        // clear other selections
        this.selectWatchList = null;
        this.dataSource = null;
        this.hierarchyFolders = [];
        
        // clear hierarchy state
        $stateParams.hierarchyFolderId = null;
        $state.go('.', $stateParams, {location: 'replace', notify: false});
        
        // clear checked points from table/chart
        this.selected = [];
    };
    
    this.hierarchyChanged = function hierarchyChanged() {
        if (this.hierarchyFolders && this.hierarchyFolders.length) {
            var watchList = new WatchList();
            watchList.isNew = true;
            watchList.type = 'hierarchy';
            watchList.name = Translate.trSync('dashboards.v3.app.hierarchyFolderX', [this.hierarchyFolders[0].name]);
            watchList.hierarchyFolders = this.hierarchyFolders;
            watchList.$getPoints();
            this.watchList = watchList;
            $stateParams.hierarchyFolderId = this.hierarchyFolders[0].id;

            this.chartConfig = {
                    graphOptions: [],
                    selectedAxis: 'left',
                    selectedColor: '#C2185B',
                    assignColors: false,
                    chartType: 'smoothedLine',
                    stackType: {
                        selected: 'none',
                        left: 'none',
                        right: 'none',
                        'left-2': 'none',
                        'right-2': 'none'
                    },
                    axisColors: { 
                        left2AxisColor: "#FFFFFF",
                        leftAxisColor: "#FFFFFF",
                        right2AxisColor: "#FFFFFF",
                        rightAxisColor: "#FFFFFF"
                    }
                };
            
            
            if (this.hierarchyFolders[0].id != null) {
                localStorageService.set('watchListPage', {
                    hierarchyFolderId: this.hierarchyFolders[0].id
                });
            }
        } else {
            this.watchList = null;
            $stateParams.hierarchyFolderId = null;
        }
        
        $state.go('.', $stateParams, {location: 'replace', notify: false});

        // clear other selections
        this.selectWatchList = null;
        this.dataSource = null;
        this.deviceName = null;
        
        // clear checked points from table/chart
        this.selected = [];
    };
    
    this.clear = function clear() {
        this.watchList = null;

        // clear selections
        this.selectWatchList = null;
        this.dataSource = null;
        this.deviceName = null;
        this.hierarchyFolders = [];
        
        // clear hierarchy state
        $stateParams.hierarchyFolderId = null;
        $state.go('.', $stateParams, {location: 'replace', notify: false});
    };
    
    this.editWatchList = function editWatchList(watchList) {
        $state.go('dashboard.settings.watchListBuilder', {watchListXid: watchList ? watchList.xid : null});
    };
    
    this.updateQuery = function updateQuery() {
        var filterText = '*' + this.filter + '*';
        var rqlQuery = new query.Query({name: 'or', args: []});
        rqlQuery.push(new query.Query({name: 'like', args: ['name', filterText]}));
        this.dataSourceQuery = rqlQuery.toString();
        rqlQuery.push(new query.Query({name: 'like', args: ['username', filterText]}));
        this.watchListQuery = rqlQuery.toString();
    };
    
    this.saveSettings = function saveSettings() {
        this.watchList.data = {};
        this.watchList.data.selectedPoints = this.selected;
        this.watchList.data.chartConfig = this.chartConfig;
        this.watchList.data.paramValues = this.watchListParams;
        
        if (this.watchList.isNew) {
            $state.go('dashboard.settings.watchListBuilder', {watchList: this.watchList});
        }
        else {
            this.watchList.$update();
        }
    };
    
    this.downloadStatus = {};
    
    this.showDownloadDialog = function showDownloadDialog($event) {
        $mdDialog.show({
            controller: ['DateBar', 'pointValues', function(DateBar, pointValues) {
                this.downloadData = function downloadData(downloadType, all) {
                    var points = all ? this.watchList.points : this.selected;
                    var xids = points.map(function(pt) {
                        return pt.xid;
                    });
                    
                    var functionName = downloadType.indexOf('COMBINED') > 0 ? 'getPointValuesForXidsCombined' : 'getPointValuesForXids';
                    var mimeType = downloadType.indexOf('CSV') === 0 ? 'text/csv' : 'application/json';
                    var extension = downloadType.indexOf('CSV') === 0 ? 'csv' : 'json';
                    var fileName = this.watchList.name + '_' + DateBar.from.toISOString() + '_' + DateBar.to.toISOString() + '.' + extension;

                    this.downloadStatus.error = null;
                    this.downloadStatus.downloading = true;
                    
                    this.downloadStatus.queryPromise = pointValues[functionName](xids, {
                        mimeType: mimeType,
                        responseType: 'blob',
                        from: DateBar.from,
                        to: DateBar.to,
                        rollup: DateBar.rollupType,
                        rollupInterval: DateBar.rollupIntervals,
                        rollupIntervalType: DateBar.rollupIntervalPeriod
                    }).then(function(response) {
                        this.downloadStatus.downloading = false;
                        if (typeof window.navigator.msSaveBlob === 'function') {
                            window.navigator.msSaveBlob(response, fileName);
                        } else {
                            var url = URL.createObjectURL(response);
                            try {
                                var a = document.createElement('a');
                                a.style.display = 'none';
                                a.href = url;
                                a.download = fileName;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            } finally {
                                URL.revokeObjectURL(url);
                            }
                        }
                    }.bind(this), function(response) {
                        this.downloadStatus.error = response.statusText || response.message || (response.status === -1 ? Translate.trSync('dashboards.v3.app.cancelledOrNoResponse') : response.toString());
                        this.downloadStatus.downloading = false;
                        console.log(response);
                    }.bind(this));
                };
                
                this.cancelDownload = function cancelDownload() {
                    this.downloadStatus.queryPromise.cancel();
                };
                
                this.cancel = function cancel() {
                    $mdDialog.cancel();
                };
            }],
            templateUrl: require.toUrl('./downloadDialog.html'),
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: $mdMedia('xs') || $mdMedia('sm'),
            bindToController: true,
            controllerAs: '$ctrl',
            locals: {
                watchList: this.watchList,
                selected: this.selected,
                downloadStatus: this.downloadStatus
            }
        });
    };
}

return {
    controller: watchListPageController,
    templateUrl: require.toUrl('./watchListPage.html'),
    bindings: {
        watchList: '<?'
    }
};

}); // define