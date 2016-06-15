var app = angular.module("d3map", []);

app.controller("mapController", ["$scope", '$http', function ($scope, $http) {
    $http({
        method: 'GET',
        url: '//localhost:3000/getData'
    })
        .success(function (data, status, header, config) {
            // success data
            $scope.data = data;

            for (var i = 0; i < data.length; i++) {
                if (data[i][1] === "Studio") studtemp++;
                if (data[i][1] === "Tool") tooltemp++;
                if (data[i][1] === "Consumable") contemp++;
                if (data[i][1] === "Material") mattemp++;
            }
        })
        .error(function (data, status, header, config) {
            // something went wrong
            alert("Something went wrong! Please call for help!");
        });

}]);
