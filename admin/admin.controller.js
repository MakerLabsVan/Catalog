(function () {

    angular.module("app")
        .controller("adminController", adminController);

    adminController.$inject = ["$scope", "$window", "sheetsGetService", "sheetsWriteService", "highlightService", "searchService", "S3Service", "oauthService"];
    // scope for digest

    function adminController($scope, $window, sheetsGetService, sheetsWriteService, highlightService, searchService, S3Service, oauthService) {
        var vm = this;
        vm.authCode = '';
        vm.data = {};
        vm.details = {};
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
        vm.querySelect = querySelect;
        vm.search = search;
        vm.select = select;


        var hdn = "hidden";

        activate();

        //////////////////////////////
        function activate() {
            sheetsGetService.get().then(saveData);

            function saveData(data) {
                console.log(data);
                vm.data = data;
                return vm.data;
            }
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
            var entry = vm.data.all[key];
            vm.title = entry.name;
            vm.details = entry;
            // convert to num
            vm.details.quantity = Number(vm.details.quantity);

            // uncheck previous type
            $("input[name=radio-type]:checked").prop('checked', false);
            // select correct radio
            switch (vm.details.type) {
                case "Studio":
                    $('input#radio-studio').prop('checked', true);
                    break;
                case "Tool":
                    $('input#radio-tool').prop('checked', true);
                    break;
                case "Material":
                    $('input#radio-material').prop('checked', true);
                    break;
                case "Consumable":
                    $('input#radio-consumable').prop('checked', true);
            }

            // highlight
            highlightService.highlight(entry.key, entry.type, vm.lastSelected);
            vm.lastSelected = key;

            imageResponse();
            loadImage(entry.type, entry.name)
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

        function querySelect(key) {
            var entry = vm.data.all[key];
            var qkey = "q-" + entry.key;
            vm.title = entry.name;
            vm.details = entry;

            highlightService.highlight(qkey, entry.type, vm.lastSelected);
            vm.lastSelected = qkey;
            console.log(vm.details);
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

        function newEntry() {
            // send the data to the server to write to sheets

            // make body to send
            var body = [];
            for (var i in vm.data.minimized) {
                var key = vm.data.minimized[i];
                body.push(vm.details[key]);
            }


            // make http post request
            sheetsWriteService.write(body).then(function (result) {
                console.log(result);
            })
        }

        function keyGen(body) {
            // make key new or existing
            if (vm.details.key != undefined) {
                body[body.length - 1] = vm.details.key;
            } else {
                // KEYGEN (takes last key for new keygen (can cause gaps)
                var tempkey = vm.data.array[vm.data.all.length - 1][vm.data.keyIndex];
                // remove first letter and only get digits
                var slice = tempkey.slice(1, tempkey.length);
                // TODO: change A to increment
                var newKey = 'A' + (Number(slice) + 1);

                // last index is the new key
                body[body.length - 1] = String(newKey);
                // save locally
                vm.details.key = String(newKey);
            }
            // upload image when selected
            fileHandler();
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
                    console.log(url);
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
                    console.log(file.name);
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