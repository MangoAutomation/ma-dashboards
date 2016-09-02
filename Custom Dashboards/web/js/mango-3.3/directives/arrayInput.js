/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define([], function() {
'use strict';

function arrayInput() {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModel) {
            ngModel.$parsers.unshift(function toArray(viewValue) {
                return (typeof viewValue === 'string') ? viewValue.split($attrs.delim || ',') : viewValue;
            });
            
            ngModel.$formatters.push(function fromArray(modelValue) {
                return angular.isArray(modelValue) ? modelValue.join($attrs.delim || ',') : modelValue;
            });
        }
    };
}

arrayInput.$inject = [];

return arrayInput;

}); // define
