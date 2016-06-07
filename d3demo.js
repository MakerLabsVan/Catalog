//Fake map information
var circleData = [
  { "cx": 400, "cy": 400, "radius": 50, "id" : "material1" },
  { "cx": 400, "cy": 300, "radius": 50, "id" : "material2" }];

var rectangleData = [
  {"rx":100,"ry":100,"height":50, "width":50,"id":"studio1","color":"blue"},
  {"rx":200, "ry":200,"height":50,"width":50,"id":"studio2","color":"blue"},
  {"rx":400, "ry":400,"height":50,"width":50,"id":"studio3","color":"blue"}];

var polyData =  [{
    "points":[
      {"x":0.0, "y":50},
      {"x":50,"y":50},
      {"x":150,"y":50},
      {"x":150,"y":150}
    ]}];

//Container for map and map information
var svgContainer =d3.select("body").append("svg")
  .attr("width", 500)
  .attr("height",500)
  .attr("id", "container")
  .style("border","1px solid black");

//Circles are used to represent materials/consumables/tools

var circleText = svgContainer.selectAll("text")
  .data(circleData)
  .enter()
  .append("text")

var circleTestLabels = circleText
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
  .append("circle");

var circleAttributes = circles
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


//Rectangles represent studio spaces
var rectangles = svgContainer.selectAll("rect")
  .data(rectangleData)
  .enter()
  .append("rect");

var rectangleAttributes = rectangles //modify to accept data from source
  .attr("x", function (d) { return d.rx; })
  .attr("y", function (d) { return d.ry; })
  .attr("height", function (d) { return d.height; })
  .attr("width", function (d) { return d.width; })
  .attr('id',function (d) { return d.id; })
  .style("opacity",0.5)
  .style("cursor","pointer")
  .on("mouseover",function(d){//Need to fix translation
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
    // Insert the SVG image as a DOM node
  svgContainer.node().appendChild(document.importNode(xml.documentElement, true));
  // Acess and manipulate the iamge
  var svgImage = svgContainer.select('svg');
  svgImage
      .attr('width', 700)
      .attr('height', 500)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 500 700")
      .classed("svg-content-responsive",true);
  });


function highlightItem(name){
  svgContainer.select("rect#studio1")
  .attr('fill',"red")
  .style("opacity",1);
}

function dehighlightItem(name){
  svgContainer.select("rect#studio1")
  .attr('fill',"none")
  .style("opacity",0.5);
}



d3.select("body").append("p").text("compiled");
