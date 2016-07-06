angular.module("myApp").directive("adminSearchRes", function () {
    return {
        replace: true,
        templateUrl: '/templates/adminSearchResTmpl.html',
    }
})

angular.module("myApp").directive("addInput",["advInputs", function (advInputs) {
    return {
        replace: true,
        templateUrl: '/templates/inputFormTmpl.html',
        link: function (scope, elem, attrs) {
            scope.$watch(scope, function () {
                // access to attributes for the element's input field
                var inputForm = elem[0].childNodes[3].childNodes[1];

                // remove location and floor input
                if (inputForm.placeholder.toLowerCase().indexOf('location') != -1 || inputForm.placeholder === 'Floor') {
                    inputForm.parentNode.parentNode.remove();
                };

                switch (inputForm.placeholder){
                    case 'Type':
                        inputForm.parentNode.innerHTML = advInputs.makeTypeBtn;
                        break;
                    case 'Units':
                        inputForm.parentNode.innerHTML = advInputs.makeSzDrpDwn;
                        break;
                    case 'Weight Unit':
                        inputForm.parentNode.innerHTML = advInputs.makeWtDrpDwn;
                        break;
                    case 'Name':
                        inputForm.required = true;
                        break;
                    case 'Width':
                    case 'Height':
                    case 'Length':
                    case 'Quantity':
                    case 'Price':
                    case 'Weight':
                        inputForm.type = 'number';
                        inputForm.min = '0';
                        inputForm.max = '10000';
                        break;
                }

            });
        }
    };
}]);

angular.module("myApp").directive('editMapPanes', function () {
    var floorButtons = '<button type="button" class="btn btn-large btn-default" href="#edit-first-floor" data-toggle="tab">First Floor</button>';
    floorButtons += '<button type="button" class="btn btn-large btn-default" href="#edit-second-floor" data-toggle="tab">Second Floor</button><button type="button" class="btn btn-large btn-default" href="#ct-edit" data-toggle="tab">Back</button>';

    return {
        template: floorButtons
    }
});
