angular.module("myApp").directive("indexSearchRes", function () {
    return {
        replace: false,
        templateUrl: 'templates/indexSearchResTmpl.html',
    };
});

// angular.module("myApp").directive("categoryRes", function () {
//     return {
//         templateUrl: 'templates/categoryResTmpl.html',
//         link: function(scope, elem, attrs){
//             console.log(document.getElementById("entryPO").innerHTML);
//             document.getElementById("entryPO").innerHTML = "{{ object[1] === '" + String(attrs.type) + "' ? object[0] : '' }}";
//         }
//     }
// })
