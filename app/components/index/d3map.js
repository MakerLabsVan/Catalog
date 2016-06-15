var app = angular.module("d3mapp", []);

app.controller("mapController", ["$scope", '$http', "$sce", function ($scope, $http, $sce) {
    $http({
        method: 'GET',
        url: '//localhost:3000/getData'
    })
        .success(function (data, status, header, config) {
            // success data
            $scope.data = data;
            $scope.test= data[1][4]
            $scope.studioData = [];
            $scope.itemData=[];
            for (var i = 0; i < data.length; i++) {
//{"rx":0,"ry":20,"height":5, "width":10,"id":"studio1"}
                if (data[i][1] === "Studio") {
                  var obj ={ "rx:" + data[i][3] +"," +
                            "ry:" + data[i][4] + "," +
                            "floor:" + data[i][5] + "," +
                            "width:" + data[i][6] + "," +
                            "height:" + data[i][7] + "," +
                            "id:" + "\"" + data[i][0] + "\"" };
                    $scope.studioData = $scope.studioData.concat(obj);
                    console.log($scope.studioData)
                }
                else {

                }
              }

        })
        .error(function (data, status, header, config) {
            // something went wrong
            alert("Something went wrong! Please call for help!");
        });
}]);
