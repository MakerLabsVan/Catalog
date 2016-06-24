var app = angular.module('d3mapping', [])

app.controller('mapController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

    $scope.resizeMap = function () {
        console.log("Call this function");
    }

}])

// Directives for D3, in progress, may not use
app.directive('makerMap', ['$window', function ($window) {
    return {
        scope: false,
        link: function (scope) {
            var map1 = new mapConstructor('firstFloorWell', 1)
            var map2 = new mapConstructor('secondFloorWell', 2)

            map2.marker.onClick()
            map1.marker.onClick()
            scope.$watch('data', function () {
                if (!scope.data) { return }
                scope.studioData = []
                scope.itemData = []
                for (var i = 0; i < scope.data.length; i++) {
                    var obj = {
                        'rx': parseInt(scope.data[i][3]),
                        'ry': parseInt(scope.data[i][4]),
                        'floor': parseInt(scope.data[i][5]),
                        'height': parseInt(scope.data[i][7]),
                        'width': parseInt(scope.data[i][6]),
                        'id': scope.data[i][0]
                    }
                    if (scope.data[i][1] === 'Studio') {
                        scope.studioData = scope.studioData.concat(obj);
                    } else {
                        scope.itemData = scope.itemData.concat(obj);
                    }
                }

                map1.studio.draw(scope.studioData);
                map1.studio.resize(map1.width(), map1.height());

            })

            var rectangleData = [
                { 'rx': 0, 'ry': 20, 'height': 5, 'width': 10, 'id': 'studio1' },
                { 'rx': 20, 'ry': 70, 'height': 5, 'width': 15, 'id': 'studio2' },
                { 'rx': 69, 'ry': 69, 'height': 5, 'width': 5, 'id': 'studio3' }]
            map2.studio.draw(rectangleData)
            map1.studio.resize(map1.width(), map1.height())
            map1.studio.resize(map1.width(), map1.height()) // resize on button click

            //Resize on window resize
            angular.element($window).bind('resize', function () {
                scope.width1 = map1.width()
                scope.height1 = map1.height()
                scope.width2 = map2.width()
                scope.height2 = map2.height()
                map1.studio.resize(scope.width1, scope.height1)
                map2.studio.resize(scope.width2, scope.height2)
                // manuall $digest required as resize event
                // is outside of angular
                scope.$digest()
            })
        }
    }
}])
