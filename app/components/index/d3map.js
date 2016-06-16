var app = angular.module("d3mapping", []);

app.controller("mapController", ["$scope", '$http', "$sce", function ($scope, $http, $sce) {
  $http({
    method: 'GET',
    url: '//localhost:3000/getData'
  })
    .success(function (data, status, header, config) {
      // success data
      $scope.data = data;
      $scope.test = data[1][4]
      $scope.studioData = [];
      $scope.itemData = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i][1] === "Studio") {
          var obj = {
            "rx": data[i][3],
            "ry": data[i][4],
            "floor": data[i][5],
            "height": data[i][7],
            "width": data[i][6],
            "id": data[i][0]
          };
          $scope.studioData = $scope.studioData.concat(obj);
        }
        else {
          var obj = {
            "x": data[i][3],
            "y": data[i][4],
            "floor": data[i][5],
            "height": data[i][7],
            "width": data[i][6],
            "id": data[i][0]
          };
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
/**
app.directive("makerLabsMap",function(){
  var margin = 20,
    width = 960,
    height = 500 - .5 - margin;

    return {
            scope: {
              item: "@",
              studio:"@"
            },
            link: function(scope){

              var aspectL1 = 1.25385;//W=1364.490,H=1088.246
              var aspectL2 = 0.85035; // W=925.374,H=1088.238
              if (width/height > aspectL1){var scaleL1=height/1088.246; }
              else {var scaleL1=width/1364.490;}

              var svgContainer = d3.select("#map-well").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("id", "svgMapContainer")
                .style("border","1px solid black")
                .on("click", function(){
                  marker.attr("x",d3.mouse(this)[0]+"px").attr("y",d3.mouse(this)[1]+"px");
                  marker.style("visibility", "visible");
                });

                //Add map and add to svgContainer
                var level1= d3.xml("../d3_files/level1.svg", "image/svg+xml", function(xml) {
                  svgContainer.node().appendChild(document.importNode(xml.documentElement, true));
                  svgContainer.select('svg')
                      .attr("x",0)
                      .attr("y",0)
                      .attr('height', height)
                      .attr('width', width)
                      .attr("preserveAspectRatio", "xMinYMin meet")
                      .attr("id","level1");
                });

                var marker = svgContainer
                .append("svg:image")
                .attr("xlink:href", "../d3_files/marker.svg")
                .style("visibility","hidden")
                .attr("id","marker")
                .attr("x",50)
                .attr("y",50)
                .attr("width",50)
                .attr("height",50);

                console.log(scope)
                /*
                var rectangles = svgContainer.selectAll("rect")
                  .data()
                  .enter()
                  .append("rect")
                  .attr("x", function (d) { return (d.rx/10)*scaleL1+"in"; })//Assumes that dimensions are in ft, 500 is the pixel height of map
                  .attr("y", function (d) { return (d.ry/10)*scaleL1+"in"; })
                  .attr("height", function (d) { return (d.height/10)*scaleL1+"in"; })
                  .attr("width", function (d) { return (d.width/10)*scaleL1+"in"; })
                  .attr('id',function (d) { return d.id; })
                  .attr("floor", function(d) { return d.floor; })
                  .style("color","blue")
                  .style("opacity",0.5)
                  .style("cursor","pointer")
                  .on("mouseover",function(d){
                    d3.select(this).transition().style("opacity", 1);
                  })
                  .on("click", function(d){
                    tooltip.attr("x",d3.mouse(this)[0]+10+"px").attr("y",d3.mouse(this)[1]+30+"px");
                    tooltip.text(d.id);
                    return tooltip.style("visibility", "visible");
                  })
                  .on("mouseout",function(){
                    d3.select(this).transition().style("opacity", 0.5);
                  });

            }
        };



})*/
