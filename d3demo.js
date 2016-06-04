//item will be place in the map as shapes
var circleData = [
  { "cx": 400, "cy": 400, "radius": 50, "color" : "green" },
  { "cx": 400, "cy": 300, "radius": 50, "color" : "purple" }];

var rectangleData = [
  {"rx":0,"ry":0,"height":50, "width":50,"color":"blue","id":"material 1"},
  {"rx":200, "ry":200,"height":50,"width":50,"color":"red","id":"material 2"},
  {"rx":400, "ry":400,"height":50,"width":50,"color":"green","id":"material 3"}];

var polyData =  [{
    "points":[
      {"x":0.0, "y":50},
      {"x":50,"y":50},
      {"x":150,"y":50},
      {"x":150,"y":150}
    ]}];


//Container for map and items
var svgContainer =d3.select("body").append("svg")
  .attr("width", 700)
  .attr("height",500)
  .style("border","1px solid black");

var circles = svgContainer.selectAll("circle")
  .data(circleData)
  .enter()
  .append("circle");

var circleAttributes = circles
  .attr("cx", function (d) { return d.cx; })
  .attr("cy", function (d) { return d.cy; })
  .attr("r", function (d) { return d.radius; })
  .style("fill", function(d) { return d.color; });

//add rectangles to svg
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
  .style("fill", function(d) { return d.color; })
  .on("mouseover",function(d){//Need to fix translation
    d3.select(this).transition().style("opacity", 1);
  })
  .on("mouseout",function(){
    d3.select(this).transition().style("opacity", 0.5);
  });

var poly = svgContainer.selectAll("polygon")
  .data(polyData)
  .enter()
  .append("polygon");

var polyAttributes = poly
  //Needs fixing, format of "points" needs trasnformation
  .attr("points", "100,50, 200,150, 300,50" )
  .attr("stroke-width", "2px")
  .attr("stroke", "black");


//Add map and add to svgContainer
var level1= d3.xml("level1.svg", "image/svg+xml", function(error, xml) {
    // Insert the SVG image as a DOM node
  svgContainer.node().appendChild(document.importNode(xml.documentElement, true));
  // Acess and manipulate the iamge
  var svgImage = svgContainer.select('svg');
  svgImage
      .attr('width', 700)
      .attr('height', 500)
      .classed("svg-content-responsive",true);
  });

d3.select("body").append("p").text("compiled");
