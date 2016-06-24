angular.module("myApp", ['ui.bootstrap', 'd3mapping'])

    .controller("MainCtrl", ["$scope", '$http', "$sce", function ($scope, $http, $sce) {

        $http.get('/getData')
            .success(function (data, status, header, config) {
                // success data
                $scope.data = data;
            })
            .error(function (data, status, header, config) {
                // something went wrong
                alert("Something went wrong! Please call for help!");
            });

        $scope.categories = {
            "studio": "Studios",
            "tools": "Tools",
            "cons": "Consumables",
            "mats": "Materials"
        };

        $scope.entryProperties = [
            "Name", "Type", "Subtype", "Location x (ft)", "Location y (ft)", "Floor", "Width", "Length", "Depth", "Units", "Weight", "Weight Unit", "Quantity", "Price", "Keywords"
        ];

        $scope.queryTerm = '';

        $scope.entryProps = "/views/entryTmpl.html";

        $scope.changeHeight = function () {
            if ($scope.queryTerm.length == 0) {
                document.getElementById("searchSection").style.height = '0px';
            } else {
                document.getElementById("searchSection").style.height = '385px';
            }
        };

        //drawMap("firstFloorWell", 1);


    }]);
