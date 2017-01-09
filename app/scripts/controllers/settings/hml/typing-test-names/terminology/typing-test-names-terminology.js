/**
 * Created by abrown3 on 1/4/17.
 */
(function () {
    'use strict';

    function typingTestNamesTerminology($scope, typingTestNameService) {
        /* jshint validthis: true */
        var typingTestNamesTerminologyCtrl = this,
            activeColumnTemplate = '<button type="button" class="btn btn-link" data-ng-click="grid.appScope.editItem(row.entity)">Edit</button>' +
                                   '&nbsp;' + '<input type="checkbox" data-ng-model="row.entity.active" />&nbsp;<small>Active</small>';

        typingTestNamesTerminologyCtrl.scope = $scope;
        typingTestNamesTerminologyCtrl.maxQuery = 10;
        typingTestNamesTerminologyCtrl.gridOptions = {
            data: [],
            enableSorting: true,
            showGridFooter: true,
            enableCellEditOnFocus: true,
            appScopeProvider: typingTestNamesTerminologyCtrl,
            columnDefs: [
                { name: 'id', field: 'id', visible: false },
                { name: 'name', field: 'name', displayName: 'Name:', enableCellEdit: true },
                { name: 'description', field: 'description', displayName: 'Description:' },
                { name: 'dateCreated', field: 'dateCreated', displayName: 'Date Created:' },
                { name: 'active', field: 'active', displayName: 'Modify', cellTemplate: activeColumnTemplate }
            ]
        };

        typingTestNamesTerminologyCtrl.activateItem = function (typingTestName) {

        };

        typingTestNamesTerminologyCtrl.editItem = function (typingTestName) {

        };

        typingTestNameService.getTypingTestNameTerminology(typingTestNamesTerminologyCtrl.maxQuery).then(function (typingTestNames) {
            typingTestNamesTerminologyCtrl.gridOptions.data = typingTestNames;
        });
    }

    angular.module('hmlFhirAngularClientApp.controllers').controller('typingTestNamesTerminology', typingTestNamesTerminology);
    typingTestNamesTerminology.$inject = ['$scope', 'typingTestNameService'];
}());