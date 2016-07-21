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
  this.markers = new marker( this.studio.building ),

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

  //TODO: Move math into a seperate function that returns transform strings
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

  this.markerCluster = [],
  // Draw all markers in the metadata
  // @param {markerData} json which contains points and floor
  this.draw = function( width, markerData ){
    var markerNum = markerData.points.length;
    var currentMarkerNum = this.markerCluster.length;

    var screenScale = getImgFactor( width);

    if ( currentMarkerNum < markerNum ){
      for ( var j = 0; currentMarkerNum+j < markerNum; j++){

        this.markerCluster.push( addMarker( container, currentMarkerNum + j));
      }
    }
    for ( k in markerData.points ){
      //TODO: Move math to seperate function
      var cosA = Math.cos( isoAngle * Math.PI / 180);
      var sinA = Math.sin( isoAngle * Math.PI / 180);
      //Rotation of coordinates
      var transformX = markerData.points[k].x * cosA - markerData.points[k].y * sinA ;
      var transformY = markerData.points[k].x * sinA + markerData.points[k].y * cosA ;
      //Scaling to map size and isometric
      transformX *= isoMapScale;
      transformY *= (isoVertScale*isoMapScale);
      //Translate back into floor plane
      if ( markerData.floor == 1){
        transformX += firstFloorX;
        transformY += firstFloorY;
      }else if ( markerData.floor == 2){
        transformX += secondFloorX;
        transformY += secondFloorY;
      }
      //Adjust for marker size
      transformX -= Number(this.markerCluster[k].attr('width'))/2;
      transformY -= Number(this.markerCluster[k].attr('height'));

      this.markerCluster[k]
        .classed('hide',false)
        .attr('x', transformX*screenScale)
        .attr('y', transformY*screenScale)
    }
  },

  this.remove = function(){
    for (i in this.markerCluster){
      this.markerCluster[i].classed( 'hide', true);
    }
  },

  this.resize = function(){
    var screenScale = getImgFactor( width);
    //Isometric map transformations

  }
}

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
    .attr('width', 30)
    .attr('height', 30 )
    .classed('marker',true);
};
