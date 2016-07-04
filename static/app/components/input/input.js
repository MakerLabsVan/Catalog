angular.module("myApp").controller("inputCtrl", ["$scope", "$http", "mapService", function ($scope, $http, mapService) {
    $http.get('/getData')
        .success(function (data, status, header, config) {
            // success data
            $scope.data = data;
            $scope.dataLength = data.length;
            $scope.entryProperties = $scope.data[0];
            $scope.data.shift();

        })
        .error(function (data, status, header, config) {
            // something went wrong
            alert("Something went wrong! Please call for help!");
        });

    $scope.inputQuery = '';

    $scope.formData = {};
    $scope.stdPost = function (type) {
        var localEntry = [];
        for (var prop in $scope.formData) {
            if ($scope.formData.hasOwnProperty(prop)) {
                localEntry.push($scope.formData[prop]);
            }
        }

        $http.post('/new', [$scope.formData, $scope.dataLength])
            .success(function (data, status, header, config) {
                console.log(data, status);
                // push to client array
                $scope.dataLength++;
                $scope.data.push(localEntry);
                $scope.formData = {};
                $scope.setType(type);
            })
            .error(function (data, status, header, config) {
                console.log(data, status);
            })
    };

    $scope.deletePost = function (objectName) {
        $scope.index;
        for (var i = 0; i < $scope.dataLength; i++) {
            if (objectName === $scope.data[i][0]) {
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

    $scope.editFormData = {};
    $scope.editEntry = function (objectName) {
        $scope.index;
        for (var i = 0; i < $scope.dataLength; i++) {
            if (objectName === $scope.data[i][0]) {
                $scope.index = i;
                // maybe change all properties?
                $scope.data[i][0] = $scope.editFormData.Name;
                break;
            }
        }
        $http.post('/edit', [$scope.editFormData, $scope.index])
            .success(function (data, status, header, config) {
                console.log(data, status);
            })
            .error(function (data, status, header, config) {
                console.log(data, status);
            });
    };

    // change type when clicking the category tabs and remove some labels
    $scope.setType = function (type) {
        $scope.formData['Type'] = type;
    };

    $scope.makeActive = function () {
        document.getElementById('input-edit-tab').className = 'active';
        document.getElementById('input-std-tab').className = '';
        document.getElementById('input-tl-tab').className = '';
        document.getElementById('input-mat-tab').className = '';
        document.getElementById('input-con-tab').className = '';
    };

    $scope.showEditPage = function (curObject) {
        $scope.object = curObject;
        var i;
        // create edit values on click
        for (i = 0; i < $scope.entryProperties.length; i++) {
            $scope.editFormData[$scope.entryProperties[i]] = curObject[i];
        }
        $scope.templateURL = 'editEntryTmpl';
    };

    $scope.clearEditPage = function () {
        $scope.templateURL = 'clearEditPage';
    };

    $scope.editPageCols = function (prop) {
        $scope.$watch('editFormData', function () {
            if (prop.toLowerCase().indexOf('location') != -1) {
                document.getElementById(prop).remove();
                document.getElementById(prop + 'label').remove();
            }

            if (prop.toLowerCase().indexOf('description') != -1) {
                document.getElementById(prop).className = 'col-sm-12';
            }
        });
    };

    $scope.map1 = mapService.initMap('edit-first-floor', 1);
    $scope.map2 = mapService.initMap('edit-second-floor', 2);

}]);
