(function () {

    angular.module("app")
        .controller("adminController", adminController);

    adminController.$inject = ["$scope", "dataService", "highlightService", "searchService", "S3Service"];
    // scope for digest

    function adminController($scope, dataService, highlightService, searchService, S3Service) {
        var vm = this;
        vm.data = {};
        vm.details = {};
        vm.query = '';
        vm.title = "MakerLabs";
        vm.lastSelected = null;

        // functions
        vm.clear = clear;
        vm.filter = filter;
        vm.querySelect = querySelect;
        vm.search = search;
        vm.select = select;
        vm.increaseQty = increaseQty;
        vm.decreaseQty = decreaseQty;

        var hdn = "hidden";

        activate();

        //////////////////////////////
        function activate() {
            dataService.get().then(saveData);

            function saveData(data) {
                console.log(data);
                vm.data = data;
                return vm.data;
            }
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
        }

        function querySelect(key) {
            var entry = vm.data.all[key];
            var qkey = "q-" + entry.key;
            vm.title = entry.name;
            vm.details = entry;

            highlightService.highlight(qkey, entry.type, vm.lastSelected);
            vm.lastSelected = qkey;
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



    }

})();