/**
 * Javascript Objects Used for Configuration of Input Widgets
 * 
 * 
 * 
 * Copyright (C) 2014 Infinite Automation Software. All rights reserved.
 * @author Terry Packer
 */

InputConfiguration = function(divId, mixin, options){
    
    this.divId = divId;
    
    this.mixin = mixin;
    
    for(var i in options) {
        this[i] = options[i];
    }
    
    this.configuration = $.extend(true, {}, this.getBaseConfiguration(), this.mixin);
    var self = this;
    this.configuration.onChange = function(){
        self.onChange($(this).val(), self.owner);
    };

};

InputConfiguration.prototype = {
        
        
        divId: null, //Id of div to place Picker
        owner: null, //Owner object to include in callback
        mixin: null, //Configuration overload
        configuration: null, //Full mixed-in config
        defaultValue: null, //Default Value
        
        create: function(){

            var input = $('#' + this.divId);
            input.val(this.defaultValue);
            //Add the onChange method
            input.change(this.configuration.onChange);
        },
        
        onChange: function(value, owner){
            console.log(value);
        },
        
        
        getBaseConfiguration: function(){
            return {
                onChange: function(){
                    console.log('changed in base configuration');
                }
            };
        }
        
};
