(function () {
    angular.module("app")
        .service("searchService", searchService);

    function searchService() {
        var service = {
            search: search
        };

        return service;


        ////////////////////////////
        function search() {

        }

    }


})();