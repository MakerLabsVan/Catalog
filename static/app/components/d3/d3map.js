var app = angular.module("d3mapping", []);

app.controller("mapController", ["$scope", '$http', "$sce", function ($scope, $http, $sce) {

    $http({
        method: 'GET',
        url: '//localhost:3000/getData'
    })
        .success(function (data, status, header, config) {
            // success data
            $scope.data = data;
            $scope.test = data[1][4]
            $scope.studioData = [];
            $scope.itemData = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i][1] === "Studio") {
                    var obj = {
                        "rx": parseInt(data[i][3]),
                        "ry": parseInt(data[i][4]),
                        "floor": parseInt(data[i][5]),
                        "height": parseInt(data[i][7]),
                        "width": parseInt(data[i][6]),
                        "id": data[i][0]
                    };
                    $scope.studioData = $scope.studioData.concat(obj);
                }
                else {
                    var obj = {
                        "x": parseInt(data[i][3]),
                        "y": parseInt(data[i][4]),
                        "floor": parseInt(data[i][5]),
                        "height": parseInt(data[i][7]),
                        "width": parseInt(data[i][6]),
                        "id": data[i][0]
                    };
                    $scope.itemData = $scope.itemData.concat(obj);
                }
            }
        })
        .error(function (data, status, header, config) {
            // something went wrong
            alert("Something went wrong! Please call for help!");
        });
}]);

//Directives for D3, in progress, may not use
var containerID = "firstFloorWell";
var floorNum = 1;
app.directive("makerMap", function () {
    return {
        scope: false,
        link: function (scope, elem, attrs) {
            var map1 = new mapConstructor("firstFloorWell", 1);
            var map2 = new mapConstructor("secondFloorWell", 2);
            map2.marker.onClick();
            map1.marker.onClick();
            var rectangleData = [
                { "rx": 0, "ry": 20, "height": 5, "width": 10, "id": "studio1" },
                { "rx": 20, "ry": 70, "height": 5, "width": 15, "id": "studio2" },
                { "rx": 69, "ry": 69, "height": 5, "width": 5, "id": "studio3" }];
            var rectangleData2 = [
                { "rx": 0, "ry": 0, "height": 5, "width": 10, "id": "studio4" },
                { "rx": 20, "ry": 70, "height": 5, "width": 15, "id": "studio5" },
                { "rx": 69, "ry": 69, "height": 5, "width": 5, "id": "studio6" }];


            map1.studio.resize(1 / 20);
            map2.studio.resize(1 / 20);

        }
    }
})
