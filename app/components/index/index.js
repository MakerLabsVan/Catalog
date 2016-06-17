var myApp = angular.module("myApp", ['ui.bootstrap', 'd3mapping', 'popoverApp']);

myApp.controller("MainCtrl", ["$scope", '$http', "$sce", function ($scope, $http, $sce) {

    $scope.categories = {
        "studio": "Studios",
        "tools": "Tools",
        "cons": "Consumables",
        "mats": "Materials"
    };

    $scope.entryProperties = [
        "Name", "Type", "Subtype", "Location x (ft)", "Location y (ft)", "Floor", "Width", "Length", "Depth", "Units", "Weight", "Weight Unit", "Quantity"
    ]

    $scope.queryTerm = '';
    $scope.inputQuery = '';

    $scope.entryProps = "/views/entryTpls.html";
    $scope.adminProps = "/views/adminEntry.html";

    $scope.changeH = function () {
        // if searching but no click =
        if ($scope.queryTerm.length == 0) {
            document.getElementById("searchSection").style.height = '0px';
        } else {
            document.getElementById("searchSection").style.height = '385px';
        }
    };

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

    $scope.clearForm = function () {
        $scope.formData = null;
    };

    $scope.stdPost = function () {
        $http.post('/input', $scope.formData)
            .success(function (data) {
            })
            .error(function (data) {
            })
        $scope.clearForm();
    };


    // deletePost now sends object name and data array to server to avoid making another GET call
    $scope.deletePost = function () {
        $scope.myObject = this.object;
        $scope.$watch(function () {
            return $scope.myObject;
        }, function () {
            console.log($scope.myObject);
            console.log($scope.data);
            $scope.index;
            for (var i = 0; i < $scope.data.length; i++) {
                if ($scope.myObject[0] === $scope.data[i][0]) {
                    $scope.index = i;
                    break;
                }
            }
            $http.post('/delete', [$scope.index, $scope.myObject])
                .success(function (data) {
                    
                })
                .error(function (data) {
                });
        })
    };
}]);