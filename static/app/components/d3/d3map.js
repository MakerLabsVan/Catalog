var app = angular.module('d3mapping', [])

//Controller inherits index.js scope
app.controller('mapController', ['$scope', '$window', '$location', function ($scope, $window, $location) {
  //Populates the map with studio data
  $scope.$watch('data', function () {
    if (!$scope.data) { return }
    $scope.studioData2 = [];
    $scope.studioData1 = [];
    $scope.itemData = []
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
        $scope.studioData2 = $scope.studioData2.concat(obj);
      }
      else if ($scope.data[i][$scope.index.floor] === '1' && $scope.data[i][$scope.index.type] === 'Studio') {
        $scope.studioData1 = $scope.studioData1.concat(obj);
      }
      else if ($scope.data[i][$scope.index.type] !== 'Studio') {
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

  //Get Query variable string
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
  }


}])
