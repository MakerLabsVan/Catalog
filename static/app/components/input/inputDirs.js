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
                var inputForm = elem[0].childNodes[3].childNodes[1];

                if (inputForm.placeholder === 'Location x (ft)' || inputForm.placeholder === 'Location y (ft)' || inputForm.placeholder === 'Floor') {
                    inputForm.parentNode.parentNode.remove();
                }

                // at least name input
                if (inputForm.placeholder === 'Name') {
                    inputForm.required = true;
                }

                // numeric validation
                if (inputForm.placeholder === 'Width' ||
                    inputForm.placeholder === 'Height' ||
                    inputForm.placeholder === 'Length' ||
                    inputForm.placeholder === 'Quantity' ||
                    inputForm.placeholder === 'Price') {
                    inputForm.type = 'number';
                    inputForm.min = '0';
                    inputForm.max = '10000';
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
