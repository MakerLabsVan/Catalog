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

        $scope.showEntryDetails = function (object) {
            document.getElementById("ct-index-panel-title-detail").innerHTML = object[0] + ' <small>' + object[1] + '</small>';
            var innerBody = document.getElementById("ct-index-panel-body-detail");
            innerBody.innerHTML = '';
            innerBody.innerHTML = 'Image <br /><br /><br /><hr />';
            var i;
            for (i = 1; i < object.length; i++) {
                if (object[i] !== '') {
                    innerBody.innerHTML += '<div class="col-sm-6"><b>' + $scope.entryProperties[i] + '</div></b><div class="col-sm-6" id="ct-index-object-name">' + object[i] + '</div>';
                }
            }

        };

        // map ctrl
        $scope.map1 = new mapConstructor('firstFloorWell', 1);
        $scope.map2 = new mapConstructor('secondFloorWell', 2);

        $scope.resizeMap = function () {
            if ($scope.map2.width() !== 0) {
                var width = $scope.map2.width();
                var height = $scope.map2.height();
            }
            else {
                var width = $scope.map1.width();
                var height = $scope.map1.height();
            }
            $scope.map1.studio.resize(width, height);
            $scope.map2.studio.resize(width, height);
        };

        $scope.lastItem = null;
        //Highlight the studio given the name of the studio as aparam
        $scope.showStudioLoc = function (studioName) {
            removeLast($scope.lastItem);
            var elementPos = $scope.data.map(function (x) { return x[0]; }).indexOf(studioName);
            var objectFound = $scope.data[elementPos];
            $scope.lastItem = objectFound;
            if (objectFound === null) { return 'Not Found' }
            //TODO: Optimize it to not search
            if (objectFound[5] === '1') {
                $scope.map1.studio.highlight(objectFound[0].replace(/\s/g, '').replace(/\//g, ''));
            }
            else if (objectFound[5] === '2') {
                $scope.map2.studio.highlight(objectFound[0].replace(/\s/g, '').replace(/\//g, ''));
            }
        }

        //Place marker where the item
        $scope.showItemLoc = function (itemName) {
            removeLast($scope.lastItem);
            var elementPos = $scope.data.map(function (x) { return x[0]; }).indexOf(itemName);
            var objectFound = $scope.data[elementPos];
            $scope.lastItem = objectFound;
            if (objectFound === null) { return 'Not Found' }

            if ( objectFound[5] === '1') {
                $scope.map1.marker.set(parseInt(objectFound[3]), parseInt(objectFound[4]), $scope.map1.width(), $scope.map1.height())
            }
            else if ( objectFound[5] === '2') {
                $scope.map2.marker.set(parseInt(objectFound[3]), parseInt(objectFound[4]), $scope.map2.width(), $scope.map2.height())
            }
        }

        var removeLast = function( lastItem ){
          $scope.map1.marker.remove();
          $scope.map2.marker.remove();
          if ( lastItem !==null ){
            if (lastItem[5] === '1') {
                $scope.map1.studio.dehighlight(lastItem[0].replace(/\s/g, '').replace(/\//g, ''));
            }
            else if (lastItem[5] === '2') {
                $scope.map2.studio.dehighlight(lastItem[0].replace(/\s/g, '').replace(/\//g, ''));
            }
          }
        }

    }]);
