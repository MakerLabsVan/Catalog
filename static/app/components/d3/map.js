var mapConstructor = function (containerID, floorNum, studioData) {

  this.floorNum = floorNum,

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

  this.map = addImgMap(this.container,"/assets/ISO.png" ),

  this.studio = new studio(floorNum)
}

var studio = function(floorNum) {
  //Draws all the studios in studioData
  this.data = [],
  
  this.list = d3.select('svg#floor' + floorNum)
    .append('g')
    .attr('class','studioF' + floorNum),

  this.draw = function (studioData) {
    this.data = this.data.concat(studioData);
    this.list
      .append('g')
      .attr('id', studioData[0].id)
      .attr('class','studio')
      .selectAll('rect')
      .data(studioData)
      .enter()
      .append('rect')
      .attr('x y height width', function (d) {
        return inToPx([d.ry, d.ry, d.height, d.width]);
      })
  },

  this.resize = function (width, height) {
    var scale = getScalingRatio(width, height, floorNum);
    var scale = scale / 12;
    //var scale = getIsoScalingRatio(width);
    if (scale !== 0 && !isNaN(scale)) {
      //Magical numbers, just testing
      //this.list.attr('transform','translate(266, 345) scale('+scale+','+scale*0.6+') rotate(-135, 0, 0) ')
      this.list.attr('transform','scale('+scale+')')
    }
  },

  this.remove = function (objID) {
    d3.select('#' + objID)
      .style('visibility', 'hidden');
  },

  this.set = function (objID, xPos, yPos) {
    d3.select('#' + objID)
      .attr('x', xPos)
      .attr('y', yPos)
      .style('visibility', null);
  },

  this.highlight = function (objID) {
    d3.select('#' + objID)
      .attr('fill', 'red')
      .style('visibility', null);
  },

  this.dehighlight = function (objID) {
    d3.select('#' + objID)
      .attr('fill', null)
  }
}



var addImgMap = function (container, filePath) {
  container.append("svg:image")
    .attr("xlink:href",filePath)
    .attr('width',"100vh")
    .attr('height','100vw')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('class','isoFloor1')

};

var getScalingRatio = function (width, height, floorNum) {
  if (floorNum === 2) {
    var aspect = 0.85035;//W=925.374,H=1088.246 px
  } else {
    var aspect = 1.25385;//W=1364.490,H=1088.2464 px
  }

  if (width / height >= aspect) {
    return height / 1088.246;
  }
  else if (width / height < aspect) {
    if (floorNum === 2) {
      return width / 925.374;
    } else {
      return width / 1364.490;
    }
  }
}

var inToPx = function (x) {
  return x * 96;
}

var pxToIn = function (x) {
  return x / 96;
}
