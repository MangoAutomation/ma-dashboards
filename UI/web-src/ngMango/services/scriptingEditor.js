/**
 * @copyright 2018 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Luis Güette
 */

import angular from 'angular';

scriptingEditorFactory.$inject = ['$http'];
function scriptingEditorFactory($http) {
    
    const baseUrl = '/rest/latest/script/validate';
    
    const defaultProperties = {
        wrapInFunction: false,
        context: [],
        logLevel: 'ERROR',
        permissions: [],
        script:'',
        resultDataType: null 
    };

    class ScriptingEditor {
        constructor(properties) {
            Object.assign(this, angular.copy(defaultProperties), properties);
        } 
        
        validate(url = baseUrl, opts = {}) {
            return $http({
                method: 'POST',
                url: url,
                data: this 
            }, opts).then(response => {
                return response.data;
            });
        }
        
       
    }
    
    return ScriptingEditor;
}

export default scriptingEditorFactory;
