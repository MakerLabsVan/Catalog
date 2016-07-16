//TODO: Reorganize object, use prototypes to seperate methods
//TODO: Seperate the nested objects
var mapConstructor = function (containerID, floorNum, studioData) {
    this.floorNum = floorNum,
    //Container object which contains all map objects
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
    //Draws the map given filepath of the map svg

    // this.map = addMap(this.container, getFilePath(floorNum)),

    this.map = addImgMap(this.container,"/assets/ISO.png" ),

    //Studios
    this.studio = {
      //Draws all the studios in studioData
      data: data = [],

      list: list = d3.select('svg#floor' + floorNum)
        .append('g')
        .attr('class','studioF' + floorNum),

      draw: function (studioData) {
        this.data = this.data.concat(studioData);
        this.list
          .append('g')
          .attr('id', studioData[0].id)
          .attr('class','studio')
          .selectAll('rect')
          .data(studioData)
          .enter()
          .append('rect')
          .attr('x', function (d) { return inToPx(d.rx) + 'px'; })
          .attr('y', function (d) { return inToPx(d.ry) + 'px'; })
          .attr('height', function (d) { return inToPx(d.height) + 'px'; })
          .attr('width', function (d) { return inToPx(d.width) + 'px'; })

      },
      resize: function (width, height) {
        var scale = getScalingRatio(width, height, floorNum);
        var scale = scale / 12;
        //var scale = getIsoScalingRatio(width);
        if (scale !== 0 && !isNaN(scale)) {
          //Magical numbers, just testing
          this.list.attr('transform','translate(266, 345) scale('+scale+','+scale*0.6+') rotate(-135, 0, 0) ')
          //this.list.attr('transform','scale('+scale+')')
        }
      },

      remove: function (objID) {
        d3.select('#' + objID)
          .style('visibility', 'hidden');
      },

      set: function (objID, xPos, yPos) {
        d3.select('#' + objID)
          .attr('x', xPos)
          .attr('y', yPos)
          .style('visibility', null);
      },

      highlight: function (objID) {
        d3.select('#' + objID)
          .attr('fill', 'red')
          .style('visibility', null);
      },

      dehighlight: function (objID) {
        d3.select('#' + objID)
          .attr('fill', null)
      },
    }
    //Where am I marker
    this.currentLocMarker = {
      icon : icon = addIAmHereMarker(this.container, floorNum),
      place: function( xPos, yPos, width , height ){
        var mark = d3.select('#here' + floorNum);
        var scale = getScalingRatio(width, height, floorNum)/10; // conversion from db value to actual map
        var xPx = inToPx(xPos * scale) + parseInt(mark.attr('width')) / 2;
        var yPx = inToPx(yPos * scale) - parseInt(mark.attr('height')) ;
        mark.moveToFront();
        mark
          .attr('x', xPx + 'px')
          .attr('y', yPx + 'px')
          .style('visibility', null)
      }
    },

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
        var scale = getScalingRatio(width, height, floorNum)/10;
        var xPx = inToPx(xPos * scale) - parseInt(this.icon.attr('width')) / 2;
        var yPx = inToPx(yPos * scale) - parseInt(this.icon.attr('height')) * 1;
        this.icon.moveToFront();
        this.icon
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
      //Output: [x,y] (ft)

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

var getIsoScalingRatio = function( width ){
  var originalWidth = 1000;
  var scale = width / originalWidth;
  return scale;
}
//Get Value to transform objects on map corresponding to the map SVG file
//Default floor 1 aspect if no floorNum
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


var addSvgMap = function (container, filePath){
  d3.xml(filePath, 'image/svg+xml', function (xml) {
    container.node().appendChild(document.importNode(xml.documentElement, true));
    container.select('svg')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', '100%')
      .attr('width', '100%')
      .attr('preserveAspectRatio', 'xMinYMin meet')
  });
}
//Add the map svg to the container, can not change width height after initialize
var addImgMap = function (container, filePath) {
  container.append("svg:image")
    .attr("xlink:href",filePath)
    .attr('width',"100vh")
    .attr('height','100vw')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('class','isoFloor1')

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

var addIAmHereMarker= function (container, id) {
  return container
    .append('svg:image')
    .attr('xlink:href', '/assets/whereAmI.svg')
    .style('visibility', 'hidden')
    .attr('id', 'here' + id)
    .attr('width', 50)
    .attr('height', 50);
};

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
  this.parentNode.appendChild(this);
  });
};
