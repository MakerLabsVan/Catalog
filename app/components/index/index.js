var myApp = angular.module("myApp", ['ui.bootstrap']);

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

    $http({
        method: 'GET',
        url: '//localhost:3000/getData'
    })
        .success(function (data, status, header, config) {
            // success data
            $scope.data = data;

            var studtemp = 0;
            var tooltemp = 0;
            var mattemp = 0;
            var contemp = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i][1] === "Studio") studtemp++;
                if (data[i][1] === "Tool") tooltemp++;
                if (data[i][1] === "Consumable") contemp++;
                if (data[i][1] === "Material") mattemp++;
            }
            $scope.modelStdSize = studtemp;
            $scope.toolSize = tooltemp;
            $scope.matSize = mattemp;
            $scope.conSize = contemp;

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
        $http.post('/delete', $scope.deleteName)
            .success(function (data) {
                console.log(data);
            })
            .error(function (data) {
            })
    };



}]);