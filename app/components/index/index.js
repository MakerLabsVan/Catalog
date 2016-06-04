var myApp = angular.module("myApp", []);

myApp.controller("MainCtrl", ["$scope", function ($scope) {
    $scope.categories = {
        "studio": "Studios",
        "tools": "Tools",
        "cons": "Consumables",
        "mats": "Materials"
    };
}]);

myApp.controller("UserCtrl", ["$scope", function($scope){
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

myApp.controller("SearchCtrl", ["$scope", function($scope){
    $scope.count = 0;
}]);


