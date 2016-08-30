(function () {

    angular.module("app")
        .service("sheetsWriteService", sheetsWriteService);

    sheetsWriteService.$inject = ["$http"];

    function sheetsWriteService($http) {
        return service = {
            write: write,
            deleteEntry: deleteEntry
        };

        return service;

        ////////////////////////////

        function write(body, row) {
            return $http.post("/newEntry", [body, row])
                .then(function (result) {
                    return result.data;
                })
        }

        function deleteEntry(row) {
            return $http.post("/deleteEntry", [row])
                .then(function (result) {
                    return result.data;
                })
        }
    }

})();