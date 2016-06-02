//

var rectangleData = [
  {"rx":0,"ry":0,"height":200, "width":225,"color":"blue"},
  {"rx":200, "ry":200,"height":50,"width":50,"color":"red"},
  {"rx":1400, "ry":1100,"height":50,"width":50,"color":"green"}];

var svgContainer =d3.select("body").append("svg")
  .attr("width", 1400)
  .attr("height",1400);

var rectangles = svgContainer.selectAll("rect")
  .data(rectangleData)
  .enter()
  .append("rect")
  .on("mouseover",function(){
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



  var level1= d3.xml("level1.svg", "image/svg+xml", function(error, xml) {
    // Insert the SVG image as a DOM node
  svgContainer.node().appendChild(document.importNode(xml.documentElement, true));

  // Acess and manipulate the iamge
  var svgImage = svgContainer.select('svg');

  svgImage
      .attr('width', 1400)
      .attr('height', 1400); });

d3.select("body").append("p").text("compiled");
