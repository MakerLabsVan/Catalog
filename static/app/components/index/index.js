angular.module("myApp", ['d3mapping'])

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
            "Name", "Type", "Subtype", "Location x (ft)", "Location y (ft)", "Floor", "Width", "Length", "Depth", "Units", "Weight", "Weight Unit", "Quantity", "Price", "Description", "Keywords"
        ];

        $scope.queryTerm = '';

        $scope.changeHeight = function () {
            if ($scope.queryTerm.length == 0) {
                document.getElementById("searchSection").style.height = '0px';
            } else {
                document.getElementById("searchSection").style.height = '50vh';
            }
        };

        $scope.assignColor = function () {
        }

        $scope.showEntryDetails = function (object) {
            document.getElementById("ct-index-panel-title-detail").innerHTML = object[0];
            var innerBody = document.getElementById("ct-index-panel-body-detail");
            innerBody.innerHTML = '';
            innerBody.innerHTML = 'Image <br /><br /><br /><hr />';
            var i;
            for (i = 1; i < object.length; i++) {
                if (object[i] !== '') {
                    innerBody.innerHTML += '<b>' + $scope.entryProperties[i] + ': </b>' + object[i] + '<br /><br />';
                }
            }

        };


    }]);
