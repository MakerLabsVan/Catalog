var app = angular.module('d3mapping', [])

//Controller inherits index.js scope
app.controller('mapController', ['$scope', '$window', '$location', function ($scope, $window, $location) {
    //Get URI Query string
    var getQueryVariable = function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    }


    //Populates the map with studio data
    $scope.$watch('data', function () {
        if (!$scope.data) {
            return;
        }
        for (var i = 0; i < $scope.data.length; i++) {
            var obj = {
                'rx': parseInt($scope.data[i][$scope.index.x]),
                'ry': parseInt($scope.data[i][$scope.index.y]),
                'floor': parseInt($scope.data[i][$scope.index.floor]),
                'height': parseInt($scope.data[i][$scope.index.height]),
                'width': parseInt($scope.data[i][$scope.index.width]),
                'id': $scope.data[i][$scope.index.id],
            }

            if ($scope.data[i][$scope.index.floor] === '2' && $scope.data[i][$scope.index.type] === 'Studio') {
                $scope.map2.studio.draw([obj])
            }
            else if ($scope.data[i][$scope.index.floor] === '1' && $scope.data[i][$scope.index.type] === 'Studio') {
                $scope.map1.studio.draw([obj])
            }

            if (getQueryVariable("self") === 'frontdesk' && $scope.data[i][$scope.index.name] === 'Front Desk') {
                $scope.map1.currentLocMarker.place(obj.rx, obj.ry, $scope.map1.width(), $scope.map1.height());
            }

        }
        //Resize all elements initially to first map
        $scope.map1.studio.resize($scope.map1.width(), $scope.map1.height());
        $scope.map2.studio.resize($scope.map1.width(), $scope.map1.height());

    })

    //Resize map objects on window resize
    angular.element($window).bind('resize', function () {
        var width1 = $scope.map1.width();
        var height1 = $scope.map1.height();
        var width2 = $scope.map2.width();
        var height2 = $scope.map2.height();
        $scope.resizeMap1;
        $scope.resizeMap2;
        $scope.map1.studio.resize(width1, height1);
        $scope.map2.studio.resize(width2, height2);
        // manuall $digest required as resize event
        // is outside of angular
        $scope.$digest();
    })

}])
