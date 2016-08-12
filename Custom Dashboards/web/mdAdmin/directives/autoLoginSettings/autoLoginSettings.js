/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['require'], function(require) {
'use strict';

var autoLoginSettings = function autoLoginSettings(User, $scope) {
    this.$onInit = function() {
        this.storedUsername = User.storedUsername();
    };
    
    this.checkUser = function checkUser() {
        if (!this.username) return;
        User.get({username: this.username}).$promise.then(function(user) {
            $scope.autoLoginSettings.username.$setValidity('notFound', true);
            $scope.autoLoginSettings.username.$setValidity('adminUser', !user.hasPermission('superadmin'));
        }, function() {
            $scope.autoLoginSettings.username.$setValidity('notFound', false);
        });
    };
    
    this.saveCredentials = function saveCredentials() {
        if ($scope.autoLoginSettings.$valid) {
            User.storeCredentials(this.username, this.password);
            this.storedUsername = this.username;
        }
    };
    
    this.deleteCredentials = function deleteCredentials() {
        User.clearStoredCredentials();
        this.storedUsername = null;
    };
};

autoLoginSettings.$inject = ['User', '$scope'];

return {
    controller: autoLoginSettings,
    templateUrl: require.toUrl('./autoLoginSettings.html')
};

}); // define
