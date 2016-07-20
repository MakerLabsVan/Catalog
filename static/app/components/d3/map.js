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
const isoMapFilePath = "/assets/ISO3.png";
const isoMapScale = 7.65; //database value to isometric map conversion
const isoMapWidth = 1320; // Width of isometric map
const scrollMapY = 1000; //Vertical scroll until next map
const firstFloorX = 790;
const firstFloorY = 1915;
const secondFloorX = 630;
const secondFloorY = 710;


// const isoMapFilePath = "/assets/ISO.png";
// const isoMapScale = 5.35; //database value to isometric map conversion
// const isoMapWidth = 920; // Width of isometric map
// const scrollMapY = 650;
// const firstFloorX = 550;
// const firstFloorLocY = 1305;
// const secondFloorX = 460;
// const secondFloorY = 605;

//Dimensions of the old 2D map
const width_L1_2D = 1364.490;
const width_L2_2D = 925.374;
const height_2D = 1088.246;

const floorTransitionDelay = 1000; //1 second

/**

* @param { }
*
**/
var mapConstructor = function (containerID, floorNum) {
  //Current Floor
  this.currentFloor = floorNum,
  //Container for the map svgs and images
  this.container = d3.select('#' + containerID).append('svg')
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
  this.studio = new studio( this.container, this.map),
  //Resize all map objects
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
var studio = function(container, map) {
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
    var scale = 'scale('+isoMapScale*screenScale+','+isoMapScale*screenScale*0.58+') '; //0.58 vertical scale for isometric map
    var rotate = 'rotate(-135, 0, 0) '; //TODO REMOVE MAGIC NUMBER FOR NON ISO

    if ( !isNaN( screenScale) ){
      this.floor[1].attr('transform', translate2 + scale + rotate);
      this.floor[0].attr('transform', translate1 + scale + rotate);
    }
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
var marker = function(container){

  this.group = [ addMarker( container, 0).classed('hide',true) ],

  // Draw all markers in the metadata
  // @param {markerData} json which contains points and floor
  this.draw = function( markerData ){
    var markerNum = markerData.points.length;
    var currentMarkerNum = this.group.length;

    if ( currentMarkerNum > markerNum ){
      var i = 0;
      while ( currentMarkerNum < markerNum ){
        this.group = this.group.concat( addMarker( container, currentMarkerNum + i) );
      }
    }
    for ( i in markerData.points ){
      this.group[i]
        .classed('hide',false)
        .attr('x', marker.points[i][0] )
        .attr('y', marker.points[i][1] )
    }

  },

  this.remove = function(){
    for (i in this.group){
      this.group[i].classed( 'hide', true);
    }
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

//
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

//Only useful with the 2d maps
var getScalingRatio = function (width, height, floorNum) {
  // var mapWidth2 = 925.374;
  // var mapWidth1 = 1364.490;
  // var mapHeight = 1088.246;
  if (floorNum == 2) {
    var aspect = width_L2_2D/height_2D;//W=925.374,H=1088.246 px
  } else {
    var aspect = width_L1_2D /height_2D;//W=1364.490,H=1088.2464 px
  }

  if (width / height >= aspect) {
    return height / height_2D;
  }
  else if (width / height < aspect) {
    if (floorNum == 2) {
      return width / width_L2_2D;
    } else {
      return width / width_L1_2D;
    }
  }
}
