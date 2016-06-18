var rectangleData = [
  {"rx":0,"ry":20,"height":5, "width":10,"id":"studio1"},
  {"rx":20, "ry":70,"height":5,"width":15,"id":"studio2"},
  {"rx":69, "ry":69,"height":5,"width":5,"id":"studio3"}];
//var containerID="firstFloorWell";
//var floorNum=1;
//initialize map

var mapConstructor = function( containerID, floorNum){
  this.floorNum = floorNum,
  //var container = containerID,
  this.container = d3.select("#"+containerID).append("svg")
    .attr("width", "100%")
    .attr("height", "100%"),

  // this.map =  d3.xml("/d3_files/level1.svg", "image/svg+xml", function(xml) {
  //     console.log(d3.select(this.container));
  //     d3.select(this.container).node().appendChild(document.importNode(xml.documentElement, true));
  //     d3.select(this.container).select('svg')
  //         .attr("x",0)
  //         .attr("y",0)
  //         .attr('height', "100%")
  //         .attr('width', "100%")
  //         .attr("preserveAspectRatio", "xMinYMin meet");
  //   }),
  this.map = addMap(this.container,"/d3_files/level1.svg"),

  this.marker = {
      icon: icon = this.container
        .append("svg:image")
        .attr("xlink:href", "../d3_files/marker.svg")
        .style("visibility","hidden")
        .attr("id","marker")
        .attr("width",50)
        .attr("height",50),

      remove : function(){
        icon.style("visibility",'hidden');
      },

      set : function( xPos, yPos ){
        icon
          .attr('x', xPos)
          .attr('y',yPos)
          .style('visibility',null);
      },

      onClick : function(){
        d3.select(this.container).on("click", function (){
          console.log("click!");
          var xPos = d3.mouse(this)[0]-icon.attr('width')/2;
          var yPos = d3.mouse(this)[1]-icon.attr('height')*1;
          icon.attr("x",xPos).attr("y",yPos);
      })}
  }

  // this.studio :{
  //   this.add = function(studioData){
  //
  //   },
  //   this.remove = function(studioID){
  //
  //   },
  //   this.highlight = function(studioID){
  //
  //   },
  //   this.dehighlight = function (studioID){
  //
  //   }
  // },
  // this.item :{}
};

function drawMap(containerID,floorNum){
  var width = document.getElementById(containerID).scrollWidth - 50;
  var height = document.getElementById(containerID).scrollHeight - 50;

  //Default floor 1 unless specified
  if (floorNum === 2) {
    var aspect = 0.85035;//W=1364.490,H=1088.246
    var floorFile = "/d3_files/level2.svg"
  }
  else {
    var aspect = 1.25385;//W=1364.490,H=1088.2464
    var floorFile = "/d3_files/level1.svg"
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
    attachOnClick(svgContainer, marker);
    /*d3.select(svgContainer).on("resize",resizeMap)
    svgContainer.on("resize", function (){
      studio.attr({
    cx: function (d) { return d.x; },
    cy: function (d) { return d.y; },
    r:  function (d) { return d.r; }
      })
    })*/
};
function resizeMap(){
  //TODO: Change Container size and studios
};

//Attach onClick to container to display marker at click location
function attachOnClick(container, marker){
  container.on("click", function (){
    var xPos = d3.mouse(this)[0]-marker.attr('width')/2;
    var yPos = d3.mouse(this)[1]-marker.attr('height')*1;
    marker.attr("x",xPos).attr("y",yPos);
    marker.style("visibility", "visible");
  })
};
//Add a container within the container ID with given width and height
function addContainer(containerID, width, height){
  return d3.select("#"+containerID).append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
};

//Add the map svg to the container, can not change width height after initialize
function addMap(container, filePath){
  d3.xml(filePath, "image/svg+xml", function(xml) {
    container.node().appendChild(document.importNode(xml.documentElement, true));
    container.select('svg')
        .attr("x",0)
        .attr("y",0)
        .attr('height', "100%")
        .attr('width', "100%")
        .attr("preserveAspectRatio", "xMinYMin meet");
  });
};

//Add a SVG location marker object initially hidden
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
};

//Add drag event to any studio on map
function dragStudio(){};

//Add a SVG for each studio
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
};

//Remove any studio from map
function removeStudio(objId){
  d3.select("rect#" + objId).remove();
};

//ObjId is the name of the object
function highlightStudio(objId) {
  d3.select("rect#" + objId)
    .attr('fill', "red")
    .style("opacity", 1);
};
function dehighlightStudio(objId) {
  d3.select("rect#" + objId)
    .attr('fill', "none")
    .style("opacity", 0.5);
};

function setStudioSize(objId, width, height ){
  d3.select("rect#" + objId)
    .attr("width",width)
    .attr("height",height);
};

//Set the position of any object
function setPosition(object, x, y){
  object
  .attr('x',x)
  .attr('y',x);
};

//Return the position of any object as an Array
function returnPosition(object){
  return [object.attr('x'),object.attr('y')];
};
