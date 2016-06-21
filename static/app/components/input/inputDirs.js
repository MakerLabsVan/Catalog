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
})