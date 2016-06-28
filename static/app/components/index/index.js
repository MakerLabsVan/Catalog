angular.module("myApp", ['d3mapping'])

    .controller("MainCtrl", ["$scope", '$http', "$sce", "mapService", function ($scope, $http, $sce, mapService) {

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
            var innerTitle = document.getElementById("ct-index-panel-title-detail");
            innerTitle.innerHTML = object[0] + ' <small>' + object[1] + '</small>';
            innerTitle.style.color = 'white';

            var innerPanel = document.getElementById('ct-idx-ph-det');
            switch (object[1]) {
                case 'Studio':
                    innerPanel.style.background = '#F14A29';
                    break;
                case 'Tool':
                    innerPanel.style.background = '#107CC2';
                    break;
                case 'Material':
                    innerPanel.style.background = '#F3902C';
                    break;
                case 'Consumable':
                    innerPanel.style.background = '#2BAC69';
            };

            var innerBody = document.getElementById("ct-index-panel-body-detail");
            innerBody.innerHTML = 'Image <br /><br /><br /><hr />';

            var i;
            for (i = 1; i < object.length; i++) {
                if (object[i] !== '' && i != 3 && i != 4 && i != 1) {
                    innerBody.innerHTML += '<div class="col-sm-6"><b>' + $scope.entryProperties[i] + '</div></b><div class="col-sm-6" id="ct-index-object-name">' + object[i] + '</div>';
                }
            }

        };

        // map ctrl
        $scope.map1 = mapService.initMap('firstFloorWell', 1);
        $scope.map2 = mapService.initMap('secondFloorWell', 2);

        $scope.resizeMap = mapService.resize($scope.map1);
        $scope.resizeMap = mapService.resize($scope.map2);

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

            if (objectFound[5] === '1') {
                $scope.map1.marker.set(parseInt(objectFound[3]), parseInt(objectFound[4]), $scope.map1.width(), $scope.map1.height())
            }
            else if (objectFound[5] === '2') {
                $scope.map2.marker.set(parseInt(objectFound[3]), parseInt(objectFound[4]), $scope.map2.width(), $scope.map2.height())
            }
        }

        var removeLast = function (lastItem) {
            $scope.map1.marker.remove();
            $scope.map2.marker.remove();
            if (lastItem !== null) {
                if (lastItem[5] === '1') {
                    $scope.map1.studio.dehighlight(lastItem[0].replace(/\s/g, '').replace(/\//g, ''));
                }
                else if (lastItem[5] === '2') {
                    $scope.map2.studio.dehighlight(lastItem[0].replace(/\s/g, '').replace(/\//g, ''));
                }
            }
        }
    }]);

angular.module("myApp").service("mapService", function () {
    var map = function (id, num) {
        return new mapConstructor(id, num);
    }

    var resizeMap = function (map) {
        if (map.width() !== 0) {
            var width = map.width();
            var height = map.height();
        }

        map.studio.resize(width, height);
        map.studio.resize(width, height);
    };

    return {
        initMap: map,
        resize: resizeMap
    }
});