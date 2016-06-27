var app = angular.module('d3mapping', [])

app.controller('mapController', ['$scope', '$window', '$sce', function ($scope, $window, $sce) {
  //Populates the map with studio data
  $scope.$watch('data', function () {
    if (!$scope.data) { return }
    $scope.studioData2 = [];
    $scope.studioData1 = [];
    $scope.itemData = []
    for (var i = 0; i < $scope.data.length; i++) {
      var obj = {
        'rx': parseInt($scope.data[i][3]),
        'ry': parseInt($scope.data[i][4]),
        'floor': parseInt($scope.data[i][5]),
        'height': parseInt($scope.data[i][7]),
        'width': parseInt($scope.data[i][6]),
        'id': $scope.data[i][0],
      }
      if ($scope.data[i][5] === '2' && $scope.data[i][1] === 'Studio') {
        $scope.studioData2 = $scope.studioData2.concat(obj);
      }
      else if ($scope.data[i][5] === '1' && $scope.data[i][1] === 'Studio') {
        $scope.studioData1 = $scope.studioData1.concat(obj);
      }
      else if ($scope.data[i][1] !== 'Studio') {
        $scope.itemData = $scope.itemData.concat(obj);
      }
    }
    $scope.map1.studio.draw($scope.studioData1);
    $scope.map2.studio.draw($scope.studioData2);
    //Resize all elements initially to first map
    $scope.map1.studio.resize($scope.map1.width(), $scope.map1.height());
    $scope.map2.studio.resize($scope.map1.width(), $scope.map1.height());
  })

  //Resize map objects on window resize
  angular.element($window).bind('resize', function () {
    $scope.map1.studio.resize($scope.map1.width(), $scope.map1.height());
    $scope.map2.studio.resize($scope.map2.width(), $scope.map2.height());
    // manuall $digest required as resize event
    // is outside of angular
    $scope.$digest();
  })
}])
