angular.module("myApp").controller("inputCtrl", ["$scope", "$http", "mapService", "highlightService", function ($scope, $http, mapService, highlightService) {
    // authorized data retrieval 
    $http.get('/getData')
        .success(function (data, status, header, config) {
            // success data
            $scope.data = data;
            $scope.dataLength = data.length;
            $scope.data[0].pop();
            $scope.entryProperties = $scope.data[0];
            $scope.data.shift();

        })
        .error(function (data, status, header, config) {
            // something went wrong
            alert("Something went wrong! Refresh or call for help!");
        });

    $scope.inputQuery = '';

    // make a new entry
    $scope.formData = {};
    $scope.newEntry = function () {
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
            })
            .error(function (data, status, header, config) {
                console.log(data, status);
            })
    };

    // delete an entry
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

    // submit edit
    $scope.editFormData = {};
    $scope.editEntry = function (objectName) {
        $scope.index;
        for (var i = 0; i < $scope.dataLength; i++) {
            if (objectName === $scope.data[i][0]) {
                $scope.index = i + 1;
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

    // change to edit tab
    $scope.makeActive = function () {
        document.getElementById('input-edit-tab').className = 'active';
        document.getElementById('newEntryTab').className = '';
    };

    // display edit input page
    $scope.showEditPage = function (curObject) {
        $scope.object = curObject;
        var i;
        // create edit values on click
        for (i = 0; i < $scope.entryProperties.length; i++) {
            $scope.editFormData[$scope.entryProperties[i]] = curObject[i];
        }
        $scope.templateURL = 'editEntryTmpl';
    };

    // return to default edit page
    $scope.clearEditPage = function () {
        $scope.templateURL = 'clearEditPage';
    };

    // remove location, floor input 
    $scope.editPageCols = function (prop) {
        $scope.$watch('editFormData', function () {
            if (prop.toLowerCase().indexOf('location') != -1) {
                document.getElementById(prop).remove();
                document.getElementById(prop + 'label').remove();
            }
        });
    };

    // highlight selected entry
    $scope.highlightItem = highlightService.highlight;

    // load maps
    $scope.map1 = mapService.initMap('edit-first-floor', 1);
    $scope.map2 = mapService.initMap('edit-second-floor', 2);
    // show markers on map on click
    $scope.map1.marker.onClick();
    $scope.map2.marker.onClick();

    // save location on selection
    $scope.getLocation = function (floor) {
        if (floor == 1) {
            // translate from pixels to measurement units
            var pos = $scope.map1.marker.getLocation($scope.map1.width(), $scope.map1.height(), 1);
            $scope.editFormData["Location x (ft)"] = pos[0].toFixed(1);
            $scope.editFormData["Location y (ft)"] = pos[1].toFixed(1);
            $scope.editFormData.Floor = 1;
        } else {
            var pos = $scope.map2.marker.getLocation($scope.map2.width(), $scope.map2.height(), 2);
            $scope.editFormData["Location x (ft)"] = pos[0].toFixed(1);
            $scope.editFormData["Location y (ft)"] = pos[1].toFixed(1);
            $scope.editFormData.Floor = 2;
        }
    };


}]);