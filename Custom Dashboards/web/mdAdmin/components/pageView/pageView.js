/**
 * @copyright 2017 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire / Will Geller
 */

define(['angular', 'require'], function(angular, require) {
'use strict';

PageViewController.$inject = ['$scope', 'Page', 'User', 'jsonStoreEventManager'];
function PageViewController($scope, Page, User, jsonStoreEventManager) {
    var SUBSCRIPTION_TYPES = ['add', 'update'];
    
    var $ctrl = this;
    $ctrl.user = User;
    var unsubscribe;

    this.$onChanges = function(changes) {
        if (changes.xid) {
            if (unsubscribe) {
                unsubscribe();
            }
            
            delete $ctrl.page;
            delete $ctrl.markup;
            
            Page.loadPage($ctrl.xid).then(function(page) {
                $ctrl.page = page;
                $ctrl.markup = page.jsonData.markup;
            });
    
            unsubscribe = jsonStoreEventManager.smartSubscribe($scope, $ctrl.xid, SUBSCRIPTION_TYPES, this.updateHandler);
        }
    };
    
    this.updateHandler = function updateHandler(event, payload) {
        $ctrl.markup = payload.object.jsonData.markup;
    };
}

return {
    controller: PageViewController,
    bindings: {
        xid: '@',
        nonEditMode: '='
    },
    templateUrl: require.toUrl('./pageView.html')
};

}); // define