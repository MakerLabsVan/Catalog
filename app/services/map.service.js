(function () {

    angular.module("map")
        .service("mapService", mapService);

    function mapService() {
        var service = {
            init: init,
            resize: resize
        };

        return service;

        ////////////////////////
        function init(id, floor) {
            return new MapConstructor(id, floor);
        }

        function resize(map) {
            map.resize();
        }

    }

})();