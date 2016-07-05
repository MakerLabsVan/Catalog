var rectangleData = [
  { 'rx': 0, 'ry': 20, 'height': 5, 'width': 10, 'id': 'studio1' },
  { 'rx': 20, 'ry': 70, 'height': 5, 'width': 15, 'id': 'studio2' },
  { 'rx': 69, 'ry': 69, 'height': 5, 'width': 5, 'id': 'studio3' }];

var mapConstructor = function (containerID, floorNum, studioData) {
  this.floorNum = floorNum,
    //Container object which contains all map objects
    this.container = d3.select('#' + containerID).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('id', 'floor' + floorNum),
    //Returns width of the map container
    this.width = function () {
      return this.container.node().getBoundingClientRect().width;
    },
    //Returns height of the map container
    this.height = function () {
      return this.container.node().getBoundingClientRect().height;
    },
    //Draws the map given filepath of the map svg
    this.map = addMap(this.container, getFilePath(floorNum)),

    //Marker inside map
    this.marker = {
      //Adds marker
      icon: icon = addMarker(this.container, floorNum),
      //Removes the marker from the map
      remove: function () {
        d3.select('#marker' + floorNum)
          .style('visibility', 'hidden')
      },

      //Change the position and become visible
      set: function (xPos, yPos, width, height) {
        var mark = d3.select('#marker' + floorNum);
        var scale = getScalingRatio(width, height, floorNum);
        var scale = scale / 10; //Conversion from real ft to map
        var xPx = inToPx(xPos * scale) - parseInt(mark.attr('width')) / 2;
        var yPx = inToPx(yPos * scale) - parseInt(mark.attr('height')) * 1;
        mark
          .attr('x', xPx + 'px')
          .attr('y', yPx + 'px')
          .style('visibility', null)
      },

      //On Click of the map, the marker will display and returns coordinates
      onClick: function () {
        var marker = d3.select('#marker' + floorNum);
        var container = d3.select('svg#floor' + floorNum);
        var map = d3.select('svg#floor' + floorNum);
        attachOnClick(map, marker);
      },

      //Removes onclick event listener
      disableOnClick: function () {
        d3.select('svg#floor' + floorNum).on('click', null);
      },

      //Returns the current location of the marker in px as an array
      //Output: [x,y] (px)

      getLocation: function (width, height, floorNum) {
        var mark = d3.select('#marker' + floorNum);
        var xPos = parseInt(mark.attr('x')) + parseInt(mark.attr('width') / 2);
        var yPos = parseInt(mark.attr('y')) + parseInt(mark.attr('height') * 1);

        var scale = getScalingRatio(width, height, floorNum) / 10;
        var xFt = pxToIn(xPos / scale);
        var yFt = pxToIn(yPos / scale);

        return [xFt, yFt];
      }
    }

  this.studio = {
    //Draws all the studios in studioData
    data: data = [],

    list: list = d3.select('svg#floor' + floorNum).selectAll('rect'),

    draw: function (studioData) {
      this.data = this.data.concat(studioData);
      //this.list = this.list.remove();
      this.list = this.list
        .data(this.data)
        .enter()
        .append('rect')
        .attr('x', function (d) { return d.rx; })
        .attr('y', function (d) { return d.ry; })
        .attr('height', function (d) { return d.height; })
        .attr('width', function (d) { return d.width; })
        .attr('id', function (d) { return d.id; })
        .style('opacity', 0.5)
        //.style('visibility', 'hidden')
    },

    resize: function (width, height) {
      var scale = getScalingRatio(width, height, floorNum);
      var scale = scale / 10;
      if (scale !== 0 && !isNaN(scale)) {
        this.list
          .attr('width', function (d) { return inToPx(d.width * scale) + 'px' })
          .attr('height', function (d) { return inToPx(d.height * scale) + 'px' })
          .attr('x', function (d) { return inToPx(d.rx * scale) + 'px' })
          .attr('y', function (d) { return inToPx(d.ry * scale) + 'px' })
      }
    },

    remove: function (objID) {
      d3.select('rect#' + objID)
        .style('visibility', 'hidden');
    },

    set: function (objID, xPos, yPos) {
      d3.select('rect#' + objID)
        .attr('x', xPos)
        .attr('y', yPos)
        .style('visibility', null);
    },

    highlight: function (objID) {
      d3.select('rect#' + objID)
        .attr('fill', 'red')
        .style('visibility', null);
    },

    dehighlight: function (objID) {
      d3.select('rect#' + objID)
        .attr('fill', null)
    },
  }
};

//Round up to 5
var round5 = function (x) {
  return Math.ceil(x / 5) * 5;
};

//Convert inches to Px, 96 pixels per inch
var inToPx = function (x) {
  return x * 96;
}

var pxToIn = function (x) {
  return x / 96;
}

//Get Value to transform objects on map corresponding to the map SVG file
//Default floor 1 aspect if no floorNum
var getScalingRatio = function (width, height, floorNum) {
  if (floorNum === 2) {
    var aspect = 0.85035;//W=925.374,H=1088.246
  } else {
    var aspect = 1.25385;//W=1364.490,H=1088.2464
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

  };
};

//Get file path for the floor level
//Params floor number
//Output file path of the map assets, default to floor 1 if no argument
var getFilePath = function (floorNum) {
  switch (floorNum) {
    case 1:
      return '/assets/level1.svg';
    case 2:
      return '/assets/level2.svg';
    default:
      return '/assets/level1.svg';
  }
};

//Attach onClick to container to display marker at click location
var attachOnClick = function (container, marker) {
  container.on('click', function () {
    var xPos = d3.mouse(this)[0] - marker.attr('width') / 2;
    var yPos = d3.mouse(this)[1] - marker.attr('height') * 1;
    marker.attr('x', xPos).attr('y', yPos);
    marker.style('visibility', 'visible');
  })
};
//Add a container within the container ID with given width and height
var addContainer = function (containerID, width, height) {
  return d3.select('#' + containerID).append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
};

//Add the map svg to the container, can not change width height after initialize
var addMap = function (container, filePath) {
  d3.xml(filePath, 'image/svg+xml', function (xml) {
    container.node().appendChild(document.importNode(xml.documentElement, true));
    container.select('svg')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', '100%')
      .attr('width', '100%')
      .attr('preserveAspectRatio', 'xMinYMin meet');
  });
};

//Add a SVG location marker object initially hidden
var addMarker = function (container, id) {
  return container
    .append('svg:image')
    .attr('xlink:href', '/assets/marker.svg')
    .style('visibility', 'hidden')
    .attr('id', 'marker' + id)
    .attr('width', 30)
    .attr('height', 30);
};
