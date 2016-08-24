(function () {
    'use strict';

    angular.module("app")
        .factory("sheetsGetService", sheetsGetService);

    sheetsGetService.$inject = ["$http"];

    function sheetsGetService($http) {
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
                        object.all.length = 0;
                        object.array = [];
                        object.keyIndex = 0;

                        object.studios = {};
                        object.tools = {};
                        object.materials = {};
                        object.consumables = {};

                        // displays number of entries in a category
                        object.badge = {
                            "studios": 0,
                            "tools": 0,
                            "materials": 0,
                            "consumables": 0
                        };

                        // save for keygen in admin.controller.js
                        object.keyIndex = object.minimized.indexOf("key");

                        doubleShift();
                        entries();

                        ////////////////////////////////
                        function doubleShift() {
                            // TODO: different way?
                            dataArr.shift();
                            dataArr.shift();
                            // save for keygen in admin.controller.js
                            object.array = dataArr;
                        }

                        function entries() {
                            // parse array of json into object form
                            for (var i in dataArr) {
                                var temp = {};
                                for (var j in object.minimized) {
                                    temp[object.minimized[j]] = dataArr[i][j];
                                }
                                object.all[dataArr[i][object.keyIndex]] = temp;
                                categorize(temp);
                                // count all entries
                                object.all.length++;
                            }
                        }

                        // parse each entry into their respective categories
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