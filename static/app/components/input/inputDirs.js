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
                var filters = {
                    all_filter: [
                        'Location x (ft)', 'Location y (ft)', 'Floor'
                    ],
                    std_filter: [
                        'Height', 'Weight', 'Weight Unit'
                    ]
                };

                var runFilter = function (filter) {
                    for (var i in filter) {
                        if (toRemove.placeholder === filter[i]) {
                            elem.remove();
                        }
                    };
                }

                // access to attributes for the element's input field
                var toRemove = elem[0].childNodes[3].childNodes[1];
                runFilter(filters.all_filter);

                // at least name input
                if (toRemove.placeholder === 'Name') {
                    toRemove.required = true;
                }

                if (toRemove.placeholder === 'Width' ||
                    toRemove.placeholder === 'Height' ||
                    toRemove.placeholder === 'Length' ||
                    toRemove.placeholder === 'Quantity' ||
                    toRemove.placeholder === 'Price') {
                    toRemove.type = 'number';
                    toRemove.min = '0';
                    toRemove.max = '10000';
                }

                // disable type input
                if (toRemove.placeholder === 'Type') {
                    toRemove.disabled = true;
                }

                // run input form filter for studio
                // bug exists where it does not update on tab switch
                if (scope.formData['Type'] === 'Studio') {
                    runFilter(filters.std_filter);
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