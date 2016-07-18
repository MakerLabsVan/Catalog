var indexApp = angular.module("indexApp", ['d3mapping']);

indexApp.controller("indexCtrl", ["$scope", '$http', "mapService", "highlightService", "httpRequests", function ($scope, $http, mapService, highlightService, httpRequests) {

    httpRequests.pub_getCatalog().then(function (data) {
        $scope.data = data;

        // labels to use for object
        $scope.dataLabels = data[1];

        // labels to display
        $scope.entryProperties = data[0];

        // shift data
        $scope.data.shift();
        $scope.data.shift();

        // removed 2 frozen rows
        var shiftedData = $scope.data;

        // object entries
        // THIS IS THE NEW DATA LIST IN OBJECT FORM
        $scope.entries = {};
        // use loop to make the object
        for (i in shiftedData) {
            var object = {};
            for (j in $scope.dataLabels) {
                // ex. object.name.label
                object[$scope.dataLabels[j]] = shiftedData[i][j];
            }
            // 20 could change
            $scope.entries[shiftedData[i][21]] = object;
        }
        ;

        console.log($scope.entries);

        // make category data
        $scope.studioEntries = {};
        $scope.materialEntries = {};
        $scope.toolEntries = {};
        $scope.consumableEntries = {};

        for (key in $scope.entries) {
            // why doesn't entries.key work here
            switch ($scope.entries[key].type) {
                case 'Studio':
                    $scope.studioEntries[key] = $scope.entries[key];
                    break;
                case 'Material':
                    $scope.materialEntries[key] = $scope.entries[key];
                    break;
                case 'Tool':
                    $scope.toolEntries[key] = $scope.entries[key];
                    break;
                case 'Consumable':
                    $scope.consumableEntries[key] = $scope.entries[key];
            }
        }
        // but entries.key works here

        $scope.index = {
            "x": $scope.entryProperties.indexOf('Location x (ft)'),
            "y": $scope.entryProperties.indexOf('Location y (ft)'),
            "floor": $scope.entryProperties.indexOf('Floor'),
            "width": $scope.entryProperties.indexOf('Width'),
            "height": $scope.entryProperties.indexOf('Length'),
            "id": $scope.entryProperties.indexOf('Key'),
            "type": $scope.entryProperties.indexOf('Type'),
            "name": $scope.entryProperties.indexOf('Name')
        };
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
            $('.in').removeClass('in');
            $("#searchSection").addClass('searchSectionExpanded').removeClass('searchSectionClosed');
        } else {
            $("#searchSection").addClass('searchSectionClosed').removeClass('searchSectionExpanded');

        }
    };

    // using service to highlight items
    $scope.highlightItem = highlightService.highlight;

    // search bar functions
    var isIndexOf = function (property) {
        if (property == undefined) {
            return false;
        } else if (property.toLowerCase().indexOf($scope.queryTerm.toLowerCase()) != -1) {
            return true;
        }
    };

    var isIndexOfSet = function (entry) {
        if (isIndexOf(entry.name) ||
            isIndexOf(entry.type) ||
            isIndexOf(entry.subtype) ||
            isIndexOf(entry.keywords)) {
            return true;
        }
    };

    $scope.filterSearch = function (entry) {
        if ($scope.queryTerm.length >= 2) {
            if (isIndexOfSet(entry)) {
                return entry.name;
            }
        }
    };

    $scope.panelBodyMessage = {
        "name": "MakerLabs",
        "body": "To use, select an item from the categories or search for a specific item."
    };

    $scope.panelTitleName = 'MakerLabs';
    $scope.panelTitleType = '';

    $scope.showEntryDetails = function (entry) {

        // TODO: change to var instead of $scope later
        $scope.selectedObject = entry;

        // initialize title
        $scope.panelTitleName = entry.name;
        $scope.panelTitleType = entry.type;
        $('#ct-index-panel-title-detail').addClass('panelTitle');

        // change color of panel title
        var elem = $('#indexPanelHeading');
        switch (entry.type) {
            case 'Studio':
                elem.addClass('red').removeClass('blue orange green');
                break;
            case 'Tool':
                elem.addClass('blue').removeClass('red orange green');
                break;
            case 'Material':
                elem.addClass('orange').removeClass('red blue green');
                break;
            case 'Consumable':
                elem.addClass('green').removeClass('red blue orange');
        }

        $('#entryBody').addClass('hidden');
        $('#entryDetails').removeClass('hidden');

        $scope.isEmpty = function (prop) {
            return !($scope.selectedObject[prop] === '' ||
            prop === 'locx' ||
            prop === 'locy' ||
            prop === 'metadata');
        };
    };

    $scope.switchMapsOnClick = function (floor) {
        if (floor == 1) {
            $('#firstLi').addClass('active');
            $('#secondLi').removeClass('active');
            $('#firstFloor').addClass('active');
            $('#secondFloor').removeClass('active');
            $scope.resizeMap1;
        } else {
            $('#firstLi').removeClass('active');
            $('#secondLi').addClass('active');
            $('#firstFloor').removeClass('active');
            $('#secondFloor').addClass('active');
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
    $scope.showLoc = function (studioKey) {
        removeLast($scope.lastItem);
        var elementPos = $scope.data.map(function (x) {
            return x[$scope.index.id];
        }).indexOf(studioKey);
        var objectFound = $scope.data[elementPos];
        $scope.lastItem = objectFound;

        if (objectFound == undefined) {
            return 'Not Found'
        }
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
        if (lastItem != undefined) {
            if (lastItem[$scope.index.floor] === '1') {
                $scope.map1.studio.dehighlight(lastItem[$scope.index.id]);
            }
            else if (lastItem[$scope.index.floor] === '2') {
                $scope.map2.studio.dehighlight(lastItem[$scope.index.id]);
            }
        }
    };

    // combined function
    $scope.onSelect = function (entry, category) {
        $scope.showEntryDetails(entry);
        $scope.switchMapsOnClick(entry.floor);
        $scope.showLoc(entry.key);
        $scope.highlightItem(category + '_' + entry.key);
    };
}]);

// promise services for http requests
indexApp.factory('httpRequests', function ($http) {
    // return the function
    return {
        pub_getCatalog: function () {
            // return the promise from http
            return $http.get('/publicGetCatalog')
                .then(function (result) {
                    // return the data
                    return result.data;
                })
        },
        admin_getCatalog: function () {
            // return promise
            return $http.get('getCatalog')
                .then(function (result) {
                    return result.data;
                })
        }
    }
})

// service to share methods for map construction and resizing
indexApp.service("mapService", function () {
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
indexApp.service("highlightService", function () {
    var lastObject = null;
    var highlight = function (objectId) {
        if (lastObject != null) {
            $('#' + lastObject).addClass('normalFont').removeClass('selectFont');
            $('#' + objectId).addClass('selectFont').removeClass('normalFont');
            lastObject = objectId;
        } else {
            $('#' + objectId).addClass('selectFont').removeClass('normalFont');
            lastObject = objectId;
        }
        ;
    };
    return {
        highlight: highlight
    }
});

