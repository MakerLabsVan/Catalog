// TODO: rename into get.service.js or sheets.get.service.js

(function () {
    angular.module("public")
        .factory("retriever", retriever);

    retriever.$inject = ["$http"];

    function retriever($http) {
        return {
            get: function () {
                return $http.get("/publicGet")
                    .then(function (result) {
                        return result.data;
                    })
            }

        }
    }

})();