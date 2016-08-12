(function () {
    'use strict';

    angular.module("app")
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
                        object.all = {};

                        object.studios = {};
                        object.tools = {};
                        object.materials = {};
                        object.consumables = {};

                        object.badge = {
                            "studios": 0,
                            "tools": 0,
                            "materials": 0,
                            "consumables": 0
                        };

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
                            // combine objectifying and categorizing
                            for (var i in dataArr) {
                                var temp = {};
                                for (var j in object.minimized) {
                                    temp[object.minimized[j]] = dataArr[i][j];
                                }
                                object.all[dataArr[i][keyIndex]] = temp;
                                categorize(temp);
                            }
                        }

                        // TODO: not pass in entry; make inline statement?
                        function categorize(temp) {
                            switch (temp.type) {
                                case "Studio":
                                    object.studios[temp.key] = temp;
                                    object.badge.studios++;
                                    break;
                                case "Tool":
                                    object.tools[temp.key] = temp;
                                    object.badge.tools++;
                                    break;
                                case "Material":
                                    object.materials[temp.key] = temp;
                                    object.badge.materials++;
                                    break;
                                case "Consumable":
                                    object.consumables[temp.key] = temp;
                                    object.badge.consumables++;
                            }
                        }

                        return object;
                    })
            }

        }
    }

})();