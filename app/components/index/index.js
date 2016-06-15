var myApp = angular.module("myApp", ['ui.bootstrap', 'popoverApp']);

myApp.controller("MainCtrl", ["$scope", '$http', "$sce", function ($scope, $http, $sce) {

    $scope.categories = {
        "studio": "Studios",
        "tools": "Tools",
        "cons": "Consumables",
        "mats": "Materials"
    };

    $scope.queryTerm = '';
    $scope.inputQuery = '';


    $scope.entryProps = "/views/entryTpls.html";

    $scope.changeH = function () {
        // if searching but no click = 
        if ($scope.queryTerm.length == 0) {
            document.getElementById("searchSection").style.height = '0px';
        } else {
            document.getElementById("searchSection").style.height = '370px';
        }
    };
    
    
    // make into var func or add callback
    $http({
        method: 'GET',
        url: '//localhost:3000/getData'
    })
        .success(function (data, status, header, config) {
            // success data
            $scope.data = data;
        })
        .error(function (data, status, header, config) {
            // something went wrong
            alert("Something went wrong! Please call for help!");
        });



    /*
    To use:
        Create form tag and add ng-submit=post() to call this function
        Then add input such as text and add ng-models to them.
        The ng-models should be named such as:
            <parent.child>
            eg below. formData is parent and in the input element in the html
            the desc in formData.desc is the child
    */

    $scope.clearForm = function () {
        $scope.formData = null;
    }

    $scope.stdPost = function () {
        $http.post('/input', $scope.formData)
            .success(function (data) {
            })
            .error(function (data) {
            })
        $scope.clearForm();
    };


    $scope.deletePost = function () {
        $http.post('/delete', this.object)
            .success(function (data) {
            })
            .error(function (data) {
            })
    };
}]);

myApp.filter('details', function() {
    return function(object){
        var out = [];
        if (object[1] === "Studio"){
            out.push(object[3]);
            out.push(object[4]);
            out.push(object[5]);
            out.push(object[6]);
            out.push(object[7]);
            out.push(object[9]);
        }
        
        if (object[1] === "Studio"){
            out.push(object[3]);
            out.push(object[4]);
            out.push(object[5]);
            out.push(object[6]);
            out.push(object[7]);
            out.push(object[9]);
        }
        
    }
})