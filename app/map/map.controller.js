(function () {
    angular.module("map")
        .controller('mapController', mapController);

    mapController.$inject = ['$window', '$location', 'mapService'];

    function mapController($window, $location, mapService) {
        // get URI query string
        var vm = this;
        vm.map = mapService.init("map-container", 1);

    }
})();
