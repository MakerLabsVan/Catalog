angular.module("myApp").directive("adminSearchRes", function () {
    return {
        replace: true,
        templateUrl: '/templates/adminSearchResTmpl.html',
    }
})


angular.module("myApp").directive("addInput", function () {
    return {
        replace: true,
        templateUrl: '/templates/inputFormTmpl.html',
        link: function (scope, elem, attrs) {
            scope.$watch(scope, function () {
                // access to attributes for the element's input field
                var toRemove = elem[0].childNodes[3].childNodes[1];

                // at least name input
                if (toRemove.placeholder === 'Name') {
                    toRemove.required = true;
                }

                // numeric validation
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

            });
        }
    };
});

angular.module("myApp").directive('editMapPanes', ['mapService', function (mapService) {
    return {
        template: '<div class="container-fluid"><button type="button" class="btn btn-large btn-default" href="#edit-first-floor" data-toggle="tab">First Floor</button><button type="button" class="btn btn-large btn-default" href="#edit-second-floor" data-toggle="tab">Second Floor</button><button type="button" class="btn btn-large btn-default" href="#ct-edit" data-toggle="tab">Back</button></div>'
    }
}]);
