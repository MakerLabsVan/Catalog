angular.module("myApp").directive("adminSearchRes", function () {
    return {
        replace: true,
        templateUrl: 'templates/adminSearchResTmpl.html',

    }
})

angular.module("myApp").directive("editEntryForm", function () {
    return {
        replace: true,
        templateUrl: 'templates/editEntryTmpl.html',
    };
});

angular.module("myApp").directive("addInput", function () {
    return {
        replace: true,
        templateUrl: 'templates/inputFormTmpl.html',
        link: function (scope, elem, attrs) {
            scope.$watch(scope, function () {
                // nested accessor to child nodes to read placeholder of ng-repeat elements
                var all_filter = [
                    'Location x (ft)', 'Location y (ft)', 'Floor'
                ];

                var std_filter = [
                    'Height', 'Weight', 'Weight Unit'
                ]

                // access to attributes for the element's input field
                var toRemove = elem[0].childNodes[3].childNodes[1];
                for (var i in all_filter) {
                    if (toRemove.placeholder === all_filter[i]) {
                        elem.remove();
                    }
                };

                if (toRemove.placeholder === 'Type') {
                    toRemove.disabled = true;
                }

            });
        }
    };
});

angular.module("myApp").directive("modalLoc", function () {
    return {
        templateUrl: 'templates/modalLocTmpl.html',
    }
});