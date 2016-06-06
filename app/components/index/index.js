var myApp = angular.module("myApp", []);

myApp.controller("MainCtrl", ["$scope", function ($scope) {
    $scope.categories = {
        "studio": "Studios",
        "tools": "Tools",
        "cons": "Consumables",
        "mats": "Materials"
    };
}]);

myApp.controller("UserCtrl", ["$scope", function ($scope) {
    // namespace user details
    $scope.user = {};
    // details is arbitrary naming scheme
    $scope.user.details = {
        "Andrew": {
            "username": "Andrew Song",
            "id": "89101112"
        },
        "Sunny": {
            "username": "Sunny L",
            "id": "123456"
        },
        "Brian": {
            "username": "Brian N",
            "id": "654321"
        }
    };

}]);

myApp.controller("DataCtrl", ['$scope', '$http', function ($scope, $http) {
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
        });
}]);
