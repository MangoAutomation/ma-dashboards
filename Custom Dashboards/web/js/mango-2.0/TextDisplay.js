/**
 * Display Point Values as Text in a Dom Node
 * @copyright 2015 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 * @module {TextDisplay} mango/TextDisplay
 * @see TextDisplay
 */
define(['jquery'], function($) {

function TextDisplay(options) {
	BaseDisplay.apply(this, arguments);
	
    this.suffix = '';
    this.decimalPlaces = 2;
    this.inhibitUpdateOnFocus = $(null);

    for(var i in options) {
        this[i] = options[i];
    }
    
    this.dataProviderIds = [this.dataProviderId];
};

TextDisplay.prototype = Object.create(BaseDisplay.prototype);

        
/**
 * Data Provider listener to clear data
 */
TextDisplay.prototype.onClear = function() {
    if (this.useVal) {
        var inputs = this.selection.filter('input');
        var others = this.selection.not(inputs);
        inputs.val('');
        others.text('');
    }
    else {
        this.selection.text('');
    }
    delete this.previous;
};

/**
 * Data Provider Listener
 * On Data Provider load we add new data
 */
TextDisplay.prototype.onLoad = function(data, dataPoint) {
    if ($.isArray(data)) {
        if (data.length) {
            data = data[0];
        }
        else return;
    }
    
    if (typeof data.minimum == 'object') {
        data.minimum = data.minimum.value;
        data.maximum = data.maximum.value;
        data.difference = data.maximum - data.minimum;
    }
    
    var value = data[this.valueAttribute];
    if (value === null || value === undefined) {
        // we will often want convertedValue or renderedValue but they aren't available
        // on non-numeric points
        value = data.value;
    }
    
    if (typeof this.manipulateValue === 'function')
        value = this.manipulateValue(value, dataPoint);

    var rendered = this.renderText(value);
    
    if (typeof this.onChange === 'function') {
        if (this.previous !== undefined && rendered !== this.previous) {
            this.onChange();
        }
        this.previous = rendered;
    }
    
    if (this.useVal) {
        var inputs = this.selection.filter('input');
        var others = this.selection.not(inputs);
        
        if (this.inhibitUpdateOnFocus.filter(':focus').length === 0) {
            inputs.filter(':not(:focus)').val(rendered);
        }
        others.text(rendered);
    }
    else {
        this.selection.text(rendered);
    }
};

TextDisplay.prototype.renderText = function(value) {
    // PointValueTime
    if (value && typeof value === 'object' && 'value' in value && 'timestamp' in valuevalue) {
        return this.renderValue(value.value);
    }
    
    return this.renderValue(value);
};

TextDisplay.prototype.renderValue = function(value) {
    if (typeof value === 'number')
        return value.toFixed(this.decimalPlaces) + this.suffix;
    return value;
};

return TextDisplay;

}); // define
