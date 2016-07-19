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
    $scope.insert = function () {
        // get type from radio buttons
        $scope.form.type = $("input[name='typeOptions']:checked").val();

        // make array to pass in
        var values = [];
        for (i in $scope.dataLabels){
            values.push($scope.form[$scope.dataLabels[i]]);
        }

        adminHttpRequests.insert(values, $scope.dataLength).then(function (result) {
            console.log(result);
            $scope.form = {};
        });
    };

    // delete an entry
    $scope.deletePost = function (objectKey) {
        $scope.index;
        for (var i = 0; i < $scope.dataLength; i++) {
            if (objectKey === $scope.data[i][0]) {
                $scope.index = i;
                break;
            }
        }

        $http.post('/delete', [$scope.index])
            .success(function (data, status, header, config) {
                console.log(data, status);
                $scope.dataLength--;
                $scope.clearEditPage();
            })
            .error(function (data, status, header, config) {
                console.log(data, status);
            });
        $scope.data.splice($scope.index, 1);
    };

    // submit edit
    $scope.editform = {};
    $scope.editEntry = function (objectKey, metaData) {
        $scope.index;
        for (var i = 0; i < $scope.dataLength; i++) {
            if (objectKey === $scope.data[i][20]) {
                $scope.index = i + 1;
                // maybe change all properties?
                $scope.data[i][0] = $scope.editform.Name;
                break;
            }
        }
        $scope.editform.metadata = metaData;
        $http.post('/edit', [$scope.editform, $scope.index])
            .success(function (data, status, header, config) {
                console.log(data, status);
            })
            .error(function (data, status, header, config) {
                console.log(data, status);
            });
    };

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
        }
    }
});