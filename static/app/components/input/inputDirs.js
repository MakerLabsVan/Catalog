angular.module("myApp").directive("adminSearchRes", function () {
    return {
        replace: true,
        templateUrl: 'templates/adminSearchResTmpl.html',
        link: function (scope, elem, attrs) {
            // scope.$watch('inputQuery', function () {
            //     // accessor
            //     if (document.getElementById('ct-srch-res-well').innerHTML === '') {
            //         console.log("Found it!");
            //     }
            // });
        }
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
                var toRemove = elem[0].childNodes[3].childNodes[1];
                if (toRemove.placeholder === 'Location x (ft)' ||
                    toRemove.placeholder === 'Location y (ft)' ||
                    toRemove.placeholder === 'Floor') {
                    elem.remove();
                }

                if (toRemove.placeholder === 'Type') {
                    toRemove.disabled = true;
                }

                switch (scope.formData.Type) {
                    case "Studio":
                        if (toRemove.placeholder === 'Height' ||
                            toRemove.placeholder === 'Weight' ||
                            toRemove.placeholder === 'Weight Unit') {
                            elem.remove();
                        }
                        break;
                    case "Material":
                        // elem.remove();
                        break;
                    case "Tool":
                        // elem.remove();
                        break;
                    case "Consumable":
                    // elem.remove();
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