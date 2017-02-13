/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Will Geller
 */ 

define(['angular', 'require'], function(angular, require) {
    'use strict';

  
    markerStoreController.$inject = ['$scope', '$timeout'];

    function markerStoreController($scope, $timeout) {
        var $ctrl = this;

        $ctrl.markerIcons = [
            {
                name: 'Red Dot',
                image: 'img/map-markers/red-dot.png'
            },
            {
                name: 'Red Small',
                image: 'img/map-markers/mm_20_red.png'
            },
            {
                name: 'Blue Dot',
                image: 'img/map-markers/blue-dot.png'
            },
            {
                name: 'Blue Small',
                image: 'img/map-markers/mm_20_blue.png'
            },
            {
                name: 'Green Dot',
                image: 'img/map-markers/green-dot.png'
            },
            {
                name: 'Green Small',
                image: 'img/map-markers/mm_20_green.png'
            },
            {
                name: 'Yellow Dot',
                image: 'img/map-markers/yellow-dot.png'
            },
            {
                name: 'Yellow Small',
                image: 'img/map-markers/mm_20_yellow.png'
            },
            {
                name: 'Purple Dot',
                image: 'img/map-markers/purple-dot.png'
            },
            {
                name: 'Purple Small',
                image: 'img/map-markers/mm_20_purple.png'
            },
            {
                name: 'Orange Dot',
                image: 'img/map-markers/orange-dot.png'
            },
            {
                name: 'Orange Small',
                image: 'img/map-markers/mm_20_orange.png'
            },
            {
                name: 'Brown Small',
                image: 'img/map-markers/mm_20_brown.png'
            },
            {
                name: 'Gray Small',
                image: 'img/map-markers/mm_20_gray.png'
            },
            {
                name: 'White Small',
                image: 'img/map-markers/mm_20_white.png'
            }
        ];

        $ctrl.deleteMarker = function() {
            $ctrl.markerList.markers = $ctrl.markerList.markers.filter(function(marker) {
                return marker.name !== $ctrl.selectedMarker.name;
            });

            $ctrl.selectedMarker = $ctrl.markerList.markers[0];
        };

        $ctrl.addMarker = function() {
            $ctrl.markerList.markers.push({});
            $ctrl.selectedMarker = $ctrl.markerList.markers[$ctrl.markerList.markers.length-1];

            $timeout(function() {
                angular.element(document.querySelector('#name-input')).focus();
            }, 500);
        };

        $scope.$watch('$ctrl.markerList.markers', function(newValue, oldValue) {
            // console.log('watch markerList.markers', newValue, oldValue);
            if (newValue.length && !oldValue.length) {
                $ctrl.selectedMarker = $ctrl.markerList.markers[0];
            }
        });
    }

    return {
        bindings: {
            dashboardId: '@',
            markerList: '=?'
        },
        controller: markerStoreController,
        templateUrl: require.toUrl('./markerStore.html')
    };
}); // define
