//Fake map information
var rectangleData = [
  {"rx":0,"ry":0,"height":50, "width":50,"id":"studio1"},
  {"rx":200, "ry":200,"height":50,"width":50,"id":"studio2"},
  {"rx":400, "ry":400,"height":50,"width":50,"id":"studio3"}];

function init(){
  //Container for map and map information
  var svgContainer=d3.select("body").append("svg")
    .attr("width", 640)
    .attr("height",500)
    .attr("id", "container")
    .style("border","1px solid black");
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
    .style("color","blue")
    .style("opacity",0.5)
    .style("cursor","pointer")
    .on("mouseover",function(d){
      d3.select(this).transition().style("opacity", 1);
    })
    .on("mouseout",function(){
      d3.select(this).transition().style("opacity", 0.5);
    });

  //Add map and add to svgContainer
  var level1= d3.xml("level1h500.svg", "image/svg+xml", function(error, xml) {
    svgContainer.node().appendChild(document.importNode(xml.documentElement, true));
    var floor1 = svgContainer.select('svg')
        .attr("x",0)
        .attr("y",0)
        .attr('width', "650")
        .attr('height', "500");
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
//ObjId is the name of the object
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
