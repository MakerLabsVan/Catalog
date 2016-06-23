angular.module("myApp").directive("adminSearchRes", function () {
    return {
        replace: true,
        templateUrl: 'templates/adminSearchResTmpl.html',
        link: function (scope, elem, attrs) {
        }
    }
})


angular.module("myApp").directive("editEntryForm", function () {
    return {
        replace: true,
        templateUrl: 'templates/editEntryTmpl.html',
        link: function (scope, elem, attrs) {
            scope.$watch(scope, function () {
                if (attrs.placeholder === '') {
                    elem.remove();
                }
            });
        }
    };
});

angular.module("myApp").directive("addInput", function () {
    return {
        replace: true,
        templateUrl: 'templates/inputFormTmpl.html',
        link: function (scope, elem, attrs) {
            scope.$watch(scope, function () {
                // nested accessor to child nodes to read placeholder of ng-repeat elements
                var toRemove = elem[0].childNodes[3].childNodes[1].placeholder;
                if (toRemove === 'Location x (ft)' ||
                    toRemove === 'Location y (ft)' ||
                    toRemove === 'Floor') {
                    elem.remove();
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