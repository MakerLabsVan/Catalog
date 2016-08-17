(function () {

    angular.module('app')
        .service("highlightService", highlightService);

    function highlightService() {
        var service = {
            highlight: highlight
        };

        return service;

        /////////////////////////////////////////
        function highlight(key, type, prev) {
            var changeSelection = function (color) {
                $('#' + prev).removeClass('white-font light-red light-orange light-green light-blue');
                $('#' + key).addClass('white-font ' + color);
                $('#entry-title').removeClass('white-font light-red light-orange light-green light-blue').addClass('white-font ' + color);
                prev = key;
            };

            switch (type) {
                case 'Studio':
                    changeSelection('light-red');
                    break;
                case 'Material':
                    changeSelection('light-orange');
                    break;
                case 'Consumable':
                    changeSelection('light-green');
                    break;
                case 'Tool':
                    changeSelection('light-blue');
            }
        }
    }
})();