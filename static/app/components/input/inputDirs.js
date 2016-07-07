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
                
                advInputs.loadTypeButtons("#input1");
                advInputs.loadDimButtons("#input9");
                advInputs.loadWeightButtons("#input11");
                advInputs.removeAll(["#form-group3", "#form-group4", "#form-group5"]);

                $("#inputForm0").attr('required', 'true');

                var checkNumValidElem = ['#inputForm6', '#inputForm7', '#inputForm8','#inputForm10','#inputForm12','#inputForm13'];
                var checkNumValid = ['type', 'min', 'max'];
                var checkNumValidVals = ['number', '0', '10000'];

                advInputs.setMultAttrs('#inputForm6', checkNumValid, checkNumValidVals);

                // access to attributes for the element's input field
                var inputForm = elem[0].childNodes[3].childNodes[1];

                switch (inputForm.placeholder){
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
