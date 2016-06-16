var app = angular.module("d3mapping", []);

app.controller("mapController", ["$scope", '$http', "$sce", function ($scope, $http, $sce) {

    $http({
        method: 'GET',
        url: '//localhost:3000/getData'
    })
        .success(function (data, status, header, config) {

            // success data
            $scope.data = data;
            $scope.test= data[1][4]
            $scope.studioData = [];
            $scope.itemData=[];
            for (var i = 0; i < data.length; i++) {
                if (data[i][1] === "Studio") {
                    var obj = {"rx": parseInt(data[i][3]),
                      "ry": parseInt(data[i][4]),
                      "floor":parseInt(data[i][5]),
                      "height": parseInt(data[i][7]),
                       "width": parseInt(data[i][6]),
                       "id":  data[i][0]};
                    $scope.studioData = $scope.studioData.concat(obj);
               }
                else {
                  var obj = {"x": parseInt(data[i][3]),
                    "y": parseInt(data[i][4]),
                    "floor":parseInt(data[i][5]),
                    "height": parseInt(data[i][7]),
                     "width": parseInt(data[i][6]),
                     "id":  data[i][0]};
                     $scope.itemData = $scope.itemData.concat(obj);
                }
              }

        })
        .error(function (data, status, header, config) {
            // something went wrong
            alert("Something went wrong! Please call for help!");
        });



}]);

//Directives for D3, in progress, may not use
var containerID="firstFloorWell";
var floorNum=1;
app.directive("makerMap",function(){
    return {
            scope: false,
            link: function(scope){

              var width = document.getElementById(containerID).scrollWidth - 50;
              var height = document.getElementById(containerID).scrollHeight - 50;

              //Default floor 1 unless specified
              if ( floorNum === 2){
                var aspect = 0.85035;//W=1364.490,H=1088.246
                var floorFile="../d3_files/level2.svg"
              }
              else {
                var aspect = 1.25385;//W=1364.490,H=1088.2464
                var floorFile="../d3_files/level1.svg"
              }

              if (width/height > aspect){
                var scale=height/1088.246;
              }
              else {
                var scale=width/1364.490;
              }
              //Container for map and map information
              var svgContainer = d3.select("#"+containerID).append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("id", "svgMapContainer")
                .on("click", function(){
                  marker.attr("x",d3.mouse(this)[0]-25+"px").attr("y",d3.mouse(this)[1]-50+"px");
                  marker.style("visibility", "visible");
                });

                //Add map and add to svgContainer
                var map= d3.xml(floorFile, "image/svg+xml", function(xml) {
                  svgContainer.node().appendChild(document.importNode(xml.documentElement, true));
                  svgContainer.select('svg')
                      .attr("x",0)
                      .attr("y",0)
                      .attr('height', height)
                      .attr('width', width)
                      .attr("preserveAspectRatio", "xMinYMin meet");
                });

                var marker = svgContainer
                  .append("svg:image")
                  .attr("xlink:href", "../d3_files/marker.svg")
                  .style("visibility","hidden")
                  .attr("id","marker")
                  .attr("width",50)
                  .attr("height",50);

                //Rectangles represent studio spaces
                scope.$watchGroup(['studioData','itemData'], function(data){
                  if (!data){return;}
                  var rectangles = svgContainer.selectAll("svg")
                    .data(data[0])
                    .enter()
                    .append("rect")
                    .attr("x", function (d) { return (d.rx/10)*scale+"in"; })//Assumes that dimensions are in ft, 500 is the pixel height of map
                    .attr("y", function (d) { return (d.ry/10)*scale+"in"; })
                    .attr("height", function (d) { return (d.height/10)*scale+"in"; })
                    .attr("width", function (d) { return (d.width/10)*scale+"in"; })
                    .attr('id',function (d) { return d.id; })
                    .style("color","blue")
                    .style("opacity",0.5)
                    .style("cursor","pointer")
                    .on("mouseover",function(d){
                      d3.select(this).transition().style("opacity", 1);
                    })
                    .on("mouseout",function(){
                      d3.select(this).transition().style("opacity", 0.5);
                    });
                });

            }
        };



})
