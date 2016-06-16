var rectangleData = [
  {"rx":0,"ry":20,"height":5, "width":10,"id":"studio1"},
  {"rx":20, "ry":70,"height":5,"width":15,"id":"studio2"},
  {"rx":69, "ry":69,"height":5,"width":5,"id":"studio3"}];
//var containerID="firstFloorWell";
//var floorNum=1;
//initialize map
function drawMap(containerID,floorNum){
  var width = document.getElementById(containerID).scrollWidth - 50;
  var height = document.getElementById(containerID).scrollHeight - 50;

  //Default floor 1 unless specified
  if (floorNum === 2) {
    var aspect = 0.85035;//W=1364.490,H=1088.246
    var floorFile = "../d3_files/level2.svg"
  }
  else {
    var aspect = 1.25385;//W=1364.490,H=1088.2464
    var floorFile = "../d3_files/level1.svg"
  }
  //hard coded object scaling
  if (width/height > aspect){
    var scale=height/1088.246;
  }
  else {
    var scale = width / 1364.490;
  }
    var svgContainer = addContainer(containerID, width, height);
    var map = addMap(svgContainer, floorFile);
    var marker = addMarker(svgContainer, 50, 50);
    var studio = addStudio(svgContainer, rectangleData, scale);
    markerOnClick(svgContainer, marker);
};

function markerOnClick(container, marker){
  container.on("click", function (){
    var xPos = d3.mouse(this)[0]-marker.attr('width')/2
    var yPos = d3.mouse(this)[1]-marker.attr('height')*1
    marker.attr("x",xPos).attr("y",yPos);
    marker.style("visibility", "visible");
  })
}
function addContainer(containerID, width, height){
  return d3.select("#"+containerID).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "svgMapContainer")
}

function addMap(container, filePath){
  d3.xml(filePath, "image/svg+xml", function(xml) {
    container.node().appendChild(document.importNode(xml.documentElement, true));
    container.select('svg')
        .attr("x",0)
        .attr("y",0)
        .attr('height', container.attr("height"))
        .attr('width', container.attr("width"))
        .attr("preserveAspectRatio", "xMinYMin meet");
  });
}

function setPosition(object, x, y){
  object
  .attr('x',x)
  .attr('y',x)
}

function returnPosition(object){
  return [object.attr('x'),object.attr('y')];
}

function addMarker(container, x, y){
  return container
    .append("svg:image")
    .attr("xlink:href", "../d3_files/marker.svg")
    .style("visibility","hidden")
    .attr("id","marker")
    .attr("width",50)
    .attr("height",50)
    .attr("x",x)
    .attr("y",y);
}

function dragStudio(){}
function removeStudio(){}
function addStudio(svgContainer,studioData,scale){
  var rectangles = svgContainer.selectAll("rect")
    .data(studioData)
    .enter()
    .append("rect")
    //Dimensions and location of map needs to be scale and placed properly
    .attr("x", function (d) { return (d.rx/10)*scale+"in"; })
    .attr("y", function (d) { return (d.ry/10)*scale+"in"; })
    .attr("height", function (d) { return (d.height/10)*scale+"in"; })
    .attr("width", function (d) { return (d.width/10)*scale+"in"; })
    .attr('id',function (d) { return d.id; })
    .style("fill","blue")
    .style("opacity",0.5)
    .style("cursor","pointer")
    .on("mouseover",function(d){
      d3.select(this).transition().style("opacity", 1);
    })
    .on("mouseout",function(){
      d3.select(this).transition().style("opacity", 0.5);
    });
}
//ObjId is the name of the object
function highlightStudio(objId) {
  d3.select("rect#" + objId)
    .attr('fill', "red")
    .style("opacity", 1);
}
function dehighlightStudio(objId) {
  d3.select("rect#" + objId)
    .attr('fill', "none")
    .style("opacity", 0.5);
}
