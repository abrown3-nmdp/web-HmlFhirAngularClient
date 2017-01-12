/**
 * Created by abrown3 on 1/4/17.
 */
(function () {
    'use strict';

    function typingTestNamesTerminology($scope, typingTestNameService, $uibModal, $filter) {
        /* jshint validthis: true */
        var typingTestNamesTerminologyCtrl = this,
            dateColumnTemplate = '<div class="ui-grid-cell-contents ng-binding ng-scope" title="{{ row.entity.dateCreated | date : \'medium\' }}">{{ row.entity.dateCreated | date : \'medium\' }}</div>',
            activeColumnTemplate = '<button type="button" class="btn btn-link" data-ng-click="grid.appScope.editItem(row.entity)">Edit</button>' +
                '<input type="checkbox" data-ng-model="row.entity.active" />&nbsp;<small>Active</small>',
            deleteColumnTemplate = '<button type="button" class="btn btn-link red-link" data-ng-click="grid.appScope.deleteItem(row.entity)">Delete</button>';

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
                { name: 'name', field: 'name', displayName: 'Name:', cellTooltip: function (row) { return row.entity.name; }, headerTooltip: function(col) { return col.displayName; } },
                { name: 'description', field: 'description', displayName: 'Description:', cellTooltip: function (row) { return row.entity.description ;}, headerTooltip: function(col) { return col.displayName; } },
                { name: 'dateCreated', field: 'dateCreated', displayName: 'Date Created:', cellTemplate: dateColumnTemplate, cellTooltip: function (row) { return parseDate(row.entity.dateCreated); }, headerTooltip: function(col) { return col.displayName; } },
                { name: 'active', field: 'active', displayName: 'Modify', enableColumnMenu: false, cellTemplate: activeColumnTemplate, headerTooltip: function(col) { return col.displayName; } },
                { field: 'delete', displayName: 'Delete', maxWidth: 60, enableColumnMenu: false, cellTemplate: deleteColumnTemplate }
            ]
        };

        typingTestNamesTerminologyCtrl.deleteItem = function (typingTestName) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/common/confirmation-modal.html',
                controller: 'confirmationModal',
                controllerAs: 'confirmationModalCtrl',
                resolve: {
                    title: function () {
                        return 'Remove Typing Test Name from Database?'
                    },
                    message: function () {
                        return 'This action cannot be undone, please ensure you would like to remove the entry with Name: ' +
                                typingTestName.name + ' and Description: ' + typingTestName.description + ' that was Created on: ' +
                                typingTestName.dateCreated;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    typingTestNameService.removeSingleTypingTestNameTerminology(typingTestName).then(function (res) {
                        getTypingTestNames();
                    });
                }
            })
        };

        typingTestNamesTerminologyCtrl.addItem = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                controller: 'typingTestNamesTerminologyAddEditModal',
                controllerAs: 'typingTestNamesTerminologyAddEditModalCtrl',
                templateUrl: 'views/settings/hml/typing-test-names/terminology/typing-test-names-terminology-add-edit-modal.html',
                resolve: {
                    title: function () {
                        return 'Add Typing Test Name Item';
                    },
                    typingTestName: function () {
                        return generateTypingTestName();
                    },
                    edit: function () {
                        return false;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    getTypingTestNames();
                }
            });
        };

        typingTestNamesTerminologyCtrl.editItem = function (typingTestName) {
            var modalInstance = $uibModal.open({
                animation: true,
                controller: 'typingTestNamesTerminologyAddEditModal',
                controllerAs: 'typingTestNamesTerminologyAddEditModalCtrl',
                templateUrl: 'views/settings/hml/typing-test-names/terminology/typing-test-names-terminology-add-edit-modal.html',
                resolve: {
                    title: function () {
                        return 'Edit Typing Test Name Item';
                    },
                    typingTestName: function () {
                        return typingTestName;
                    },
                    edit: function () {
                        return true;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    getTypingTestNames();
                }
            });
        };

        getTypingTestNames();

        function generateTypingTestName() {
            return {
                name: null,
                description: null,
                active: true,
                dateCreated: null,
                id: null
            };
        }

        function parseDate(date) {
            return $filter('date')(date, 'medium');
        }

        function getTypingTestNames() {
            typingTestNameService.getTypingTestNameTerminology(typingTestNamesTerminologyCtrl.maxQuery).then(function (typingTestNames) {
                typingTestNamesTerminologyCtrl.gridOptions.data = typingTestNames;
            });
        }
    }

    angular.module('hmlFhirAngularClientApp.controllers').controller('typingTestNamesTerminology', typingTestNamesTerminology);
    typingTestNamesTerminology.$inject = ['$scope', 'typingTestNameService', '$uibModal', '$filter'];
}());