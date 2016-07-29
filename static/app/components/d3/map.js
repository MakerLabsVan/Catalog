//ISO MAP VARIABLES, rotation and scaling of Y
const isoVertScale = 0.58;
const isoAngle = -135;

const floorTransitionDelay = 1000; //1 second

//TODO:Parse as JSON data

// //ISOMETRIC MAP
// const isIsometric = true; //Draws 2d map if false
// const mapFilePath = "/assets/ISO3.png";
// const isoMapScale = 7.65; //database value to isometric map conversion
// const isoMapWidth = 1320; // Width of isometric map, used to dynamically resize map
// const scrollMapY = 1050; //Vertical scroll until next floor
// const firstFloorX = 795; //Translate studios into place
// const firstFloorY = 1915;
// const secondFloorX = 630;
// const secondFloorY = 710;

// //ISOMETRIC MAP
const isIsometric = true; //Draws 2d map if false
const mapFilePath = "/assets/ISO4.png";
const isoMapScale = 8.5; //database value to isometric map conversion
const isoMapWidth = 1464; // Width of isometric map, used to dynamically resize map
const scrollMapY = 1375; //Vertical scroll until next floor
const firstFloorX = 880; //Translate studios into place
const firstFloorY = 2370;
const secondFloorX = 710;
const secondFloorY = 790;

// 2D MAP
// const isIsometric = false;
// const mapFilePath = "/assets/2DFloorPlan.png";
// const isoMapScale = 7.5;
// const isoMapWidth = 1500;
// const scrollMapY = 1100;
// const firstFloorX = 215;
// const firstFloorY = 1200;
// const secondFloorX = 560;
// const secondFloorY = 90;

/**
* Makes an map object that provides methods to change the entire map view
* @param {string} contaienr ID of the element you wish to attach map to (required)
* @param {number} initial floorNum to view
*
**/
var mapConstructor = function (containerID, floorNum) {
  //Current Floor
  this.currentFloor = floorNum,
  //Container for the map svgs and images
  this.viewport = d3.select('#' + containerID)
    .append('svg')
    .attr('id', 'mapContainer' + containerID)
    .attr('class', 'mapContainer'),
  //The map img
  this.map = this.viewport
    .append("svg:image")
    .attr("xlink:href", mapFilePath)
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('class','isoMap'),

  // addImgMap( this.viewport, mapFilePath ),
  //Returns width of the map container
  this.width = function () {
      return this.viewport.node().getBoundingClientRect().width;
  },
  //Returns height of the map container
  this.height = function () {
      return this.viewport.node().getBoundingClientRect().height;
  },

  //initialize studios svgs
  this.studio = new studio( this.viewport, this.map, isIsometric ),
  //Resize all map objects
  this.markers = new marker( this.studio.building ),

  this.resize = function (){
    this.studio.resize( this.width());
    this.studio.selectFloor( this.width(), this.currentFloor);
  },
  //Move to floor
  this.selectFloor = function( floor ){
    this.currentFloor = floor;
    this.studio.selectFloor( this.width(), floor);
  },
  this.swipe = function(){
    d3.select(this.container)
    .on("drag", function(){
      alert('it works!');
    });
    console.log(d3.select(this.container));
  }
}

function touchstarted() {
  alert('start');
}

function touchended() {
  alert('end');
}

function touchmoved() {
  alert('move');
}

/**
* This object controls all the interactions of the studio objects
*  @param {selection} The viewport of the map (required)
*  @param {selection} The map selection object (required)
*  @param {boolean} if isIsometric is true draws everything on the isometric plane
**/
var studio = function(container, map, isIsometric) {
  //Building contains all studio information
  this.building = container
    .append('g')
    .classed('studioGroup',true),

  //The floor is an array of g elements for each floor in the bulding
  this.floor =[
    this.building
      .append('g')
      .classed('floor1',true),
    this.building
      .append('g')
      .classed('floor2',true)
  ],

  //Params: StudioData object that contains studio location and id
  this.draw = function ( studioData , id ) {
    this.floor[ Number(studioData.floor) - 1 ]
      .append('g')
      .attr('id', id)
      .classed('studio',true)
      .selectAll('polygon')
      .data( studioData.points)
      .enter()
      .append('polygon')
      .attr("points",function(d) {
        return d.polygon.map( function(d) { return [(d.x),(d.y)].join(","); }).join(" ");
      })
  },

  this.resize = function ( mapWidth) {
    for ( var i = 0; i < this.floor.length; i++){
      transform = mapTransformStrings( mapWidth, i+1, isIsometric); //Floor number is i+1
      this.floor[i].attr('transform', transform);
    }
  },

  this.selectFloor = function ( width, floorNum){
    var screenScale = getScreenFactor(width);
    switch(floorNum) {
    case 1:
      var setFloor = 'translate(0,'+ -scrollMapY*screenScale+') ';
      break;
    case 2:
        var setFloor = 'translate(0,0) ';
        break;
    default:
      var setFloor = 'translate(0,'+ -scrollMapY*screenScale+') ';
      break;
    }

    this.building.transition().attr('transform', setFloor).duration(floorTransitionDelay);
    map.transition().attr('transform', setFloor).duration(floorTransitionDelay);
  }

  //Highlight studio
  this.highlight = function ( objID) {
    this.building.select('#' + objID)
      .classed('studioHighlight',true)
  },

  //Dehighlight studio
  this.dehighlight = function ( objID) {
    this.building.select('#' + objID)
      .classed('studioHighlight',false)
  },

  //on studio click, pass the studio's ID to callback function
  this.onClick = function ( callback ){
    d3.selectAll('.studio').on('click', function(){
      callback( d3.select(this).attr('id') )  ;
    })
  }
}

/**
* This object controls all the interactions of the marker objects
* @param {selection} The container that we want to draw markers on
*
**/
var marker = function( container ){

  this.markerCluster = [],
  // Draw all markers in the metadata
  // @param {markerData} json which contains points and floor
  this.draw = function( width, markerData ){
    var markerNum = markerData.points.length;
    var currentMarkerNum = this.markerCluster.length;

    //Render new markers when there isnt enough
    if ( currentMarkerNum < markerNum ){
      for ( var j = 0; currentMarkerNum+j < markerNum; j++){
        this.markerCluster.push( addMarker( container, currentMarkerNum + j));
      }
    }
    for ( k in markerData.points ){
      var coords = mapTransformCoords(width, markerData.points[k], isIsometric, markerData.floor )

      //Adjust for marker size
      coords.x -= Number(this.markerCluster[k].attr('width'))/2;
      coords.y -= Number(this.markerCluster[k].attr('height'));

      this.markerCluster[k]
        .classed('hide',false)
        .classed('floor' + markerData.floor,true)
        .attr('x', coords.x)
        .attr('y', coords.y)
    }
  },

  this.hide = function(){
    for (i in this.markerCluster){
      this.markerCluster[i].classed( 'hide', true);
    }
  },

  this.deleteAll = function(){
    for ( i in this.markerCluster){
      this.markerCluster.pop().remove();
    }
  },

  this.onClick = function(){
    showMarkerOnClick( this.markerCluster, container);
  },

  this.getLocation = function( width, floor){
    var arrayOfPoints = [];

    for (i in this.markerCluster){
      var points = {
        'x': this.markerCluster[i].attr('x'),
        'y':this.markerCluster[i].attr('y')
      }
      arrayOfPoints.push( undoMapTrasnformCoords(width, points, isIsometric, floor));
    }
    console.log(arrayOfPoints);
    return arrayOfPoints;
  }
}






var showMarkerOnClick = function( markerCluster){
  d3.select('.isoMap').on('click', function () {
    var xPos = d3.mouse(d3.select('.studioGroup').node())[0];
    var yPos = d3.mouse(d3.select('.studioGroup').node())[1];

    var marker = addMarker( d3.select('.studioGroup'));

    marker
      .attr('x', xPos - Number(marker.attr('width')/2) )
      .attr('y', yPos - Number(marker.attr('height')) );

    markerCluster.push(marker);
  })
}

//For Transforming groups of studios
var mapTransformStrings = function ( width, floor, isIso){
  if ( isNaN( width) ){
    return;
  }
  var screenScale = getScreenFactor( width);

  if ( floor === 2 ){
    var translate = 'translate('+secondFloorX*screenScale+','+ secondFloorY*screenScale+') '; // second floor
  } else {
    var translate = 'translate('+firstFloorX*screenScale+','+ firstFloorY*screenScale+') '; // first floor
  }

  if ( isIso == true){
    var scale = 'scale('+isoMapScale*screenScale+','+isoMapScale*screenScale*isoVertScale+') ';
    var rotate = 'rotate('+isoAngle+', 0, 0) ';
    return translate + scale + rotate;
  } else {
    var scale = 'scale('+isoMapScale*screenScale+','+isoMapScale*screenScale+') '; //0.58 vertical scale for isometric map
    return translate + scale;
  }
}

// Undo mapTransformCoords function
var undoMapTrasnformCoords = function( width, oldCoords, isIso,floor){
  var screenScale = getScreenFactor( width);
  var cosA = Math.cos( isoAngle * Math.PI / 180);
  var sinA = Math.sin( isoAngle * Math.PI / 180);

  var transformX = oldCoords.x/screenScale;
  var transformY = oldCoords.y/screenScale;


  if ( floor === 2){
    transformX -= secondFloorX;
    transformY -= secondFloorY;
  }else{
    transformX -= firstFloorX;
    transformY -= firstFloorY;
  }

  //scaling
  transformX /=isoMapScale;
  if ( isIso == true){
    transformY /=(isoMapScale * isoVertScale);
  }else{
    transformY /= isoMapScale;
  }

  if (isIso == true){
    var coords = {
      'x': transformX*cosA + transformY*sinA,
      'y': -transformX*sinA + transformY*cosA
    };
  } else{
    var coords = {
      'x': transformX,
      'y': transformY
    };
  }

  return coords;
}

//Mapping points to map
var mapTransformCoords = function( width, oldCoords, isIso, floor){
  var screenScale = getScreenFactor( width);
  var cosA = Math.cos( isoAngle * Math.PI / 180);
  var sinA = Math.sin( isoAngle * Math.PI / 180);

  //Rotation of coordinates
  if ( isIso == true){
    var transformX = oldCoords.x*cosA - oldCoords.y*sinA;
    var transformY = oldCoords.x*sinA + oldCoords.y*cosA;
  } else{
    var transformX = oldCoords.x;
    var transformY = oldCoords.y;
  }

  //scaling
  transformX *=isoMapScale;
  if ( isIso == true){
    transformY *=(isoMapScale * isoVertScale);
  }else{
    transformY *= isoMapScale;
  }
  //Translate back into floor plane
  if ( floor == 2){
    transformX += secondFloorX;
    transformY += secondFloorY;
  }else{
    transformX += firstFloorX;
    transformY += firstFloorY;
  }

  //screensize scale
  transformX*=screenScale;
  transformY*=screenScale;

  var coords = {
    'x': transformX,
    'y': transformY
  };

  return coords;
}

// Returns the ratio between the current width of viewport and map viewport width
var getScreenFactor = function (currentWidth){
  return currentWidth/isoMapWidth;
}

var addMarker = function (container) {
  return container
    .append('svg:image')
    .attr('xlink:href', '/assets/marker.svg')
    .attr('width', 50)
    .attr('height', 50 )
    .classed('marker',true);
};
