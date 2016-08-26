(function () {

    angular.module("app")
        .controller("adminController", adminController);

    adminController.$inject = ["$scope", "$window", "sheetsGetService", "sheetsWriteService", "highlightService", "searchService", "S3Service", "oauthService", "mapService"];
    // scope for digest

    function adminController($scope, $window, sheetsGetService, sheetsWriteService, highlightService, searchService, S3Service, oauthService, mapService) {
        var vm = this;
        vm.authCode = '';
        vm.data = {};
        vm.details = {};
        vm.details.quantity = 0;
        vm.lastSelected = null;
        vm.title = "MakerLabs";
        vm.query = '';

        // functions
        vm.auth = auth;
        vm.checkCode = checkCode;
        vm.clear = clear;
        vm.decreaseQty = decreaseQty;
        vm.filter = filter;
        vm.increaseQty = increaseQty;
        vm.newEntry = newEntry;
        vm.search = search;
        vm.select = select;
        vm.write = write;
        vm.deleteLastMarker = deleteLastMarker;
        vm.deleteAllMarker = deleteAllMarker;
        vm.switchFloor = switchFloor;


        var hdn = "hidden";
        var status = 'new'; // flag for new/edit entry

        activate();

        //////////////////////////////
        function activate() {
            sheetsGetService.get().then(saveData);

            function saveData(data) {
                console.log(data);

                mapService.activate('map-container', 1);
                mapService.marker.onClick();

                vm.data = data;
                return vm.data;
            }
        }

        //Map Stuff
        window.onresize = function () {
            mapService.resize();
        };

        function deleteLastMarker() {
          mapService.marker.deleteLastMarker();
        };

        function deleteAllMarker() {
          mapService.marker.deleteAllMarker();
        };

        function switchFloor() {
          mapService.switchFloor();
        }


        function auth() {
            oauthService.auth().then(function (url) {
                $("#auth-link").attr("href", url);
            })
        }

        function clear() {
            vm.query = '';
        }

        function filter(attr, value) {
            return !(attr === 'locx' ||
            attr === 'locy' ||
            attr === 'floor' ||
            attr === 'metadata' ||
            attr === 'key' ||
            attr === 'link');
        }

        function select(key) {
            status = 'edit';
            // check if query or not and assign the q- prefix if it is
            var check = key.slice(0, 2);
            var tempKey = key;
            if (check === 'q-') {
                tempKey = key.slice(2, key.length);
            }

            var entry = vm.data.all[tempKey];
            vm.title = entry.name;
            vm.details = entry;
            // convert to num
            vm.details.quantity = Number(vm.details.quantity);


            if (entry.type != "Studio") {
                mapService.marker.draw(mapService.map.width(), JSON.parse(entry.metadata));
                mapService.marker.onDrag();
            }
            // uncheck previous type
            $("input[name=radio-type]:checked").prop('checked', false);
            // select correct radio
            var selector = 'input#radio-' + vm.details.type.toLowerCase();
            $(selector).prop("checked", true);

            // highlight
            highlightService.highlight(key, entry.type, vm.lastSelected);
            vm.lastSelected = key;

            imageResponse();
            loadImage(entry.type, entry.name);
            console.log(vm.details);
        }

        // sends the code to server for validation
        function checkCode() {
            if (vm.authCode.length != 0) {
                oauthService.code(vm.authCode).then(function (result) {
                    vm.authCode = '';
                    console.log(result);
                    $window.location.reload();
                })
            }
        }

        function search(entry) {
            if (vm.query.length >= 2) {
                return searchService.search(vm.query, entry);
            } else {
                $("#q-" + entry.key).addClass("search-pad");
                return entry.name;
            }
        }

        function increaseQty() {
            var qty = Number(vm.details.quantity);
            if (qty != undefined) {
                qty += 1;
            }
            vm.details.quantity = qty;
        }

        /**
         * Collects input data and sends to server to write to google sheets
         */
        function write() {
            // check if editing or inserting
            if (status === 'edit') {
                // assign locally
                vm.data.all[vm.details.key] = vm.details;
                vm.data[vm.details.type][vm.details.key] = vm.details;
                $scope.$digest();
            } else {
                // make new entry
                vm.details.type = $("input[name=radio-type]:checked").val();
                var body = [];
                for (var i in vm.data.minimized) {
                    var key = vm.data.minimized[i];
                    body.push(vm.details[key]);
                }

                // set type

                // make the key
                keyGen(body);
                // // make http post request
                // sheetsWriteService.write(body).then(function (result) {
                //     console.log(result);
                // })

                localSave(vm.details);
                vm.newEntry();
                console.log("Post Body: ", body);
            }
        }

        /**
         * Saves the new entry to the local database and updates the view after the http request
         * - must save to data.all, data[type], data.array
         * @param {object} entry - a new entry made from input form
         */
        function localSave(entry) {
            console.log("FROM LOCALSAVE: ", entry);
            vm.data.all[entry.key] = entry;
            vm.data[entry.type][entry.key] = entry;
            vm.data.array.push(entry);
            console.log("ALL: ", vm.data.all[entry.key], "CATEGORY: ", vm.data[entry.type][entry.key]);
        }

        /**
         * Creates a new key
         * @param {array} body - an array populated with data from input forms
         */
        function keyGen(body) {
            // takes last key for new keygen (can cause gaps)
            var tempkey = vm.data.array[vm.data.all.length - 1][vm.data.keyIndex];
            // remove first letter and only get digits
            var slice = tempkey.slice(1, tempkey.length);
            var newKey = 'A' + (Number(slice) + 1);

            // last index is the new key
            body[body.length - 1] = String(newKey);
            vm.details.key = newKey;
        }

        /**
         * Clears the form
         */
        function newEntry() {
            status = 'new';
            vm.details = {};
            vm.details.quantity = 0;
            // uncheck button
            $("input[name=radio-type]:checked").prop('checked', false);
        }

        function decreaseQty() {
            var qty = Number(vm.details.quantity);
            if (qty != undefined) {
                if (qty > 0) {
                    qty -= 1;
                }
            }
            vm.details.quantity = qty;
        }

        function loadImage(type, name) {
            S3Service.getURL(type + "/" + name)
                .then(function (url) {
                    $("#entry-image").removeClass(hdn);
                    $("#loading").addClass(hdn);
                    $("#entry-image").attr("src", url).on("error", function () {
                        $("#entry-image").addClass(hdn);
                        $("#not-found").removeClass(hdn);
                    })
                })
        }

        function imageResponse() {
            // show loading icon when clicked and change on load
            $("#entry-image").addClass(hdn);
            $("#not-found").addClass(hdn);
            $("#loading").removeClass(hdn);
        }

        (function () {
            document.getElementById("file").onchange = () => {
                const files = document.getElementById('file').files;
                const file = files[0];
                if (file != null) {
                    console.log("FILE NAME: ", file.name);
                    $scope.$digest();
                } else {
                    console.log("file not uploaded");
                }
            }
        })();

        ////////////////// plugins /////////////////
        // modal plug in for materialize.js
        $(document).ready(function () {
            $('.modal-trigger').leanModal({
                dismissible: true
            });
        });
    }

})();
