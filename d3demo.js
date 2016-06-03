//item will be place in the map as shapes
var rectangleData = [
  {"rx":0,"ry":0,"height":200, "width":225,"color":"blue"},
  {"rx":200, "ry":200,"height":50,"width":50,"color":"red"},
  {"rx":1400, "ry":1100,"height":50,"width":50,"color":"green"}];

//Container for map and items
var svgContainer =d3.select("body").append("svg")
  .attr("width", 700)
  .attr("height",500)
  .style("border","1px solid black");

//add rectangles to svg
var rectangles = svgContainer.selectAll("rect")
  .data(rectangleData)
  .enter()
  .append("rect")
  .on("mouseover",function(){//Need to fix translation
    d3.select(this).transition().attr("transform","scale(1.2)")
  })
  .on("mouseout",function(){
    d3.select(this).transition().attr("transform","scale(1)")
  });

var rectangleAttributes = rectangles
  .attr("x", function (d) { return d.rx; })
  .attr("y", function (d) { return d.ry; })
  .attr("height", function (d) { return d.height; })
  .attr("width", function (d) { return d.width; })
  .style("fill", function(d) { return d.color; });


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
