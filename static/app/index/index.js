"use strict";

var indexApp = angular.module('indexApp', ['d3mapping']);

indexApp.controller('indexCtrl', ['$scope', '$http', '$interval', "$window", 'mapService', 'highlightService', 'httpRequests', function ($scope, $http, $interval, $window, mapService, highlightService, httpRequests) {

    // functions to refresh only on 5 minutes of idling
    // 5 minutes
    const refreshTime = 300000;

    // start interval promise
    var checkIdle = $interval(function () {
        $window.location.href = '/';
    }, refreshTime);

    // destroy promise and create new promise to reset the time
    var resetCheck = function () {
        $interval.cancel(checkIdle);
        checkIdle = $interval(function () {
            $window.location.href = '/';
        }, refreshTime);
    };

    // any click will reset the clock
    $('body').click(function () {
        resetCheck();
    });

    // Jquery draggable
    $('.modal-dialog').draggable({
        handle: ".modal-header"
    });

    $(".modal").on("hidden.bs.modal", function(){
        $(this).find('.modal-dialog').css({
            left:'',
            top:''
        })
    });

    // request to sheets and parse the data
    httpRequests.pub_getCatalog().then(function (data) {
        $scope.data = data;

        // minimized property names for object
        $scope.dataLabels = data[1];

        // get key index dynamically
        var keyIndex = $scope.dataLabels.indexOf('key');

        // pretty property names to display
        $scope.entryProperties = data[0];

        // removed first 2 frozen rows
        $scope.data.shift();
        $scope.data.shift();
        var shiftedData = $scope.data;

        // object entries
        $scope.entries = {};

        // use loop to populate the object
        for (var i in shiftedData) {
            var object = {};

            for (var j in $scope.dataLabels) {
                // ex. object.name.label
                object[$scope.dataLabels[j]] = shiftedData[i][j];
            }
            $scope.entries[shiftedData[i][keyIndex]] = object;
        }

        // make category data
        $scope.studioEntries = {};
        $scope.materialEntries = {};
        $scope.toolEntries = {};
        $scope.consumableEntries = {};

        for (var key in $scope.entries) {
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
        $scope.map.setViewable();

    });
    // GET END

    $scope.sendQueryAnalytic = function () {
        ga('send', 'event', 'Search query', 'click', $scope.queryTerm);
    };
    $scope.sendClickAnalytic = function (entry) {
        ga('send', 'event', 'Clicked an Entry', 'click', [entry.name, entry.type, entry.key]);

        $scope.sendQueryAnalytic();
    };

    $scope.sendMapAnalytic = function (entry) {
        ga('send', 'event', 'Click an entry on the map', 'click', [entry.name, entry.type, entry.key]);
    };


    $scope.categories = {
        'studio': 'Studios',
        'tools': 'Tools',
        'cons': 'Consumables',
        'mats': 'Materials'
    };

    // map controller
    // TODO: Change map to map (error in d3map??)
    $scope.map = mapService.initMap('floorDisplay', 1);
    $scope.resizemap = mapService.resize($scope.map);

    $scope.queryTerm = '';
    // change height of query result box dynamically
    $scope.changeHeight = function () {
        if ($scope.queryTerm.length >= 2) {
            $('.in').removeClass('in');
            $('#searchSection').removeClass('hidden');
        } else {
            $('#searchSection').addClass('hidden');
        }
    };

    $scope.forceShrinkSearch = function () {
        var id = $('#searchSection');
        id.addClass('hidden');
    };

    $scope.clearSearch = function () {
        $scope.queryTerm = '';
        $scope.forceShrinkSearch();
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

    // set of properties to look through
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
                $('#query_' + entry.key).addClass('searchMargins');
                return entry.name;
            } else {
                $('#query_' + entry.key).removeClass('searchMargins');
                return '';
            }
        }
    };

    var getImage = function (type, image) {
        httpRequests.getImage(type + '/' + image)
            .then(function (url) {
                $("#entryImg").removeClass("hidden");
                $("#entryImg").attr("src", url).on("error", function () {
                    $("#entryImg").addClass("hidden");
                    return;
                });
            });
    };

    var sublocationImage = function (sublocation) {
        httpRequests.getImage('Sublocation' + '/' + sublocation)
            .then(function (url) {
                $("#subloc-image").removeClass("hidden");
                $("#subloc-image").attr("src", url).on("error", function () {
                    $("#subloc-image").addClass("hidden");
                    return;
                });
            });
    };

    // display entry details when clicked
    $scope.showEntryDetails = function (entry) {

        $scope.selectedObject = entry;
        $("#entryImg").addClass("hidden");
        $("#subloc-image").addClass("hidden");

        // get images
        getImage(entry.type, entry.image);
        sublocationImage(entry.sublocation);

        if (entry.sublocation == "" && entry.image == "") { //no images
            $('.modal-body').css({
                width:'auto',
                height:'115px',
                'max-height':'100%'
            });
        }
        else {
            $('.modal-body').css({
                width:'auto',
                height:'auto', 
                'max-height':'510px'
            });
        }

        // initialize title
        $('#modalTitleName').html(entry.name);
        $('#modalTitleName').addClass('whiteFont');

        // change color of modal title
        var elem = $('#indexModalHeading');
        var remove = 'red blue orange green white';

        if (entry.floor != "") {
            $('#address').html("Floor " + entry.floor);
        }
        if (entry.sublocation != "") {
            $('#address').append(", " + entry.sublocation);
        }

        var polygon = JSON.parse(entry.metadata).points[0].polygon; //to calculate position of one of polygon's coords
        var xpos = 1;
        var ypos = 1;
        for (var i = 0; i < polygon.length; i++) {
            xpos += polygon[i].x;
            ypos += polygon[i].y;
        }
        xpos = xpos/polygon.length;
        ypos = ypos/polygon.length

        var removeModalClass = 'left-modal right-modal top-modal bottom-modal'
        if (entry.floor == 1) {
            if (xpos < 75 && ypos < 45) {
                $('#modalWindow').removeClass(removeModalClass);
                $('#modalWindow').addClass('top-modal');
            }
            else if (xpos < 75 && ypos >= 45){
                $('#modalWindow').removeClass(removeModalClass);
                $('#modalWindow').addClass('left-modal');
            }
            else if (xpos >= 75 && ypos < 45){
                $('#modalWindow').removeClass(removeModalClass);
                $('#modalWindow').addClass('right-modal');
            }
            else {
                $('#modalWindow').removeClass(removeModalClass);
                $('#modalWindow').addClass('bottom-modal');
            }
        }
        else {
            if (xpos < 50 && ypos < 40) {
                $('#modalWindow').removeClass(removeModalClass);
                $('#modalWindow').addClass('right-modal');
            }
            else if (xpos < 50 && ypos >= 40){
                $('#modalWindow').removeClass(removeModalClass);
                $('#modalWindow').addClass('left-modal');
            }
            else if (xpos >= 50 && ypos < 50){
                $('#modalWindow').removeClass(removeModalClass);
                $('#modalWindow').addClass('right-modal');
            }
            else {
                $('#modalWindow').removeClass(removeModalClass);
                $('#modalWindow').addClass('bottom-modal');
            }
        }


        switch (entry.type) {
            case 'Studio':
                elem.removeClass(remove).addClass('red');
                if (entry.subtype == "Common") {
                    $('#additionalInfo').html("Public");
                }
                else {
                    $('#additionalInfo').html("Private");
                }
                break;
            case 'Tool':
                elem.removeClass(remove).addClass('blue');
                if (entry.quantity != "") {
                    $('#additionalInfo').html(entry.quantity + "x")
                }
                break;
            case 'Material':
                elem.removeClass(remove).addClass('orange');
                if (entry.quantity != "") {
                    $('#additionalInfo').html(entry.quantity + "x")
                }
                break;
            case 'Consumable':
                elem.removeClass(remove).addClass('green');
                if (entry.quantity != "") {
                    $('#additionalInfo').html(entry.quantity + "x")
                }
        }

        $('#popover').modal({ keyboard: true, show: true});

        $scope.isEmpty = function (prop) {
            return !($scope.selectedObject[prop] === '' ||
            prop === 'locx' ||
            prop === 'locy' ||
            prop === 'metadata' ||
            prop === 'name' ||
            prop === 'image' ||
            prop === 'key');
        };
    };

    var lastItem = null;
    //Highlight the studio given the name of the studio as a param
    $scope.showLoc = function (entry) {
        removeLast(lastItem);
        lastItem = entry;

        if (entry.type == 'Studio') {
            $scope.map.studio.highlight(entry.key);
        } else {
            if (entry.metadata) {
                $scope.map.markers.draw($scope.map.width(), JSON.parse(entry.metadata));
            }
        }
        $scope.map.selectFloor(Number(entry.floor));
    };

    var removeLast = function (lastItem) {
        $scope.map.markers.hide();
        if (lastItem != undefined) {
            $scope.map.studio.dehighlight(lastItem.key);
        }
    };

    // combined function
    $scope.onSelect = function (entry, category) {
        $scope.showEntryDetails(entry);
        $scope.showLoc(entry);
        $scope.highlightItem(category + '_' + entry.key, entry.type);
        $scope.sendClickAnalytic(entry);
    };

    $scope.toFloorOne = function () {
        $scope.map.floorOne();
        $scope.map.resize();
    };

    $scope.toFloorTwo = function () {
        $scope.map.floorTwo();
        $scope.map.resize();
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
        getImage: function (key) {
            return $http.post('object', [key])
                .then(function (url) {
                    return String(url.data);
                })
        }
    }
});

// service to share methods for map construction and resizing
indexApp.service('mapService', function () {
    var map = function (id, num) {
        // mapConstructor = map
        return new mapConstructor(id, num);
    };

    var resizeMap = function (map) {
        // map.resize
        map.resize();
    };

    return {
        initMap: map,
        resize: resizeMap
    }
});

// service to highlight items
indexApp.service('highlightService', function () {
    var lastObject = null;

    var highlight = function (objectId, type) {
        var changeSelection = function (color) {
            $('#' + lastObject).removeClass('whiteFont lightRed lightOrange lightGreen lightBlue');
            $('#' + objectId).addClass('whiteFont ' + color);
            lastObject = objectId;
        };

        switch (type) {
            case 'Studio':
                changeSelection('lightRed');
                break;
            case 'Material':
                changeSelection('lightOrange');
                break;
            case 'Consumable':
                changeSelection('lightGreen');
                break;
            case 'Tool':
                changeSelection('lightBlue');
        }
    };

    var clearHighlight = function () {
        $('#' + lastObject).removeClass('whiteFont lightRed lightOrange lightGreen lightBlue');
    };

    return {
        highlight: highlight,
        clearHighlight: clearHighlight
    }
});
