angular.module("myApp", ['d3mapping'])

    .controller("MainCtrl", ["$scope", '$http', "mapService", "highlightService", function ($scope, $http, mapService, highlightService) {

        // init call of data (put in var)
        $http.get('/publicGetData')
            .success(function (data, status, header, config) {
                // success data
                $scope.data = data;
                $scope.entryProperties = $scope.data[0];
                $scope.index = {
                    "x": $scope.entryProperties.indexOf('Location x (ft)'),
                    "y": $scope.entryProperties.indexOf('Location y (ft)'),
                    "floor": $scope.entryProperties.indexOf('Floor'),
                    "width": $scope.entryProperties.indexOf('Width'),
                    "height": $scope.entryProperties.indexOf('Length'),
                    "id": $scope.entryProperties.indexOf('Key'),
                    "type": $scope.entryProperties.indexOf('Type'),
                    "name": $scope.entryProperties.indexOf('Name')
                }
                $scope.data.shift();
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

        $scope.queryTerm = '';

        // change height of query result box dynamically
        $scope.changeHeight = function () {
            if ($scope.queryTerm.length >= 2) {
                document.getElementById("searchSection").style.height = 'auto';
            } else {
                document.getElementById("searchSection").style.height = '0vh';
            }
        };

        // using service to highlight items
        $scope.highlightItem = highlightService.highlight;

        // change middle panel to display entry information and stylize accordingly
        $scope.showEntryDetails = function (object) {

            // initialize title
            var innerTitle = document.getElementById("ct-index-panel-title-detail");
            innerTitle.innerHTML = object[0] + ' <small>' + object[1] + '</small>';
            innerTitle.style.color = 'white';

            // change color of panel title
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

            // placeholder for image
            var innerBody = document.getElementById("ct-index-panel-body-detail");
            innerBody.innerHTML = 'Image <br /><br /><br /><hr />';

            // print entry properties in loop
            var i;
            for (i = 1; i < object.length; i++) {
                if (object[i] !== '' && i != 3 && i != 4 && i != 1) {
                    innerBody.innerHTML += '<div class="col-sm-6"><b>' + $scope.entryProperties[i] + '</div></b><div class="col-sm-6" id="ct-index-object-name">' + object[i] + '</div>';
                }
            }
        };

        $scope.switchMapsOnClick = function (floor) {
            if (floor == 1) {
                document.getElementById('firstLi').className = 'active';
                document.getElementById('secondLi').className = '';
                document.getElementById('firstFloor').className = 'tab-pane active';
                document.getElementById('secondFloor').className = 'tab-pane';
                $scope.resizeMap1;
            } else {
                document.getElementById('firstLi').className = '';
                document.getElementById('secondLi').className = 'active';
                document.getElementById('firstFloor').className = 'tab-pane';
                document.getElementById('secondFloor').className = 'tab-pane active';
                $scope.resizeMap2;
            }
        };

        // map ctrl
        $scope.map1 = mapService.initMap('firstFloorWell', 1);
        $scope.map2 = mapService.initMap('secondFloorWell', 2);
        $scope.resizeMap1 = mapService.resize($scope.map1);
        $scope.resizeMap2 = mapService.resize($scope.map2);

        $scope.lastItem = null;
        //Highlight the studio given the name of the studio as a param
        $scope.showLoc = function (studioName) {
            removeLast($scope.lastItem);
            var elementPos = $scope.data.map(function (x) { return x[$scope.index.id]; }).indexOf(studioName);
            var objectFound = $scope.data[elementPos];
            $scope.lastItem = objectFound;

            if (objectFound === null) { return 'Not Found' }
            if (objectFound[$scope.index.type] === 'Studio') {
                if (objectFound[$scope.index.floor] === '1') {
                    $scope.map1.studio.highlight(objectFound[$scope.index.id]);
                }
                else if (objectFound[$scope.index.floor] === '2') {
                    $scope.map2.studio.highlight(objectFound[$scope.index.id]);
                }
            }
            else {
                if (objectFound[$scope.index.floor] === '1') {
                    $scope.map1.marker.set(parseInt(objectFound[3]), parseInt(objectFound[4]), $scope.map1.width(), $scope.map1.height())
                }
                else if (objectFound[$scope.index.floor] === '2') {
                    $scope.map2.marker.set(parseInt(objectFound[3]), parseInt(objectFound[4]), $scope.map2.width(), $scope.map2.height())
                }
            }
        }

        var removeLast = function (lastItem) {
            $scope.map1.marker.remove();
            $scope.map2.marker.remove();
            if (lastItem !== null) {
                if (lastItem[$scope.index.floor] === '1') {
                    $scope.map1.studio.dehighlight(lastItem[$scope.index.id]);
                }
                else if (lastItem[$scope.index.floor] === '2') {
                    $scope.map2.studio.dehighlight(lastItem[$scope.index.id]);
                }
            }
        }
    }]);

// service to share methods for map construction and resizing
angular.module("myApp").service("mapService", function () {
    var map = function (id, num) {
        return new mapConstructor(id, num);
    };

    var resizeMap = function (map) {
        if (map.width() !== 0) {
            var width = map.width();
            var height = map.height();
        }

        map.studio.resize(width, height);
    };

    return {
        initMap: map,
        resize: resizeMap
    }
});

// service to highlight items
angular.module("myApp").service("highlightService", function () {
    var lastObject = null;
    var highlight = function (objectId) {
        if (lastObject != null) {
            document.getElementById(lastObject).style.color = 'black';
            document.getElementById(lastObject).style['font-weight'] = 'normal';
            document.getElementById(objectId).style.color = 'blue';
            document.getElementById(objectId).style['font-weight'] = 'bold';
            lastObject = objectId;
        } else {
            document.getElementById(objectId).style.color = 'blue';
            document.getElementById(objectId).style['font-weight'] = 'bold';
            lastObject = objectId;
        };
    };

    return {
        highlight: highlight
    }

});
