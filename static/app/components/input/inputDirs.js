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
        }
    }
});

angular.module("myApp").directive("modalLoc", function () {
    return {
        templateUrl: 'templates/modalLocTmpl.html',
    }
});