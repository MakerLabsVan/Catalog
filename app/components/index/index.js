var myApp = angular.module("myApp", []);

myApp.controller("MainCtrl", ["$scope", '$http', function ($scope, $http) {
    $scope.categories = {
        "studio": "Studios",
        "tools": "Tools",
        "cons": "Consumables",
        "mats": "Materials"
    };

    $http({
        method: 'GET',
        url: '//localhost:3000/getData'
    })
        .success(function (data, status, header, config) {
            // success data
            $scope.data = data;

            var studtemp = 0;
            var tooltemp = 0;
            var mattemp = 0;
            var contemp = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i][1] === "Studio") studtemp++;
                if (data[i][1] === "Tool") tooltemp++;
                if (data[i][1] === "Consumable") contemp++;
                if (data[i][1] === "Material") mattemp++;
            }
            $scope.studioSize = studtemp;
            $scope.toolSize = tooltemp;
            $scope.matSize = mattemp;
            $scope.conSize = contemp;

        })
        .error(function (data, status, header, config) {
            // something went wrong
            alert("Something went wrong! Please call for help!");
        });

    $scope.queryTerm = '';
}]);