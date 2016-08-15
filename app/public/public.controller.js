(function () {
    angular.module('app')
        .controller('publicController', publicController);

    publicController.$inject = ['$interval', 'dataService', 'highlightService', 'analytics'];

    function publicController($interval, dataService, highlightService, analytics) {
        // use this (avoids using $scope but still allows access)
        // store 'this' in a capture variable so context does not change
        // http://codetunnel.io/angularjs-controller-as-or-scope/
        var vm = this;
        vm.data = {};
        vm.details = {};
        vm.searchResult = {};
        vm.query = '';
        vm.title = "MakerLabs";
        vm.lastSelected = null;

        // functions
        vm.filter = filter;
        vm.sendMetric = analytics();
        vm.select = select;
        vm.querySelect = querySelect;
        vm.queryHL = highlightService.searchHL;


        activate();

        //////////////////////////////////////////////
        function activate() {
            dataService.get().then(function (data) {
                console.log(data);
                vm.data = data;
                return vm.data;
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
        }

        function querySelect(key) {
            var entry = vm.data.all[key];
            var qkey = "q-" + entry.key;
            vm.title = entry.name;
            vm.details = entry;

            highlightService.highlight(qkey, entry.type, vm.lastSelected);
            vm.lastSelected = qkey;
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