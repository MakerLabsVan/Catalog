angular.module("myApp").directive("indexSearchRes", function () {
    return {
        replace: true,
        templateUrl: 'templates/indexSearchResTmpl.html',
        link: function (scope, elem, attrs) {
        }
    }
})