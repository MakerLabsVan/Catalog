(function () {

    angular.module("app")
        .service("highlightService", highlightService);

    function highlightService() {
        var service = {
            highlight: highlight
        };

        return service;

        /////////////////////////////////////////
        function highlight(key, type, prev) {
            var changeSelection = function (color) {
                $('#' + prev).removeClass('whiteFont lightRed lightOrange lightGreen lightBlue');
                $('#' + key).addClass('whiteFont ' + color);
                prev = key;
            };

            switch (type) {
                case 'Studio':
                    changeSelection('lightRed');
                    break;
                case 'Material':
                    changeSelection('lightOrange');
                    break;
                case 'Consumable':
                    changeSelection('lightGreen');
                    break;
                case 'Tool':
                    changeSelection('lightBlue');
            }
        }
    }
})();