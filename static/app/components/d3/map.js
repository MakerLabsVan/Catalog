const mapScale = 5.35;

var mapConstructor = function (containerID, floorNum, studioData) {
  //Current Floor
  this.floorNum = floorNum,
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
  this.studio = new studio(this.container, this.map)
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


  this.resize = function (width, height) {
    var screenScale = getImgFactor(width);

    var translate1 = 'translate('+550*screenScale+','+ 1305*screenScale+') '; //460 and 605 based on point in img map
    var translate2 = 'translate('+460*screenScale+','+ 605*screenScale+') '; //460 and 605 based on point in img map
    var scale = 'scale('+mapScale*screenScale+','+mapScale*screenScale*0.58+') ';
    var rotate = 'rotate(-135, 0, 0) ';


    //var scale = getIsoScalingRatio(width);
    // var scale =1;
    if (!isNaN(screenScale)){
      //Magical numbers, just testing
      //THIS WORKS AT 605PX WIDTH OF MAP / 920PX MAX WIDTH
      this.floor[1].attr('transform', translate2 + scale + rotate)
        .transition()
        .delay(750);
      this.floor[0].attr('transform', translate1 + scale + rotate)
        .transition()
        .delay(750);

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


    this.building.attr('transform', setFloor);
    map.attr('transform', setFloor);
  }

  this.remove = function (objID) {
    d3.select('#' + objID)
      .style('visibility', 'hidden');
  },

  this.highlight = function (objID) {
    d3.select('#' + objID)
      .classed('studioHighlight',true)

  },

  this.dehighlight = function (objID) {
    d3.select('#' + objID)
      .classed('studioHighlight',false)
  }
}

//Add map image
var addImgMap = function (container, filePath) {
  return container.append("svg:image")
    .attr("xlink:href",filePath)
    .attr('width',"100%")
    .attr('height','200%')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('class','map')

};

var getImgFactor = function (currentWidth){
  const isoMapWidth = 920;//920 px original map width
  return currentWidth/isoMapWidth;
}

//Only useful with the 2d maps
var getScalingRatio = function (width, height, floorNum) {
  var mapWidth2 = 925.374;
  var mapWidth1 = 1364.490;
  var mapHeight = 1088.246;
  if (floorNum == 2) {
    var aspect = mapWidth2/mapHeight;//W=925.374,H=1088.246 px
  } else {
    var aspect = mapWidth1/mapHeight;//W=1364.490,H=1088.2464 px
  }

  if (width / height >= aspect) {
    return height / mapHeight;
  }
  else if (width / height < aspect) {
    if (floorNum == 2) {
      return width / mapWidth2;
    } else {
      return width / mapWidth1;
    }
  }
}

var inToPx = function (x) {
  return x * 96;
}

var pxToIn = function (x) {
  return x / 96;
}
