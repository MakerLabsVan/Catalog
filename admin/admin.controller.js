(function () {

    angular.module("app")
        .controller("adminController", adminController);

    adminController.$inject = ["$scope", "$window", "sheetsGetService", "sheetsWriteService", "highlightService", "searchService", "S3Service", "oauthService", "mapService"];
    // scope for evalAsync

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
            mapService.marker.deleteLast();
        }

        function deleteAllMarker() {
            mapService.marker.deleteAll();
        }

        function switchFloor() {
            mapService.switchFloor();
            mapService.marker.deleteAll();
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
            var body = [];
            if (status === 'new') {
                // get map pin locations
                vm.details.metadata = JSON.stringify(genMetadata());
                // make the key if new
                keyGen(vm.details);
                vm.details.type = $("input[name=radio-type]:checked").val();
                vm.details.row = vm.data.all.length + 3;
            }

            // make new entry
            for (var i in vm.data.minimized) {
                var key = vm.data.minimized[i];
                body.push(vm.details[key]);
            }

            // make http post request
            sheetsWriteService.write([body, vm.details.row]).then(function (result) {
                console.log(body, vm.details.row);
                localSave(vm.details, body);
                vm.newEntry();
                $scope.$evalAsync();
                console.log("Post Body: ", body);
            });
        }

        /**
         * Saves the new entry to the local database and updates the view after the http request
         * - must save to data.all, data[type], data.array
         * @param {object} entry - a new entry made from input form
         */
        function localSave(entry, body) {
            console.log(entry);
            vm.data.all[entry.key] = entry;
            vm.data[entry.type][entry.key] = entry;
            // need to push the array body or else keygen will get an error after the first send
            vm.data.array.push(body);
            vm.data.all.length++;
        }

        /**
         * Creates a new key
         * @param {array} body - an array populated with data from input forms
         */
        function keyGen(entry) {
            // takes last key for new keygen (can cause gaps)
            var tempkey = vm.data.array[vm.data.all.length - 1][vm.data.keyIndex];
            // remove first letter and only get digits
            var slice = tempkey.slice(1, tempkey.length);
            var newKey = 'A' + (Number(slice) + 1);

            // last index is the new key
            entry.key = String(newKey);
        }

        /**
         * Make metadata for map pins
         */
        function genMetadata() {
            return {
                "points": mapService.getLocation()
            };
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
                    $scope.$evalAsync();
                } else {
                    console.log("file not uploaded");
                }
            }
        })();

        // default from heroku s3 direct upload docs for nodejs
        var fileHandler = function () {
            const files = document.getElementById('file-input').files;
            const file = files[0];
            if (file == null) {
                console.log("No file was selected");
                return;
            }
            getSignedRequest(file);
        };

        function getSignedRequest(file) {
            // make path to upload to
            var folder = $("input[name=radio-type]:checked").val();
            if (folder == undefined) {
                alert("Please select a type!");
                return;
            }

            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}&folder=${folder}`);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        uploadFile(file, response.signedRequest, response.url);
                    }
                    else {
                        alert('Could not get signed URL.');
                    }
                }
            };
            xhr.send();
        }

        function uploadFile(file, signedRequest, url) {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', signedRequest);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // display file name

                        console.log(url);
                    }
                    else {
                        alert('Could not upload file.');
                    }
                }
            };
            xhr.send(file);
        }

        ////////////////// plugins /////////////////
        // modal plug in for materialize.js
        $(document).ready(function () {
            $('.modal-trigger').leanModal({
                dismissible: true
            });
        });
    }

})();
