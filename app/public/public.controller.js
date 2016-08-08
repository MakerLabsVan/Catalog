(function () {
    angular.module('public')
        .controller('MainController', MainController);

    MainController.$inject = ['$interval', 'dataService'];

    function MainController($interval, dataService) {
        // class refresh
        var checkIdle = checkIdle;
        var resetCheck = resetCheck;
        const refreshTime = 300000;

        var vm = this;
        vm.data = [];

        activate();

        function activate() {
            dataService.get().then(function (data) {
                console.log(data);
                vm.data = data;
                return vm.data;
            })
        }

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