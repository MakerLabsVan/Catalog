//Fake map information
var rectangleData = [
  {"rx":0,"ry":20,"height":5, "width":10,"id":"studio1"},
  {"rx":20, "ry":70,"height":5,"width":15,"id":"studio2"},
  {"rx":69, "ry":69,"height":5,"width":5,"id":"studio3"}];

//html object that the map is contained in
var container = "#map-well";

//initialize map
function init(width, height){

  var aspectL1 = 1.25385;//W=1364.490,H=1088.246
  var aspectL2 = 0.85035; // W=925.374,H=1088.238
  if (width/height > aspectL1){var scaleL1=height/1088.246; }
  else {var scaleL1=width/1364.490;}
  //Container for map and map information
  var svgContainer=d3.select(container).append("svg")
    .attr("width", width)
    .attr("height",height)
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

/*
    var tooltip = svgContainer
      .append("text")
      .attr("x", 50)
      .attr("y", 50)
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "red")
      .attr("visibility","hidden");
*/
    var marker = svgContainer
    .append("svg:image")
    .attr("xlink:href", "../d3_files/marker.svg")
    .style("visibility","hidden")
    .attr("id","marker")
    .attr("x",50)
    .attr("y",50)
    .attr("width",50)
    .attr("height",50);


      //Rectangles represent studio spaces
    var rectangles = svgContainer.selectAll("rect")
      .data(rectangleData)
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
