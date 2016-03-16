/**
 * Copyright (C) 2015 Infinite Automation Systems, Inc. All rights reserved.
 * http://infiniteautomation.com/
 * @author Jared Wiltshire
 */

define(['jquery'], function($) {

TextDisplay = function(options) {
    this.valueAttribute = 'value';
    this.suffix = '';
    this.decimalPlaces = 2;

    for(var i in options) {
        this[i] = options[i];
    }
    
    this.dataProviderIds = [this.dataProviderId];
};

TextDisplay.prototype = {
        createDisplay: function() {
            return this;
        },
        
        /**
         * Data Provider listener to clear data
         */
        onClear: function() {
            this.selection.text('');
        },
        
        /**
         * Data Provider Listener
         * On Data Provider load we add new data
         */
        onLoad: function(data, dataPoint) {
            if ($.isArray(data)) {
                data = data[0];
            }
            if (typeof data.minimum == 'object') {
                data.minimum = data.minimum.value;
                data.maximum = data.maximum.value;
                data.difference = data.maximum - data.minimum;
            }
            
            var value = data[this.valueAttribute];
            
            if (typeof this.manipulateValue === 'function')
                value = this.manipulateValue(value, dataPoint);

            var rendered = this.renderText(value);
            if (this.useVal) {
                var inputs = this.selection.filter('input');
                var others = this.selection.not(inputs);
                inputs.filter(':not(:focus)').val(rendered);
                others.text(rendered);
            }
            else {
                this.selection.text(rendered);
            }
        },
        
        renderText: function(value) {
            // PointValueTime
            if (typeof value === 'object' && 'value' in value && 'timestamp' in valuevalue) {
                return this.renderValue(value.value);
            }
            
            return this.renderValue(value);
        },

        renderValue: function(value) {
            if (typeof value === 'number')
                return value.toFixed(this.decimalPlaces) + this.suffix;
            return value;
        }
};

return TextDisplay;

}); // define
