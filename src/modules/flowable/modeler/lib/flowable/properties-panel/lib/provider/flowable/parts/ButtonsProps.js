'use strict';

var buttons = require('./implementation/Buttons'),
    elementHelper = require('../../../helper/ElementHelper'),
    cmdHelper = require('../../../helper/CmdHelper');


module.exports = function(group, element, bpmnFactory, translate) {

    var propertiesEntry = buttons(element, bpmnFactory, {
        id: 'buttons',
        modelProperties: [ 'name', 'code', 'isHide', 'next' ],
        labels: [ translate('Name'), translate('Code'), translate('IsHide'), translate('Next')],

        getParent: function(element, node, bo) {
            return bo.buttons;
        },

        createParent: function(element, bo) {
            var parent = elementHelper.createElement('bpmn:UserTask', { values: [] }, bo, bpmnFactory);
            var cmd = cmdHelper.updateBusinessObject(element, bo, { userTask: parent });
            return {
                cmd: cmd,
                parent: parent
            };
        }
    }, translate);

    if (propertiesEntry) {
        group.entries.push(propertiesEntry);
    }

};
