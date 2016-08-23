/**
 * @copyright 2016 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

define(['jquery', 'angular'], function($, angular) {
'use strict';
/**
 * @ngdoc directive
 * @name maDashboards.maTr
 * @restrict A
 * @description
 * `<span ma-tr="dashboards.v3.dox.input"></span>`
 * - Sets the text within an element to the translation set for the current language
 * - Translations are written in `web/modules/dashboards/classes/i18n.properties` file
 *
 * @usage
 * <span ma-tr="dashboards.v3.dox.input"></span>
 */
function maTr(Translate) {
    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $elem, $attrs) {
            var trKey, trArgs;

            $attrs.$observe('maTr', function(newValue) {
        	    doTranslate(newValue, trArgs);
        	});
            $scope.$watchCollection($attrs.maTrArgs, function(newValue, oldValue) {
                doTranslate(trKey, newValue);
            });

            function doTranslate(newKey, newArgs) {
                if (newKey === trKey && angular.equals(newArgs, trArgs)) {
                    return;
                }
                trKey = newKey;
                trArgs = newArgs;
                if (!trKey) return;

	            Translate.tr(trKey, trArgs || []).then(function(translation) {
	            	return {
	            		failed: false,
	            		text: translation
	            	};
	            }, function(error) {
	            	var result = {
	            		failed: true,
	            		text: '!!' + $attrs.maTr + '!!'
	            	};
	            	return $.Deferred().resolve(result);
	            }).then(function(result) {
	            	var text = result.text;
	            	var tagName = $elem.prop('tagName');
	            	if (tagName === 'IMG') {
	            		$elem.attr('alt', text);
	            		return;
	            	} else if (tagName === 'INPUT') {
	            		$elem.attr('placeholder', text);
	            		return;
	            	} else if (tagName === 'BUTTON' || $elem.hasClass('md-button')) {
	            	    $elem.attr('aria-label', text);
	            	    // if button already has text contents, then only set the aria-label
	            	    if ($elem.contents().length) return;
	            	} else if (tagName === 'MDP-DATE-PICKER' || tagName === 'MDP-TIME-PICKER' ||
	            	        tagName === 'MD-INPUT-CONTAINER' || tagName === 'MA-FILTERING-POINT-LIST') {
	            	    $elem.find('label').text(text);
	            	    return;
	            	}

	            	var firstChild = $elem.contents().length && $elem.contents().get(0);
	            	// if first child is a text node set the text value
	                if (firstChild && firstChild.nodeType === 3) {
	                	firstChild.nodeValue = text;
	                } else {
	                	// else prepend a text node to its children
	                    $elem.prepend(document.createTextNode(text));
	                }
	            });
            }
        }
    };
}

maTr.$inject = ['Translate'];
return maTr;

}); // define
