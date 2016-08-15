(function () {
    angular.module("map")
        .controller('mapController', mapController);

    mapController.$inject = ['$scope', '$window', '$location'];

    function mapController($scope, $window, $location) {
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
        };

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
            //When studio is clicked, highlight object
            $scope.map.studio.onClick(function (id) {
                $scope.selectedObject = $scope.entries[id];
                $scope.onSelect($scope.entries[id], $scope.entries[id].type.toLowerCase());
                $scope.$apply();
            });

            // $scope.map.markers.onClick();
            $scope.map.swipe();

        });

        //Resize map objects on window resize
        angular.element($window).bind('resize', function () {
            $scope.map.resize();
            // manually $digest required as resize event is outside of angular
            $scope.$digest();
        })
    }
})();
