var rectangleData = [
  {'rx':0,'ry':20,'height':5, 'width':10,'id':'studio1'},
  {'rx':20, 'ry':70,'height':5,'width':15,'id':'studio2'},
  {'rx':69, 'ry':69,'height':5,'width':5,'id':'studio3'}];

var round5 = function( x )
{
    return Math.ceil(x/5)*5;
};

var getScalingRatio= function( width, height, floorNum){
  switch(floorNum) {
    case 1:
        var aspect = 1.25385;//W=1364.490,H=1088.2464
    case 2:
        var aspect = 0.85035;//W=1364.490,H=1088.246
    default:
        var aspect = 1.25385;//W=1364.490,H=1088.2464
  };

  if (width/height > aspect){
    return height/1088.246;
  }
  else {
    return width / 1364.490;
  };
};

//Get file path for the floor level
//Params floor number
//Output file path of the map assets, default to floor 1 if no argument
var getFilePath = function (floorNum){
  switch(floorNum) {
    case 1:
        return '/assets/level1.svg';
    case 2:
        return '/assets/level2.svg';
    default:
        return '/assets/level1.svg';
  }
};

var mapConstructor = function( containerID, floorNum ,studioData){
  this.floorNum = floorNum,
  //Container object which contains all map objects
  this.container = d3.select('#'+containerID).append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('id', 'floor' + floorNum),
  //Returns width of the map container
  this.width = function(){
    return this.container.node().getBoundingClientRect().width;
  },
  //Returns height of the map container
  this.height = function(){
    return this.container.node().getBoundingClientRect().height;
  },
  //Draws the map given filepath of the map svg
  this.map = addMap( this.container, getFilePath(floorNum)),

  //Marker inside map
  this.marker = {
      //Adds marker
      icon: icon = addMarker(this.container,floorNum),
      //Removes the marker from the map
      remove : function(){
        icon
          .style('visibility','hidden');
      },

      //Change the position and become visible
      set : function( xPos, yPos ){
        icon
          .attr('x', xPos)
          .attr('y',yPos)
          .style('visibility',null);
      },

      //On Click of the map, the marker will display
      onClick : function(){
        var mark =d3.select('#marker' + floorNum);
        d3.select('svg#floor' + floorNum).on('click', function (){
          var xPos = round5(d3.mouse(this)[0]-mark.attr('width')/2);
          var yPos = round5(d3.mouse(this)[1]-mark.attr('height')*1);
          mark.attr('x',xPos).attr('y',yPos);
          mark.style('visibility',null);
      })},

      //Removes onclick event listener
      disableOnClick : function(){
        d3.select('svg#floor' + floorNum).on('click', null);
      },

      //Returns the current location of the marker in px as an array
      //Output: [x,y] (px)
      getLocation : function(){
        xPos=parseInt(icon.attr('x'))+parseInt(icon.attr('width')/2);
        yPos=parseInt(icon.attr('y'))+parseInt(icon.attr('height')/2);
        return [xPos,yPos];
      }
  }

  this.studio = {
    //Draws all the studios in studioData
    data : data = [],
    list: list = d3.select('svg#floor' + floorNum).selectAll('rect'),
    draw : function ( studioData ){
     this.data = this.data.concat(studioData);
     this.list = this.list.remove();
     this.list = d3.select('svg#floor' + floorNum).selectAll('rect')
      .data( this.data )
      .enter()
      .append('rect')
      .attr('x', function (d) { return d.rx/10 +'in'; })
      .attr('y', function (d) { return d.ry/10 +'in'; })
      .attr('height', function (d) { return d.height/10 +'in'; })
      .attr('width', function (d) { return d.width/10 +'in'; })
      .attr('id',function (d) { return d.id; })
    },

    resize : function( scale ){
      //var scale = getScalingRatio(this.this.width(),this.this.height(),floorNum)
      this.list
        .attr('width',function(d){ return d.width*scale +'in'})
        .attr('height',function(d){ return d.height*scale+'in' })
        .attr('x',function(d){ return d.rx*scale+'in' })
        .attr('y',function(d){ return d.ry*scale+'in'})
    },

    remove : function( objID ){
      d3.select( 'rect#' + objID )
        .style('visibility','hidden');
    },

    set : function( objID, xPos, yPos ){
      d3.select( 'rect#' + objID )
        .attr('x', xPos)
        .attr('y',yPos)
        .style('visibility',null);
    },

    highlight : function( objID ){
      d3.select('rect#' + objId)
        .attr('fill', 'red');
    },

    dehighlight : function ( objID ){
      d3.select('rect#' + objId)
        .attr('fill', 'none');
    }
  }
};



function drawMap(containerID,floorNum){
  var width = document.getElementById(containerID).scrollWidth - 50;
  var height = document.getElementById(containerID).scrollHeight - 50;

  //Default floor 1 unless specified
  if (floorNum === 2) {
    var aspect = 0.85035;//W=1364.490,H=1088.246
    var floorFile = '/assets/level2.svg'
  }
  else {
    var aspect = 1.25385;//W=1364.490,H=1088.2464
    var floorFile = '/assets/level1.svg'
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
};

//Functions to create certain svg
function resizeMap(){
  //TODO: Change Container size and studios
};

//Attach onClick to container to display marker at click location
var attachOnClick = function(container, marker){
  container.on('click', function (){
    var xPos = d3.mouse(this)[0]-marker.attr('width')/2;
    var yPos = d3.mouse(this)[1]-marker.attr('height')*1;
    marker.attr('x',xPos).attr('y',yPos);
    marker.style('visibility', 'visible');
  })
};
//Add a container within the container ID with given width and height
var addContainer = function(containerID, width, height){
  return d3.select('#'+containerID).append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
};

//Add the map svg to the container, can not change width height after initialize
var addMap = function(container, filePath){
  d3.xml(filePath, 'image/svg+xml', function(xml) {
    container.node().appendChild(document.importNode(xml.documentElement, true));
    container.select('svg')
        .attr('x',0)
        .attr('y',0)
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('preserveAspectRatio', 'xMinYMin meet');
  });
};

//Add a SVG location marker object initially hidden
var addMarker = function(container,id){
  return container
    .append('svg:image')
    .attr('xlink:href', '/assets/marker.svg')
    .style('visibility','hidden')
    .attr('id','marker'+id)
    .attr('width',50)
    .attr('height',50);
};

//Add a SVG for each studio
var addStudio = function(svgContainer,studioData,scale){
  var rectangles = svgContainer.selectAll('rect')
    .data(studioData)
    .enter()
    .append('rect')
    //Dimensions and location of map needs to be scale and placed properly
    .attr('x', function (d) { return (d.rx/10)*scale+'in'; })
    .attr('y', function (d) { return (d.ry/10)*scale+'in'; })
    .attr('height', function (d) { return (d.height/10)*scale+'in'; })
    .attr('width', function (d) { return (d.width/10)*scale+'in'; })
    .attr('id',function (d) { return d.id; })
    .style('fill','blue')
    .style('opacity',0.5)
    .style('cursor','pointer')
    .on('mouseover',function(d){
      d3.select(this).transition().style('opacity', 1);
    })
    .on('mouseout',function(){
      d3.select(this).transition().style('opacity', 0.5);
    });
};
