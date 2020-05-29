/**
 * @copyright 2018 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

import permissionsMenuTemplate from './permissionsMenu.html';
import './permissionsMenu.css';

class PermissionsMenuController {
    static get $$ngIsClass() { return true; }
    static get $inject() { return ['maPermissions']; }

    constructor(Permissions) {
        this.Permissions = Permissions;
        this.permissions = [];
        this.permissionsByName = {};
    }
    
    $onInit() {
        this.ngModelCtrl.$render = this.render.bind(this);
        
        this.Permissions.getAll().then(function(permissions) {
            for (let i = 0; i < permissions.length; i++) {
                const permName = permissions[i];
                if (this.permissionsByName[permName]) {
                    this.permissionsByName[permName].fromRest = true;
                } else {
                    const permission = {name: permName, value: false, fromRest: true};
                    this.permissions.push(permission);
                    this.permissionsByName[permName] = permission;
                }
            }
        }.bind(this));
    }
    
    // ng-model value changed outside of this directive
    render() {
        let permission;
        
        // remove all permissions not retrieved from REST
        for (let i = 0; i < this.permissions.length;) {
            permission = this.permissions[i];
            if (!permission.fromRest) {
                this.permissions.splice(i, 1);
                delete this.permissionsByName[permission.name];
            } else {
                permission.value = false;
                i++;
            }
        }
        
        // undefined if invalid
        if (this.ngModelCtrl.$viewValue) {
            const array = this.ngModelCtrl.$viewValue;
            for (let i = 0; i < array.length; i++) {
                let permName;
                // TODO Mango 4.0 can be array of arrays now
                if (Array.isArray(array[i])) {
                    permName = array[i].join(' & ');
                } else {
                    permName = array[i].trim();
                }
                
                if (!permName) continue;
                
                if (this.permissionsByName[permName]) {
                    this.permissionsByName[permName].value = true;
                } else {
                    permission = {name: permName, value: true, fromRest: false};
                    this.permissions.push(permission);
                    this.permissionsByName[permName] = permission;
                }
            }
        }
    }
    
    checkboxChanged() {
        const permissionNames = [];
        for (let i = 0; i < this.permissions.length; i++) {
            const permission = this.permissions[i];
            if (permission.value) {
                permissionNames.push(permission.name);
            }
        }
        // TODO Mango 4.0 can be array of arrays now
        this.ngModelCtrl.$setViewValue(permissionNames.map(minterm => minterm.split(/\s*&\s*/)));
    }
}

export default {
    controller: PermissionsMenuController,
    template: permissionsMenuTemplate,
    require: {
        'ngModelCtrl': 'ngModel'
    },
    bindings: {
        disabled: '@?'
    },
    designerInfo: {
        translation: 'ui.components.maPermissionsMenu',
        icon: 'verified_user'
    }
};