angular.module("myApp").controller("inputCtrl", ["$scope", "$http", function ($scope, $http) {
    $http.get('/getData')
        .success(function (data, status, header, config) {
            // success data
            $scope.data = data;
            $scope.dataLength = data.length;


        })
        .error(function (data, status, header, config) {
            // something went wrong
            alert("Something went wrong! Please call for help!");
        });

    $scope.entryProperties = [
        "Name", "Type", "Subtype", "Location x (ft)", "Location y (ft)", "Floor", "Width", "Length", "Height", "Units", "Weight", "Weight Unit", "Quantity", "Price", "Description", "Keywords"
    ];


    $scope.inputQuery = '';
    $scope.adminProps = "/templates/admin_entryTmpl.html";


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
                break;
            }
        }

        $http.post('/edit', [$scope.editFormData, $scope.index])
            .success(function (data, status, header, config) {
                console.log(data, status);
                $scope.editFormData = {};
            })
            .error(function (data, status, header, config) {
                console.log(data, status);
            });
    };

    // change type when clicking the category tabs and remove some labels
    $scope.setType = function (type) {
        $scope.formData['Type'] = type;
    };

}]);
