(function () {
    angular.module('app')
        .controller('publicController', publicController);

    publicController.$inject = ['$interval', 'dataService', 'analytics'];

    function publicController($interval, dataService, analytics) {
        // use this (avoids using $scope but still allows access)
        // store 'this' in a capture variable so context does not change
        // http://codetunnel.io/angularjs-controller-as-or-scope/
        var vm = this;
        vm.data = {};
        vm.details = {};
        vm.searchResult = {};
        vm.query = '';
        vm.title = "MakerLabs";
        // TODO: possibly a service
        vm.filter = filter;
        vm.sendMetric = analytics();
        vm.select = select;

        activate();

        //////////////////////////////////////////////
        function activate() {
            dataService.get().then(function (data) {
                // TODO: separate data into its own bindable objects
                console.log(data);
                vm.data = data;
                return vm.data;
            })
        }

        function search() {
            if (vm.query.length >= 2) {
                var data = vm.data.all;
                for (var i in data) {
                    if (data[i].toLowerCase().indexOf(vm.query.toLowerCase()) != -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }

        function select(key) {
            var entry = vm.data.all[key];
            vm.title = entry.name;
            vm.details = entry;
        }

        function filter(attr, value) {
            return !(attr === 'locx' ||
            attr === 'locy' ||
            attr === 'floor' ||
            attr === 'metadata' ||
            attr === 'key' ||
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