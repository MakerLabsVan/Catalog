(function () {
    angular.module("app")
        .service("searchService", searchService);

    function searchService() {
        var service = {
            search: search
        };

        return service;

        ////////////////////////////
        // return boolean to trigger ng-if
        function search(query, name, key) {
            if (name.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                $("#q-" + key).addClass("search-pad");
                return name;
            } else {
                $("#q-" + key).removeClass("search-pad");
                return '';
            }
        }
    }

})();