//Fake map information
var circleData = [
  { "cx": 400, "cy": 400, "radius": 50, "id" : "material1" },
  { "cx": 400, "cy": 300, "radius": 50, "id" : "material2" }];

var rectangleData = [
  {"rx":0,"ry":0,"height":50, "width":50,"id":"studio1","floor":2,"color":"blue"},
  {"rx":200, "ry":200,"height":50,"width":50,"id":"studio2","floor":1,"color":"blue"},
  {"rx":400, "ry":400,"height":50,"width":50,"id":"studio3","floor":1,"color":"blue"}];

var polyData =  [{
    "points":[
      {"x":0.0, "y":50},
      {"x":50,"y":50},
      {"x":150,"y":50},
      {"x":150,"y":150}
    ]}];

function init(widthC,heightC,metadata){
  //Container for map and map information
  var svgContainer=d3.select("body").append("svg")
    .attr("width", widthC)
    .attr("height",heightC)
    .attr("id", "container")
    .style("border","1px solid black");
    /*
  //Circles are used to represent materials/consumables/tools
  var circleText = svgContainer.selectAll("text")
    .data(circleData)
    .enter()
    .append("text")
    .attr("x", function(d) { return d.cx; })
    .attr("y", function(d) { return d.cy; })
    .text( function (d) { return "( " + d.cx + ", " + d.cy +" )"; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "red")
    .attr("visibility","hidden");

  var circles = svgContainer.selectAll("circle")
    .data(circleData)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return d.cx; })
    .attr("cy", function (d) { return d.cy; })
    .attr("r", function (d) { return d.radius; })
    .attr('id',function (d) { return d.id; })
    .style("opacity",0.5)
    .style("cursor","pointer")
    .on("mouseover",function(d){//Need to fix translation
      d3.select(this).transition().style("opacity", 1)
    })
    .on("mouseout",function(){
      d3.select(this).transition().style("opacity", 0.5)
    });
    */
/*
    var rectangleText = svgContainer.selectAll("text")
      .data(rectangleData)
      .enter()
      .append("text")
      .attr("x", function(d) { return d.rx; })
      .attr("y", function(d) { return d.ry; })
      .attr('id',function (d) { return d.id; })
      .text( function (d) { return "( " + d.rx + ", " + d.ry +" )"; })
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "red")
      .attr("visibility","hidden");

*/
    //Rectangles represent studio spaces
    var rectangles = svgContainer.selectAll("rect")
      .data(rectangleData)
      .enter()
      .append("rect")
      .attr("x", function (d) { return d.rx; })
      .attr("y", function (d) { return d.ry; })
      .attr("height", function (d) { return d.height; })
      .attr("width", function (d) { return d.width; })
      .attr('id',function (d) { return d.id; })
      .attr("floor", function(d) { return d.floor; })
      .style("opacity",0.5)
      .style("cursor","pointer")
      .on("mouseover",function(d){
        d3.select(this).transition().style("opacity", 1);
      })
      .on("mouseout",function(){
        d3.select(this).transition().style("opacity", 0.5);
      });
    //Polygon data have yet to be generated
  /*
  d3.json("polygon.json", function(data) {
    svgContainer.selectAll("polygon")
    .data(data.Polygons)
    .enter().append("polygon")
    .attr("points",function(d) {
      return d.points.map(function(d) { return [d.x,d.y].join(","); }).join(" ");
    })
  })
  */

  //Add map and add to svgContainer



      var level1= d3.xml("level1.svg", "image/svg+xml", function(error, xml) {
        svgContainer.node().appendChild(document.importNode(xml.documentElement, true));
        var floor1 = svgContainer.select('svg')
            .attr("floor",1)
            .attr("x",0)
            .attr("y",0)
            .attr('width', "100%")
            .attr('height', "100%")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("visibility","hidden");
            //.attr("viewBox", "0 0 " + widthC + " " + heightC);
        });
};

function showFloor1(){
  d3.select("body").selectAll("svg")
    .attr("visibility","visible");
}

function hideFloor1(){
  d3.select("body").selectAll("svg")
    .attr("visibility","hidden");
}

function highlightItem(objId){
  d3.select("body").select("rect#" + objId)
  .attr('fill',"red")
  .style("opacity",1);
}

function dehighlightItem(objId){
  d3.select("body").select("rect#" + objId)
  .attr('fill',"none")
  .style("opacity",0.5);
}



d3.select("body").append("p").text("compiled");
