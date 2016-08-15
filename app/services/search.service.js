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
        function search(query, entry) {
            if (mult_indexOf(query, entry)) {
                $("#q-" + entry.key).addClass("search-pad");
                return entry.name;
            } else {
                $("#q-" + entry.key).removeClass("search-pad");
                return '';
            }
        }

        // properties to search through
        function indexOf(query, property) {
            // non-existing property
            if (property == undefined) {
                return false;
            } else {
                return (property.toLowerCase().indexOf(query.toLowerCase()) != -1);
            }
        }

        // set of properties to look through
        function mult_indexOf(query, entry) {
            return (
                indexOf(query, entry.name) ||
                indexOf(query, entry.type) ||
                indexOf(query, entry.subtype) ||
                indexOf(query, entry.keywords)
            );
        }
    }

})();