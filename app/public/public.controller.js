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
        vm.sendMetric = analytics();
        vm.select = select;

        activate();

        //////////////////////////////////////////////
        function activate() {
            dataService.get().then(function (data) {
                console.log(data);
                vm.data = data;
                return vm.data;
            })
        }

        function select(key) {
            console.log("Selected " + key);
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