const isoMapScale = 5.35; //database value to isometric map conversion
const isoMapWidth = 920; // Width of isometric map
//Dimensions of the old 2D map
const width_L1_2D = 1364.490;
const width_L2_2D = 925.374;
const height_2D = 1088.246;


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
  this.map = addImgMap(this.container,"/assets/ISO.png" ),
  //initialize studios svgs
  this.studio = new studio(this.container, this.map),

  this.resize = function (){
    this.studio.resize(this.width());
    this.studio.selectFloor(this.currentFloor);
  },
  this.selectFloor = function( floor ){
    this.currentFloor = floor;
    this.studio.selectFloor(floor);

  }
}

var studio = function(container, map) {
  //Building contains all studio information
  this.building = container
    .append('g')
    .attr('id','studioGroup'),

  //The floor is an array of g elements for each floor in the bulding
  this.floor =[
    this.building
      .append('g')
      .attr('id', 'floor1'),
    this.building
      .append('g')
      .attr('id','floor2')
  ],

//Params: StudioData object that contains studio location and id
//May contain multiple
  this.draw = function (studioData) {
    this.floor[Number(studioData[0].floor)-1]
      .append('g')
      .attr('id', studioData[0].id)
      .classed('studio',true)
      .selectAll('rect')
      .data(studioData)
      .enter()
      .append('rect')
      .attr('x', function (d) { return d.rx + 'px'; })
      .attr('y', function (d) { return d.ry + 'px'; })
      .attr('height', function (d) { return d.height + 'px'; })
      .attr('width', function (d) { return d.width + 'px'; })
  },

  //Resize studios to proper sizing
  this.resize = function (width, height) {
    var screenScale = getImgFactor(width);

    //Isometric map transformations
    var translate1 = 'translate('+550*screenScale+','+ 1305*screenScale+') '; //460 and 605 based on point in img map
    var translate2 = 'translate('+460*screenScale+','+ 605*screenScale+') '; //460 and 605 based on point in img map
    var scale = 'scale('+isoMapScale*screenScale+','+isoMapScale*screenScale*0.58+') ';
    var rotate = 'rotate(-135, 0, 0) ';

    if (!isNaN(screenScale)){
      this.floor[1].attr('transform', translate2 + scale + rotate);
      this.floor[0].attr('transform', translate1 + scale + rotate);
    }
  },

  this.selectFloor = function (width, floorNum){
    switch(floorNum) {
    case 1:
      var screenScale = getImgFactor(width);
      var setFloor = 'translate(0,'+ -650*screenScale+') ';
      break;
    case 2:
        var setFloor = 'translate(0,0) ';
        break;
    default:
      var screenScale = getImgFactor(width);
      var setFloor = 'translate(0,'+ -650*screenScale+') ';
      break;
    }

    this.building.transition().attr('transform', setFloor).duration(1000);
    map.transition().attr('transform', setFloor).duration(1000);
  }

  //Highlight studio
  this.highlight = function (objID) {
    this.building.select('#' + objID)
      .classed('studioHighlight',true)
  },

  //Dehighlight studio
  this.dehighlight = function (objID) {
    this.building.select('#' + objID)
      .classed('studioHighlight',false)
  }
}


//Add map image
var addImgMap = function (container, filePath) {
  return container.append("svg:image")
    .attr("xlink:href",filePath)
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('class','map')
};

var getImgFactor = function (currentWidth){
  return currentWidth/isoMapWidth;
}

//Only useful with the 2d maps
var getScalingRatio = function (width, height, floorNum) {
  var mapWidth2 = 925.374;
  var mapWidth1 = 1364.490;
  var mapHeight = 1088.246;
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
