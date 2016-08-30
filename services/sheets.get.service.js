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

                        object.Studio = {};
                        object.Tool = {};
                        object.Material = {};
                        object.Consumable = {};

                        // displays number of entries in a category
                        object.badge = {
                            "Studio": 0,
                            "Tool": 0,
                            "Material": 0,
                            "Consumable": 0
                        };

                        // save for keygen in admin.controller.js
                        object.keyIndex = object.minimized.indexOf("key");

                        // offset the frozen rows
                        const rowOffset = 2;

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
                                    // make object
                                    temp[object.minimized[j]] = dataArr[i][j];
                                }
                                // make the row to remove searching for the row number when writing
                                temp.row = Number(i) + rowOffset;
                                // save object in all property
                                object.all[dataArr[i][object.keyIndex]] = temp;
                                // put into type categories
                                categorize(temp);
                                // count all entries
                                object.all.length++;
                            }
                        }

                        // parse each entry into their respective categories
                        function categorize(temp) {
                            object[temp.type][temp.key] = temp;
                            object.badge[temp.type]++;
                        }

                        return object;
                    })
            }

        }
    }

})();