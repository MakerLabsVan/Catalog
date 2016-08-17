/*
 * service to retrieve S3 image url through its API
 */

(function () {

    angular.module('app')
        .service("S3Service", S3Service);

    S3Service.$inject = ["$http"];

    function S3Service($http) {
        var service = {
            getURL: getURL
        };

        return service;

        ///////////////////////////////////
        // id is the concatenated type and name
        function getURL(id) {
            return $http.post("image", [id])
                .then(function (url) {
                    return String(url.data);
                })
        }

    }


})();