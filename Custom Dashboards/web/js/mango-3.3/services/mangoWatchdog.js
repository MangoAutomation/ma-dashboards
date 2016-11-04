/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['angular'], function(angular) {
'use strict';
/**
* @ngdoc service
* @name maServices.mangoWatchdog
*
* @description
* The mangoWatchdog service checks for connectivity to the Mango API and checks if a user is logged in. It does this by
* periodically pinging an API endpoint.
* 
* The watchdog service broadcasts an event named 'mangoWatchdog' on the root scope which provides information about
* the current status of Mango.
* 
* The watchdog service check interval is set by defining the 'mangoWatchdogTimeout' constant and when Mango is down
* the service will try and reconnect every 'mangoReconnectDelay' milliseconds.
* 
* - <a ui-sref="dashboard.examples.utilities.watchdog">View Demo</a>
*/

/**
* @ngdoc event
* @name mangoWatchdog#mangoWatchdog
* @eventType broadcast on root scope
* @eventOf maServices.mangoWatchdog
*
* @description
* Broadcast periodically, indicates the current status of Mango.
* 
* @param {object} angularEvent Synthetic event object
* @param {object} current mango status
* @param {object} previous mango status
*/

/**
* @ngdoc method
* @methodOf maServices.mangoWatchdog
* @name enable
*
* @description
* Enables the watchdog service.
*
*/

/**
* @ngdoc method
* @methodOf maServices.mangoWatchdog
* @name disable
*
* @description
* Disables the watchdog service.
*
*/

function mangoWatchdog(mangoWatchdogTimeout, mangoReconnectDelay, $rootScope, $http, $interval) {

    var API_DOWN = 'API_DOWN';
    var STARTING_UP = 'STARTING_UP';
    var API_UP = 'API_UP';
    var API_ERROR = 'API_ERROR';
    var LOGGED_IN = 'LOGGED_IN';

	function MangoWatchdog(options) {
		this.enabled = true;
		angular.extend(this, options);
		
		// assume good state until proved otherwise
		this.loggedIn = true;
		this.apiUp = true;
		
		if (this.timeout <= 0)
			this.enabled = false;
		
		if (this.enabled)
		    this.setInterval(this.timeout);
	}
	
	MangoWatchdog.prototype.doPing = function() {
	    $http({
            method: 'OPTIONS',
            url: '/rest/v1/users/current',
            timeout: this.interval / 2
        }).then(function(response) {
            // cache control header is not present on startup
            if (response.headers('Cache-Control')) {
                return LOGGED_IN;
            }
            // mango returns standard startup page response to OPTIONS request when starting
            return STARTING_UP;
        }, function(response) {
            if (response.status < 0) {
                return API_DOWN;
            } else if (response.status === 403) {
                return API_UP;
            } else {
                return API_ERROR;
            }
        }).then(this.setStatus.bind(this));
    };
    
    MangoWatchdog.prototype.setStatus = function(status) {
        var previous = {
            status: this.status,
            apiUp: this.apiUp,
            loggedIn: this.loggedIn
        };
        switch(status) {
        case STARTING_UP:
        case API_ERROR:
        case API_DOWN:
            // we may still be logged in (aka session valid) but cannot prove it
            this.loggedIn = false;
            this.apiUp = false;
            // setup a faster check while API is down
            if (this.interval !== this.reconnectDelay) {
                this.setInterval(this.reconnectDelay);
            }
            break;
        case LOGGED_IN:
            this.loggedIn = true;
            // fall through
        case API_UP:
            this.apiUp = true;
            // consider API up but not logged in as a failure but stop the faster retry
            if (this.interval !== this.timeout) {
                this.setInterval(this.timeout);
            }
            break;
        }

        this.status = status;
        
        var current = {
            status: this.status,
            apiUp: this.apiUp,
            loggedIn: this.loggedIn
        };
        
        $rootScope.$broadcast('mangoWatchdog', current, previous);
    };
    
    MangoWatchdog.prototype.setInterval = function(interval) {
        if (angular.isUndefined(interval)) {
            interval = this.timeout;
        }
        if (this.timer) {
            $interval.cancel(this.timer);
        }
        this.interval = interval;
        this.timer = $interval(this.doPing.bind(this), interval);
    };
	
	MangoWatchdog.prototype.enable = function() {
	    if (this.enabled) return;
	    this.setInterval(this.timeout);
		this.enabled = true;
	};

	MangoWatchdog.prototype.disable = function() {
	    if (this.timer) {
	        $interval.cancel(this.timer);
	    }
		this.enabled = false;
	};

	return new MangoWatchdog({timeout: mangoWatchdogTimeout, reconnectDelay: mangoReconnectDelay});
}

mangoWatchdog.$inject = ['mangoWatchdogTimeout', 'mangoReconnectDelay', '$rootScope', '$http', '$interval'];

return mangoWatchdog;

}); // define
