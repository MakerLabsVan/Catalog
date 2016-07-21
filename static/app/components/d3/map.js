const isoVertScale = 0.58;
const isoAngle = -135;
//TODO:Make this an object
const ISO = {
  'isIsometric' : true,
  'filePath' : "/assets/ISO.png",
  'mapScaling' : 5.35,
  'mapWidth' : 920,
  'scrollMapY' : 650,
  'firstFloorX' : 550,
  'firstFloorY' : 650,
  'secondFloorX' : 460,
  'secondFloorY' : 605,
}

//ISOMETRIC MAP
const isIsometric = true;
const isoMapFilePath = "/assets/ISO3.png";
const isoMapScale = 7.65; //database value to isometric map conversion
const isoMapWidth = 1320; // Width of isometric map
const scrollMapY = 1050; //Vertical scroll until next map
const firstFloorX = 800;
const firstFloorY = 1910;
const secondFloorX = 630;
const secondFloorY = 710;

//2D MAP
// const isIsometric = false;
// const isoMapFilePath = "/assets/2DFloorPlan.png";
// const isoMapScale = 7.5; //database value to isometric map conversion
// const isoMapWidth = 1500; // Width of isometric map
// const scrollMapY = 1100; //Vertical scroll until next map
// const firstFloorX = 215;
// const firstFloorY = 1200;
// const secondFloorX = 560;
// const secondFloorY = 90;

const floorTransitionDelay = 1000; //1 second

/**

* @param { }
*
**/
var mapConstructor = function (containerID, floorNum) {
  //Current Floor
  this.currentFloor = floorNum,
  //Container for the map svgs and images
  this.container = d3.select('#' + containerID)
    .append('svg')
    .attr('id', 'floor' + floorNum)
    .attr('class', 'mapContainer'),

  //Returns width of the map container
  this.width = function () {
      return this.container.node().getBoundingClientRect().width;
  },
  //Returns height of the map container
  this.height = function () {
      return this.container.node().getBoundingClientRect().height;
  },
  //The map img
  this.map = addImgMap( this.container, isoMapFilePath ),
  //initialize studios svgs
  this.studio = new studio( this.container, this.map, isIsometric),
  //Resize all map objects
  this.markers = new marker( this.container),

  this.resize = function (){
    this.studio.resize( this.width());
    this.studio.selectFloor( this.width(),this.currentFloor);
  },
  //Move to floor
  this.selectFloor = function( floor ){
    this.currentFloor = floor;
    this.studio.selectFloor( this.width(),floor);
  }
}

/**

* @param { }
*
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
  this.draw = function ( studioData ) {
    this.floor[ Number(studioData.floor) - 1 ]
      .append('g')
      .attr('id', studioData.id)
      .classed('studio',true)
      .selectAll('polygon')
      .data( studioData.points)
      .enter()
      .append('polygon')
      .attr("points",function(d) {
        return d.polygon.map( function(d) { return [(d.x),(d.y)].join(","); }).join(" ");
      })
  },

  //Resize studios to proper sizing
  this.resize = function ( width) {
    var screenScale = getImgFactor( width);

    //Isometric map transformations
    var translate1 = 'translate('+firstFloorX*screenScale+','+ firstFloorY*screenScale+') '; // first floor
    var translate2 = 'translate('+secondFloorX*screenScale+','+ secondFloorY*screenScale+') '; // second floor
    var scale = 'scale('+isoMapScale*screenScale+','+isoMapScale*screenScale+') '; //0.58 vertical scale for isometric map
    var rotate = 'rotate('+isoAngle+', 0, 0) ';

    var transform1 = translate1;
    var transform2 = translate2;
    if ( isIsometric == true ){
      scale = 'scale('+isoMapScale*screenScale+','+isoMapScale*screenScale*isoVertScale+') ';
      transform1 += (scale + rotate);
      transform2 += (scale + rotate);
    } else{
      transform1 += scale;
      transform2 += scale;
    }

    this.floor[1].attr('transform', transform2);
    this.floor[0].attr('transform', transform1);
  },

  this.selectFloor = function ( width, floorNum){
    var screenScale = getImgFactor(width);
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
  }
}

/**

* @param { }
*
**/
var marker = function( container ){

  this.markerCuster = [],

  // Draw all markers in the metadata
  // @param {markerData} json which contains points and floor
  this.draw = function( markerData ){
    var markerNum = markerData.points.length;
    var currentMarkerNum = this.markerCuster.length;

    if ( currentMarkerNum < markerNum ){
      for ( var j = 0; currentMarkerNum+j < markerNum; j++){
        this.markerCuster.push( addMarker( container, currentMarkerNum + j) );
      }
    }
    for ( k in markerData.points ){
      this.markerCuster[k]
        .classed('hide',false)
        .attr('x', markerData.points[k].x )
        .attr('y', markerData.points[k].y )
    }
  },

  this.remove = function(){
    for (i in this.markerCuster){
      this.markerCuster[i].classed( 'hide', true);
    }
  },

  this.resize = function(){
    this.markerCuster

  }
}

// this.marker = {
//   //Adds marker
//   icon: icon = addMarker(this.container, floorNum),
//   //Removes the marker from the map
//   remove: function () {
//     d3.select('#marker' + floorNum)
//       .style('visibility', 'hidden')
//   },
//
//   //Change the position and become visible
//   set: function (xPos, yPos, width, height) {
//     var scale = getScalingRatio(width, height, floorNum)/10;
//     var xPx = inToPx(xPos * scale) - parseInt(this.icon.attr('width')) / 2;
//     var yPx = inToPx(yPos * scale) - parseInt(this.icon.attr('height')) * 1;
//     this.icon.moveToFront();
//     this.icon
//       .attr('x', xPx + 'px')
//       .attr('y', yPx + 'px')
//       .style('visibility', null)
//   },
//
//   //On Click of the map, the marker will display and returns coordinates
//   onClick: function () {
//     var marker = d3.select('#marker' + floorNum);
//     var container = d3.select('svg#floor' + floorNum);
//     var map = d3.select('svg#floor' + floorNum);
//     attachOnClick(map, marker);
//   },
//
//   //Removes onclick event listener
//   disableOnClick: function () {
//     d3.select('svg#floor' + floorNum).on('click', null);
//   },
//
//   //Returns the current location of the marker in px as an array
//   //Output: [x,y] (ft)
//
//   getLocation: function (width, height, floorNum) {
//     var mark = d3.select('#marker' + floorNum);
//     var xPos = parseInt(mark.attr('x')) + parseInt(mark.attr('width') / 2);
//     var yPos = parseInt(mark.attr('y')) + parseInt(mark.attr('height') * 1);
//
//     var scale = getScalingRatio(width, height, floorNum) / 10;
//     var xFt = pxToIn(xPos / scale);
//     var yFt = pxToIn(yPos / scale);
//
//     return [xFt, yFt];
//   }
// }



//Add map image
var addImgMap = function (container, filePath) {
  return container.append("svg:image")
    .attr("xlink:href", filePath)
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('class','isoMap')
};

var getImgFactor = function (currentWidth){
  return currentWidth/isoMapWidth;
}

var addMarker = function (container, id) {
  return container
    .append('svg:image')
    .attr('xlink:href', '/assets/marker.svg')
    .attr('id', 'marker' + id)
    .classed('marker',true);

    // .style('visibility', 'hidden')
    // .attr('width', 30)
    // .attr('height', 30);
};
