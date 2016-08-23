(function () {

    angular.module("app")
        .service("oauthService", oauthService);

    oauthService.$inject = ["$http"];

    function oauthService($http) {
        var service = {
            auth: auth,
            code: code
        };

        return service;


        ///////////////////////////////////////
        // get the oauth2 token uri
        function auth() {
            return $http.get('authCode')
                .then(function (result) {
                    return result.data;
                })
        }

        // send the code to the server for validation
        function code(code) {
            return $http.post('sendCode', [code])
                .then(function (result) {
                    return result.data;
                })
        }


    }


})();