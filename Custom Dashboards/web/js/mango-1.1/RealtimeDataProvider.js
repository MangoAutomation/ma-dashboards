/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 */

define(['jquery', './dataProvider', './PointEventManager'],
function($, DataProvider, PointEventManager) {
"use strict";

//use a static PointEventManager which is shared between all RealtimeDataProviders
var pointEventManager = new PointEventManager();

var RealtimeDataProvider = DataProvider.extend({
    type: 'RealtimeDataProvider',
    eventType: 'CHANGE',
    
    constructor: function(id, options) {
        DataProvider.apply(this, arguments);
        this.eventHandler = this.eventHandler.bind(this);
    },

    /**
     * Clear out our pointConfigurations if required
     * 
     * Signal to all Listeners to clear ALL their data
     * 
     * @param clearConfigurations - boolean to clear pointConfigurations too
     */
    clear: function(clearConfigurations) {
        var self = this;

        if (clearConfigurations) {
            $.each(this.pointConfigurations, function(key, pointConfig) {
                var point = self.toPoint(pointConfig);
                pointEventManager.unsubscribe(point.xid, self.eventType, self.eventHandler);
            });
        }
        
        DataProvider.prototype.clear.apply(this, arguments);
    },

    needsToLoad: function(changedOptions) {
        // never need to reload as its continually updated
        if (this.previousOptions)
            return false;
        return true;
    },

    loadPoint: function(point, options) {
        return this.mangoApi.getLatestValues(point.xid, 1);
    },

    disable: function() {
        var self = this;
        $.each(this.pointConfigurations, function(key, pointConfig) {
            var point = self.toPoint(pointConfig);
            pointEventManager.unsubscribe(point.xid, self.eventType, self.eventHandler);
        });

        DataProvider.prototype.disable.apply(this, arguments);
    },

    enable: function() {
        var self = this;
        $.each(this.pointConfigurations, function(key, pointConfig) {
            var point = self.toPoint(pointConfig);
            pointEventManager.subscribe(point.xid, self.eventType, self.eventHandler);
        });

        DataProvider.prototype.enable.apply(this, arguments);
    },

    /**
     * Add a data point configuration to our list
     */
    addDataPoint: function(dataPointConfiguration) {
        var ret = DataProvider.prototype.addDataPoint.apply(this, arguments);
        if (!ret)
            return ret;
        
        if (this.enabled) {
            var point = this.toPoint(dataPointConfiguration);
            var xid = point.xid;
            pointEventManager.subscribe(xid, this.eventType, this.eventHandler);
        }
    },

    eventHandler: function(event, xid, eventType, value) {
        if (eventType !== this.eventType)
            return;
        
        var self = this;
        $.each(this.pointConfigurations, function(key, pointConfig) {
            var point = self.toPoint(pointConfig);
            if (point.xid === xid) {
                self.notifyListeners(value, point);
            }
        });
    }
});

DataProvider.registerProvider(RealtimeDataProvider);
return RealtimeDataProvider;

});