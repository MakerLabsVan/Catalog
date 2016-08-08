// TODO: rename into get.service.js or sheets.get.service.js

(function () {
    angular.module("public")
        .factory("dataService", dataService);

    dataService.$inject = ["$http"];

    function dataService($http) {
        return {
            get: function () {
                return $http.get("/publicGet")
                    .then(function (result) {
                        /* parse into object that holds:
                         minimized, display, data
                         */
                        var dataArr = result.data;
                        var object = {};
                        object.display = dataArr[0];
                        object.minimized = dataArr[1];
                        object.entries = {};
                        var keyIndex = object.minimized.indexOf("key");

                        doubleShift();
                        entries();

                        ////////////////////////////////
                        function doubleShift() {
                            // TODO: different way?
                            dataArr.shift();
                            dataArr.shift();
                        }

                        function entries() {
                            for (var i in dataArr) {
                                var temp = {};
                                for (var j in object.minimized) {
                                    temp[object.minimized[j]] = dataArr[i][j];
                                }
                                object.entries[dataArr[i][keyIndex]] = temp;
                            }
                        }

                        return object;
                    })
            }

        }
    }

})();