(function () {
    angular.module("app")
        .service("analytics", analytics);

    function analytics() {
        return function () {
            ga('send', 'event', 'Clicked an Entry', 'click');
        }
    }

})();