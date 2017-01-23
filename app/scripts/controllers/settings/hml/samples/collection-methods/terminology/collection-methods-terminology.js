/**
 * Created by abrown3 on 1/13/17.
 */
(function () {
    'use strict';

    function collectionMethodsTerminology($scope, collectionMethodService, $uibModal, $filter, toaster, objectModelFactory) {
        /* jshint validthis: true */
        var collectionMethodsTerminologyCtrl = this,
            dateColumnTemplate = '<div class="ui-grid-cell-contents ng-binding ng-scope" title="{{ row.entity.dateCreated | date : \'medium\' }}">{{ row.entity.dateCreated | date : \'medium\' }}</div>',
            activeColumnTemplate = '<button type="button" class="btn btn-link" data-ng-click="grid.appScope.editItem(row.entity)">Edit</button>' +
                '<input type="checkbox" data-ng-model="row.entity.active" />&nbsp;<small>Active</small>',
            deleteColumnTemplate = '<button type="button" class="btn btn-link red-link" data-ng-click="grid.appScope.deleteItem(row.entity)">Delete</button>';

        collectionMethodsTerminologyCtrl.scope = $scope;
        collectionMethodsTerminologyCtrl.maxQuery = 10;
        collectionMethodsTerminologyCtrl.pageNumber = 0;
        collectionMethodsTerminologyCtrl.gridOptions = {
            data: [],
            enableSorting: true,
            showGridFooter: true,
            enableCellEditOnFocus: true,
            appScopeProvider: collectionMethodsTerminologyCtrl,
            columnDefs: [
                { name: 'id', field: 'id', visible: false },
                { name: 'name', field: 'name', displayName: 'Name:', cellTooltip: function (row) { return row.entity.name; }, headerTooltip: function(col) { return col.displayName; } },
                { name: 'description', field: 'description', displayName: 'Description', cellTooltip: function (row) { return row.entity.description; }, headerTooltip: function(col) { return col.displayName; } },
                { name: 'dateCreated', field: 'dateCreated', displayName: 'Date Created:', cellTemplate: dateColumnTemplate, cellTooltip: function (row) { return parseDate(row.entity.dateCreated); }, headerTooltip: function(col) { return col.displayName; } },
                { name: 'active', field: 'active', displayName: 'Modify', enableColumnMenu: false, cellTemplate: activeColumnTemplate, headerTooltip: function(col) { return col.displayName; } },
                { field: 'delete', displayName: 'Delete', maxWidth: 60, enableColumnMenu: false, cellTemplate: deleteColumnTemplate }
            ]
        };

        collectionMethodsTerminologyCtrl.deleteItem = function (collectionMethod) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/common/confirmation-modal.html',
                controller: 'confirmationModal',
                controllerAs: 'confirmationModalCtrl',
                resolve: {
                    title: function () {
                        return 'Remove Reporting Center from Database?'
                    },
                    message: function () {
                        return 'This action cannot be undone, please ensure you would like to remove the entry with Name: ' +
                            collectionMethod.name + ' that was Created on: ' + collectionMethod.dateCreated;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    collectionMethodService.removeCollectionMethodTerminology(collectionMethod).then(function (res) {
                        getCollectionMethods();

                        if (res) {
                            toaster.pop({
                                type: 'info',
                                body: 'Successfully deleted Collection Method entry.'
                            });
                        }
                    });
                }
            })
        };

        collectionMethodsTerminologyCtrl.addItem = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                controller: 'collectionMethodsTerminologyAddEditModal',
                controllerAs: 'collectionMethodsTerminologyAddEditModalCtrl',
                templateUrl: 'views/settings/hml/samples/terminology/collection-methods-terminology-add-edit-modal.html',
                resolve: {
                    title: function () {
                        return 'Add Typing Test Name Item';
                    },
                    collectionMethod: function () {
                        return objectModelFactory.getCollectionMethodModel();
                    },
                    edit: function () {
                        return false;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    getCollectionMethods();

                    toaster.pop({
                        type: 'info',
                        body: 'Successfully added Collection Method entry.'
                    });
                }
            });
        };

        collectionMethodsTerminologyCtrl.editItem = function (collectionMethod) {
            var modalInstance = $uibModal.open({
                animation: true,
                controller: 'collectionMethodsTerminologyAddEditModal',
                controllerAs: 'collectionMethodsTerminologyAddEditModalCtrl',
                templateUrl: 'views/settings/hml/samples/terminology/collection-methods-terminology-add-edit-modal.html',
                resolve: {
                    title: function () {
                        return 'Edit Reporting Center Item';
                    },
                    collectionMethod: function () {
                        return collectionMethod;
                    },
                    edit: function () {
                        return true;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    getCollectionMethods();

                    toaster.pop({
                        type: 'info',
                        body: 'Successfully edited Collection Method entry.'
                    });
                }
            });
        };

        getCollectionMethods();

        function parseDate(date) {
            return $filter('date')(date, 'medium');
        }

        function getCollectionMethods() {
            collectionMethodService.getCollectionMethodTerminology(collectionMethodsTerminologyCtrl.maxQuery, collectionMethodsTerminologyCtrl.pageNumber).then(function (collectionMethods) {
                collectionMethodsTerminologyCtrl.gridOptions.data = collectionMethods;
            });
        }
    }

    angular.module('hmlFhirAngularClientApp.controllers').controller('collectionMethodsTerminology', collectionMethodsTerminology);
    collectionMethodsTerminology.$inject = ['$scope', 'collectionMethodService', '$uibModal', '$filter', 'toaster', 'objectModelFactory'];
}());