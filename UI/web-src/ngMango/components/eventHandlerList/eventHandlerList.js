/**
 * @copyright 2018 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Jared Wiltshire
 */

import eventHandlerListTemplate from './eventHandlerList.html';
import './eventHandlerList.css';

/**
 * @ngdoc directive
 * @name ngMango.directive:maEventHandlerList
 * @restrict E
 * @description Displays a list of event handlers
 */

class EventHandlerListController {
    static get $$ngIsClass() { return true; }
    static get $inject() { return ['maEventHandler', '$scope']; }
    
    constructor(maEventHandler, $scope) {
        this.maEventHandler = maEventHandler;
        this.$scope = $scope;
    }
    
    $onInit() {
        this.ngModelCtrl.$render = () => this.render();
        
        this.doQuery();
        
        this.maEventHandler.subscribe((event, item, originalXid) => {
            if (!this.eventHandlers) return;

            const filterMatches = !this.event || item.hasEventType(this.event.typeId);
            const index = this.eventHandlers.findIndex(eventHandler => eventHandler.id === item.id);
            if (index >= 0) {
                if (!filterMatches || event.name === 'delete') {
                    this.eventHandlers.splice(index, 1);
                } else if (event.name === 'update' || event.name === 'create') {
                    Object.assign(this.eventHandlers[index], item);
                }
            } else if (filterMatches && (event.name === 'update' || event.name === 'create')) {
                this.eventHandlers.push(item);
            }
        }, this.$scope, ['create', 'update', 'delete']);
    }
    
    $onChanges(changes) {
        if (changes.event && !changes.event.isFirstChange()) {
            this.doQuery();
        }
    }
    
    doQuery() {
        const queryBuilder = this.maEventHandler.buildQuery();
        queryBuilder.limit(10000);
        return queryBuilder.query().then(eventHandlers => {
            if (this.event) {
                const eventTypeId = this.event.typeId;
                this.eventHandlers = eventHandlers.filter(eh => eh.hasEventType(eventTypeId));
            } else {
                this.eventHandlers = eventHandlers;
            }
            return this.eventHandlers;
        });
    }
    
    setViewValue() {
        this.ngModelCtrl.$setViewValue(this.selected);
    }
    
    render() {
        this.selected = this.ngModelCtrl.$viewValue;
    }
    
    selectEventHandler(eventHandler) {
        if (this.selected === eventHandler) {
            // create a shallow copy if this eventHandler is already selected
            // causes the model to update
            this.selected = Object.assign(Object.create(this.maEventHandler.prototype), eventHandler);
        } else {
            this.selected = eventHandler;
        }
        
        this.setViewValue();
    }
    
    newEventHandler(event) {
        this.selected = new this.maEventHandler();
        if (this.event) {
            this.selected.addEventType(this.event.getEventType());
        }
        this.setViewValue();
    }
}

export default {
    template: eventHandlerListTemplate,
    controller: EventHandlerListController,
    bindings: {
        event: '<?'
    },
    require: {
        ngModelCtrl: 'ngModel'
    },
    designerInfo: {
        translation: 'ui.components.eventHandlerList',
        icon: 'link'
    }
};
