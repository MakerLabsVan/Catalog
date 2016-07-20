var inputApp = angular.module('inputApp', ['indexApp']);

inputApp.controller("inputCtrl", ["$scope", "$http", "mapService", "highlightService", "adminHttpRequests", function ($scope, $http, mapService, highlightService, adminHttpRequests) {

    adminHttpRequests.admin_getCatalog().then(function (data) {
        $scope.data = data;

        // labels to use for object
        $scope.dataLabels = data[1];

        // labels to display
        $scope.entryProperties = data[0];
        // entryProperty object (testing)
        $scope.entryPropertiesObj = {};
        for (i in $scope.entryProperties) {
            $scope.entryPropertiesObj[$scope.dataLabels[i]] = $scope.entryProperties[i];
        }

        // shift data
        $scope.data.shift();
        $scope.data.shift();
        $scope.dataLength = data.length;

        // removed 2 frozen rows
        var shiftedData = $scope.data;

        // object entries
        // THIS IS THE NEW DATA LIST IN OBJECT FORM
        $scope.entries = {};
        // use loop to make the object
        for (i in shiftedData) {
            var object = {};
            for (j in $scope.dataLabels) {
                // ex. object.name.label
                object[$scope.dataLabels[j]] = shiftedData[i][j];
            }
            // number could change
            $scope.entries[shiftedData[i][21]] = object;
        }
        ;

        // make category data
        $scope.studioEntries = {};
        $scope.materialEntries = {};
        $scope.toolEntries = {};
        $scope.consumableEntries = {};

        for (key in $scope.entries) {
            // why doesn't entries.key work here
            switch ($scope.entries[key].type) {
                case 'Studio':
                    $scope.studioEntries[key] = $scope.entries[key];
                    break;
                case 'Material':
                    $scope.materialEntries[key] = $scope.entries[key];
                    break;
                case 'Tool':
                    $scope.toolEntries[key] = $scope.entries[key];
                    break;
                case 'Consumable':
                    $scope.consumableEntries[key] = $scope.entries[key];
            }
        }
        // but entries.key works here
    });

    $scope.inputQuery = '';
    // repeated functions in index
    var isIndexOf = function (property) {
        if (property == undefined) {
            return false;
        } else if (property.toLowerCase().indexOf($scope.inputQuery.toLowerCase()) != -1) {
            return true;
        }
    };

    var isIndexOfSet = function (entry) {
        if (isIndexOf(entry.name) ||
            isIndexOf(entry.type) ||
            isIndexOf(entry.subtype) ||
            isIndexOf(entry.keywords)) {
            return true;
        }
    };

    $scope.filterSearch = function (entry) {
        if ($scope.inputQuery.length >= 2) {
            if (isIndexOfSet(entry)) {
                return entry.name;
            }
        } else if ($scope.inputQuery.length == 0) {
            return entry.name;
        }
    };

    // make a new entry
    $scope.form = {};
    $scope.insert = function (row) {
        // get type from radio buttons
        $scope.form.type = $("input[name=typeOptions]:checked").val();

        // make array to pass in
        var values = [];
        for (i in $scope.dataLabels) {
            values.push($scope.form[$scope.dataLabels[i]]);
        }

        adminHttpRequests.insert(values, row).then(function (result) {
            console.log(result);
            $scope.form = {};
        });
    };

    var findIndex = function () {
        // find index of selected
        var keyString = $scope.selectedEntry.key;
        // offset to account for frozen rows and the parse function in serverOps
        const offset = 1;
        var index = parseInt(keyString.slice(1, keyString.length)) - offset;
        return index;
    }

    // edit an entry
    $scope.edit = function () {
        // find index of selected
        var index = findIndex();
        $scope.insert(index);
    };

    // delete an entry
    $scope.delete = function () {
        const offset = 2;
        var index = findIndex() + offset;
        adminHttpRequests.delete([index]).then(function (result) {
            console.log(result);
        });
    };

    $scope.selectEntry = function (entry) {
        $scope.selectedEntry = entry;

        $scope.highlightItem('admin_' + entry.key);
        $('#deleteBtn').removeClass('hidden');
        $('#editBtn').removeClass('hidden');
        $('#submitBtn').addClass('hidden');

        // fill form
        for (i in entry) {
            $scope.form[i] = entry[i];
        }

        var btnGroup = $('#buttonGroup');

        // inactive div
        btnGroup.find('div.active').removeClass('active');
        // unchecked btn
        btnGroup.find('input[name=typeOptions]:checked').prop('checked', false);
        // active div

        switch (entry.type) {
            case 'Studio':
                btnGroup.find('#stdTypeDiv').addClass('active');
                break;
            case 'Material':
                btnGroup.find('#matTypeDiv').addClass('active');
                break;
            case 'Tool':
                btnGroup.find('#conTypeDiv').addClass('active');
                break;
            case 'Consumable':
                btnGroup.find('#toolTypeDiv').addClass('active');
        }
    };

    $scope.clearForm = function () {
        $scope.form = {};
        $('#buttonGroup').find('.active').removeClass('active');
        $('#deleteBtn').addClass('hidden');
        $('#editBtn').addClass('hidden');
        $('#submitBtn').removeClass('hidden');

    }


    // highlight selected entry
    $scope.highlightItem = highlightService.highlight;

}]);

inputApp.factory('adminHttpRequests', function ($http) {
    return {
        admin_getCatalog: function () {
            return $http.get('getCatalog')
                .then(function (result) {
                    return result.data;
                })
        },
        insert: function (entry, row) {
            return $http.post('new', [entry, row])
                .then(function (result) {
                    return result.data;
                })
        },
        delete: function (index) {
            return $http.post('delete', [index])
                .then(function (result) {
                    return result.data;
                })
        }
    }
});