angular.module("myApp").controller("inputCtrl", ["$scope", "$http", function ($scope, $http) {

    $http({
        method: 'GET',
        url: '//localhost:3000/getData'
    })
        .success(function (data, status, header, config) {
            // success data
            $scope.data = data;
        })
        .error(function (data, status, header, config) {
            // something went wrong
            alert("Something went wrong! Please call for help!");
        });

    $scope.entryProperties = [
        "Name", "Type", "Subtype", "Location x (ft)", "Location y (ft)", "Floor", "Width", "Length", "Height", "Units", "Weight", "Weight Unit", "Quantity", "Price"
    ];

    // $scope.entryProperties = [
    //     "Name", "Type", "Subtype", "Width", "Length", "Height", "Units", "Weight", "Weight Unit", "Quantity", "Price"
    // ];

    $scope.inputQuery = '';
    $scope.adminProps = "/views/admin_entryTmpl.html";

    $scope.formData = {};
    $scope.stdPost = function () {
        $http.post('/input', [$scope.formData, $scope.data.length])
            .success(function (data) {
            })
            .error(function (data) {
            })
        $scope.formData = null;
    };

    //TODO: remove watches

    $scope.deletePost = function (objectName) {
        $scope.$watch('data', function () {
            $scope.index;
            for (var i = 0; i < $scope.data.length; i++) {
                if (objectName === $scope.data[i][0]) {
                    $scope.index = i;
                    break;
                }
            }

            $http.post('/delete', [$scope.index])
                .success(function (data) {
                })
                .error(function (data) {
                });
            $scope.data.splice($scope.index, 1);
        })
    };

    $scope.editFormData = {};
    $scope.editEntry = function (objectName) {
        $scope.$watch('data', function () {

        })
        $scope.index;
        for (var i = 0; i < $scope.data.length; i++) {
            if (objectName === $scope.data[i][0]) {
                $scope.index = i;
                break;
            }
        }

        $http.post('/edit', [$scope.editFormData, $scope.index])
            .success(function (data) {
            })
            .error(function (data) {
            })
    };

}]);
