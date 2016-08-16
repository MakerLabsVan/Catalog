(function () {
    angular.module('app')
        .controller('publicController', publicController);

    publicController.$inject = ['$interval', 'dataService', 'searchService', 'highlightService', 'S3Service', 'analytics'];

    function publicController($interval, dataService, searchService, highlightService, S3Service, analytics) {
        // use this (avoids using $scope but still allows access)
        // store 'this' in a capture variable so context does not change
        // http://codetunnel.io/angularjs-controller-as-or-scope/
        var vm = this;
        vm.data = {};
        vm.details = {};
        vm.query = '';
        vm.title = "MakerLabs";
        vm.lastSelected = null;

        // functions
        vm.clear = clear;
        vm.filter = filter;
        vm.loadImage = loadImage;
        vm.querySelect = querySelect;
        vm.search = search;
        vm.sendMetric = analytics();
        vm.select = select;

        var hdn = "hidden";

        activate();

        //////////////////////////////////////////////
        function activate() {
            dataService.get().then(function (data) {
                console.log(data);
                vm.data = data;
                return vm.data;
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
            attr === 'image' ||
            attr === 'keywords' ||
            attr === 'name' ||
            value === '');
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

        // TODO: select and querySelect share too much code
        function select(key) {
            var entry = vm.data.all[key];
            vm.title = entry.name;
            vm.details = entry;

            // highlight
            highlightService.highlight(entry.key, entry.type, vm.lastSelected);
            vm.lastSelected = key;

            // show loading icon when clicked and change on load
            $("#entry-image").addClass(hdn);
            $("#not-found").addClass(hdn);
            $("#loading").removeClass(hdn);

            // load image
            loadImage(entry.type, entry.name);

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

        // TODO: move to refresh.service.js
        // class refresh
        var checkIdle = checkIdle;
        var resetCheck = resetCheck;
        const refreshTime = 300000;

        // decl. refresh
        // start interval promise
        checkIdle = $interval(function () {
            location.reload();
        }, refreshTime);

        // destroy promise and create new promise to reset the time
        resetCheck = function () {
            $interval.cancel(checkIdle);
            checkIdle = $interval(function () {
                location.reload();
            }, refreshTime);
        };

        // any click will reset the clock
        $('body').click(function () {
            resetCheck();
        });

    }
})();