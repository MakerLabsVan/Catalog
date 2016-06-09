//Fake map information
var rectangleData = [
  {"rx":0,"ry":0,"height":10, "width":50,"id":"studio1"},
  {"rx":200, "ry":200,"height":50,"width":50,"id":"studio2"},
  {"rx":400, "ry":400,"height":50,"width":50,"id":"studio3"}];

//html object that the map is contained in
var container = "#map-well";

//initialize map
function init(width, height){
  //Container for map and map information
  var svgContainer=d3.select(container).append("svg")
    .attr("width", width)
    .attr("height",height)
    .attr("id", "svgMapContainer")
    .style("border","1px solid black");
    //Rectangles represent studio spaces
  var rectangles = svgContainer.selectAll("rect")
    .data(rectangleData)
    .enter()
    .append("rect")
    .attr("x", function (d) { return d.rx; }) //TODO: Map coordinates such that it scaling does not affect it
    .attr("y", function (d) { return d.ry; })
    .attr("height", function (d) { return d.height; })//TODO: Map height and width when container scales
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
  var level1= d3.xml("../d3_files/level1h500.svg", "image/svg+xml", function(error, xml) {
    svgContainer.node().appendChild(document.importNode(xml.documentElement, true));
    var floor1 = svgContainer.select('svg')
        .attr("x",0)
        .attr("y",0)
        .attr('width', "100%")
        .attr('height', "100%")//TODO:Fix scaling, currently it doesn't fit to container
        .attr("preserveAspectRatio", "xMinYMin meet");

    });
};

function showFloor1(){
  d3.select(container).selectAll("svg")
    .attr("visibility","visible");
}

function hideFloor1(){
  d3.select(container).selectAll("svg")
    .attr("visibility","hidden");
}
//ObjId is the name of the object
function highlightItem(objId){
  d3.select(container).select("rect#" + objId)
  .attr('fill',"red")
  .style("opacity",1);
}

function dehighlightItem(objId){
  d3.select(container).select("rect#" + objId)
  .attr('fill',"none")
  .style("opacity",0.5);
}
