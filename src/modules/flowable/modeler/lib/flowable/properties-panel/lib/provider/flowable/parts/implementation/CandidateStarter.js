'use strict';

var entryFactory = require('../../../../factory/EntryFactory');

var cmdHelper = require('../../../../helper/CmdHelper');

module.exports = function (element, bpmnFactory, options, translate, config) {

    var getBusinessObject = options.getBusinessObject;

    var candidateStarterGroupsEntry = entryFactory.selectBox({
        id: 'candidateStarterGroups',
        label: translate('Candidate Starter Groups'),
        modelProperty: 'candidateStarterGroups',
        description: translate('Specify more than one group as a comma separated list.'),

        get: function (element, node) {
            var bo = getBusinessObject(element);
            var candidateStarterGroups = bo.get('flowable:candidateStarterGroups');

            return {
                candidateStarterGroups: candidateStarterGroups ? candidateStarterGroups : ''
            };
        },

        set: function (element, values) {
            var bo = getBusinessObject(element);
            return cmdHelper.updateBusinessObject(element, bo, {
                'flowable:candidateStarterGroups': values.candidateStarterGroups || undefined
            });
        },
        selectOptions: function () {
            return config.loadCandidateGroups()
        }

    });

    var candidateStarterUsersEntry = entryFactory.selectBox({
        id: 'candidateStarterUsers',
        label: translate('Candidate Starter Users'),
        modelProperty: 'candidateStarterUsers',
        description: translate('Specify more than one user as a comma separated list.'),

        get: function (element, node) {
            var bo = getBusinessObject(element);
            var candidateStarterUsers = bo.get('flowable:candidateStarterUsers');

            return {
                candidateStarterUsers: candidateStarterUsers ? candidateStarterUsers : ''
            };
        },

        set: function (element, values) {
            var bo = getBusinessObject(element);
            return cmdHelper.updateBusinessObject(element, bo, {
                'flowable:candidateStarterUsers': values.candidateStarterUsers || undefined
            });
        },
        selectOptions: function () {
            return config.loadCandidateUsers()
        }

    });

    return [
        candidateStarterGroupsEntry,
        candidateStarterUsersEntry
    ];
};
