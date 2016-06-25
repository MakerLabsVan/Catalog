var app = angular.module('d3mapping', [])

app.controller('mapController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

    $scope.map1 = new mapConstructor('firstFloorWell', 1);
    $scope.map2 = new mapConstructor('secondFloorWell', 2);
    $scope.map1.marker.set(200,100)
    $scope.resizeMap = function () {
      if ($scope.map2.width() !== 0){
        var width = $scope.map2.width();
        var height = $scope.map2.height();
      }
      else {
        var width = $scope.map1.width();
        var height = $scope.map1.height();
      }
      $scope.map1.studio.resize( width, height);
      $scope.map2.studio.resize( width, height);
    };
    $scope.showItemLoc = function(itemName){
          var elementPos = $scope.data.map(function(x) {return x[0]; }).indexOf(itemName);
          var objectFound = $scope.data[elementPos];
          console.log(objectFound[5])
          console.log(objectFound[3])
          console.log(objectFound[4])
          if (objectFound[5] === '1'){
            $scope.map1.marker.set( parseInt(objectFound[3]), parseInt(objectFound[4]), $scope.map1.width(), $scope.map1.height())
          }
          else if (objectFound[5] === '2') {
            $scope.map2.marker.set( parseInt(objectFound[3]), parseInt(objectFound[4]), $scope.map2.width(), $scope.map2.height())
          }



    }


}])
app.directive('mark-item', [])


// Directives for D3, in progress, may not use
app.directive('makerMap', ['$window', function ($window) {
    return {
        scope: false,
        link: function (scope) {

            //scope.map2.marker.onClick();
            //scope.map1.marker.onClick();

            scope.$watch('data', function () {
                if (!scope.data) { return }
                scope.studioData1 = [];
                scope.studioData2 = [];
                scope.itemData = []
                for (var i = 0; i < scope.data.length; i++) {
                    var obj = {
                        'rx': parseInt(scope.data[i][3]),
                        'ry': parseInt(scope.data[i][4]),
                        'floor': parseInt(scope.data[i][5]),
                        'height': parseInt(scope.data[i][7]),
                        'width': parseInt(scope.data[i][6]),
                        'id': scope.data[i][0],
                    }

                    if (scope.data[i][5] === '2' && scope.data[i][1] === 'Studio' ){
                      scope.studioData2 = scope.studioData2.concat(obj);
                    }
                    else if (scope.data[i][5] === '1' && scope.data[i][1] === 'Studio' ){
                      scope.studioData1 = scope.studioData1.concat(obj);
                    }
                    else if (scope.data[i][1] !== 'Studio'){
                          scope.itemData = scope.itemData.concat(obj);
                    }
                  }
                scope.map1.studio.draw(scope.studioData1);
                scope.map2.studio.draw(scope.studioData2);
                //Resize all elements initially to first map
                scope.map1.studio.resize(scope.map1.width(), scope.map1.height());
                scope.map2.studio.resize(scope.map1.width(), scope.map1.height());
            })

            //Resize on window resize
            angular.element($window).bind('resize', function () {
                scope.map1.studio.resize(scope.map1.width(), scope.map1.height());
                scope.map2.studio.resize(scope.map2.width(), scope.map2.height());
                // manuall $digest required as resize event
                // is outside of angular
                scope.$digest();
            })


        }
    }
}])
