var app = angular.module('d3mapping', []);

//Controller inherits index.js scope
app.controller('mapController', ['$scope', '$window', '$location', function ($scope, $window, $location) {

    $scope.$watch('entries', function (entries) {
        for (i in entries) {
            if (entries[i].type == 'Studio') {
                if (entries[i].metadata) {
                    var payload = {
                        'metadata': JSON.parse(entries[i].metadata),
                        'subtype': entries[i].subtype,
                        'floor': entries[i].floor,
                        'id': entries[i].key
                    };
                    $scope.map.studio.draw(payload);
                }
            }
        }
        $scope.sendMapAnalytic = function (entry) {
            ga('send', 'event', 'Click an entry on the map', 'click', [entry.name, entry.type, entry.key]);
        };

        //When studio is clicked, highlight object
        $scope.map.studio.onClick(function (id) {
            $scope.selectedObject = $scope.entries[id];
            $scope.onSelect($scope.entries[id], $scope.entries[id].type.toLowerCase());
            $scope.sendMapAnalytic($scope.selectedObject);
            $scope.$apply();
        });

        // $scope.map.marker.onClick();
        // $scope.map.swipe();

    });

    //Resize map objects on window resize
    angular.element($window).bind('resize', function () {
        $scope.map.resize();
        // manual $digest required as resize event is outside of angular
        $scope.$digest();
    })
}]);
