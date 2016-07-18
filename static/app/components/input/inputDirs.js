var inputApp = angular.module('inputApp');

inputApp.directive("addInput", ["advInputs", function (advInputs) {
    return {
        replace: true,
        templateUrl: '/templates/inputFormTmpl.html',
        link: function (scope, elem, attrs) {
            scope.$watch(scope, function () {
                // set button type inputs 
                $('#input1').html($('#type-buttons').html());
                $('#input9').html($('#dimension-buttons').html());
                $('#input11').html($('#weight-buttons').html());

                // remove inputs for location and floor
                advInputs.removeAll(["#form-group3", "#form-group4", "#form-group5"]);

                // set attributes for numerical validation
                $("#inputForm0").attr('required', 'true');
                var checkNumValidElem = ['#inputForm6', '#inputForm7', '#inputForm8', '#inputForm10', '#inputForm12', '#inputForm13'];
                var checkNumValid = ['type', 'min', 'max'];
                var checkNumValidVals = ['number', '0', '10000'];
                advInputs.setMultAttrs(checkNumValidElem, checkNumValid, checkNumValidVals);
                
            });
        }
    };
}]);

// buttons for the map panes on location select page
// TODO: Change to .html instead of server template
inputApp.directive('editMapPanes', function () {
    var floorButtons = '<button type="button" class="btn btn-large btn-default" href="#edit-first-floor" data-toggle="tab">First Floor</button>';
    floorButtons += '<button type="button" class="btn btn-large btn-default" href="#edit-second-floor" data-toggle="tab">Second Floor</button><button type="button" class="btn btn-large btn-default" href="#ct-edit" data-toggle="tab">Back</button>';

    return {
        template: floorButtons
    }
});
