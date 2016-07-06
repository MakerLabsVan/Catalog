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

                var makeTypeBtn = advInputs.makeTypeBtn;

                var makeSzDrpDwn = advInputs.makeSzDrpDwn;

                var makeWtDrpDwn = advInputs.makeWtDrpDwn;

                // change type to button select
                if (inputForm.placeholder === 'Type'){
                    var typeBtnSet = makeTypeBtn("Studio");
                    typeBtnSet += makeTypeBtn("Material");
                    typeBtnSet += makeTypeBtn("Consumable");
                    typeBtnSet += makeTypeBtn("Tool");
                    inputForm.parentNode.innerHTML = typeBtnSet;
                }

                if (inputForm.placeholder === 'Units'){
                    inputForm.parentNode.innerHTML = makeSzDrpDwn;
                }

                if (inputForm.placeholder === 'Weight Unit'){
                    inputForm.parentNode.innerHTML = makeWtDrpDwn;
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
}]);

angular.module("myApp").directive('editMapPanes', function () {
    var floorButtons = '<button type="button" class="btn btn-large btn-default" href="#edit-first-floor" data-toggle="tab">First Floor</button>';
    floorButtons += '<button type="button" class="btn btn-large btn-default" href="#edit-second-floor" data-toggle="tab">Second Floor</button><button type="button" class="btn btn-large btn-default" href="#ct-edit" data-toggle="tab">Back</button>';

    return {
        template: floorButtons
    }
});
