(function () {
    angular.module("app")
        .factory("mapService", mapService);

        function mapService() {
            const ISO_VERT_SCALE = 0.58; //isometric scaling
            const ISO_ANGLE = -135; //degrees
            const FLOOR_TRANSITION_DELAY = 1000; //1 second

            // ISOMETRIC MAP
            const IS_ISOMETRIC = true; //Draws 2d map if false
            const MAP_FILE_PATH = "ISO4.png";
            const ISO_MAP_SCALE = 8.5; //database value to isometric map conversion
            const ISO_MAP_WIDTH = 1464; // Width of isometric map, used to dynamically resize map
            const SCROLL_MAP_Y = 1375; //Vertical scroll until next floor
            const FIRST_FLOOR_X = 875; //Translate studios into place
            const FIRST_FLOOR_Y = 2365;
            const SECOND_FLOOR_X = 710;
            const SECOND_FLOOR_Y = 790;

            var service = {
                // main map object (check below)

                activate: activate,
                map: mapConstructor,
                studio: map.studio,
                marker: map.marker,
                // displayMarker: displayMarker,
                // addMarker: addMarker,
                // transformStudio: transformStudio,
                // undo: undo,
                // // map coords to map
                // transformMap: transformMap
            };

            console.log(service.studio)
            return service;


            function activate (container,floor,entries ){
              service.map = new mapConstructor(container, floor);
              for (i in entries) {
                      if (entries[i].metadata) {
                          var payload = {
                              'metadata': JSON.parse(entries[i].metadata),
                              'subtype': entries[i].subtype,
                              'floor': entries[i].floor,
                              'id': entries[i].key
                          };
                          service.map.studio.draw(payload);
                  }
              }

              service.map.resize();


            }

            /**
             * Makes an map object that provides methods to change the entire map view
             * @param {string} container ID of the element you wish to attach map to (required)
             * @param {number} initial floorNum to view
             *
             **/
            function mapConstructor(containerID, floorNum) {
                vm = this;
                //Current Floor
                vm.currentFloor = floorNum,

                vm.nextFloor = function () {
                      if (vm.currentFloor === 1) {
                          vm.currentFloor = 2;
                      } else {
                          vm.currentFloor = 1;
                      }
                  },

                  //Container for the map svgs and images
                  vm.viewport = d3.select('#' + containerID)
                      .append('svg')
                      .attr('width','100%')
                      .attr('height','100%')
                      .attr('id', 'mapContainer' + containerID)
                      .attr('class', 'mapContainer'),
                  //The map img
                  vm.map = vm.viewport
                      .append("svg:image")
                      .attr("xlink:href", MAP_FILE_PATH)
                      .attr('preserveAspectRatio', 'xMinYMin meet')
                      .attr('class', 'isoMap')
                      .attr('width',"100%")
                      .attr('height',"1000%")
                      .attr('id','map-png'),

                  //Returns width of the map container
                  vm.width = function () {
                      return vm.viewport.node().getBoundingClientRect().width;
                  },
                  //Returns height of the map container
                  vm.height = function () {
                      return vm.viewport.node().getBoundingClientRect().height;
                  },

                  //initialize studios svgs
                  vm.studio = new studio(vm.viewport, vm.map, IS_ISOMETRIC),
                  //Resize all map objects
                  vm.markers = new marker(vm.studio.building),

                  vm.resize = function () {
                      vm.studio.resize(vm.width());
                      vm.studio.selectFloor(vm.width(), vm.currentFloor);
                  },
                  //Move to floor
                  vm.selectFloor = function (floor) {
                      vm.currentFloor = floor;
                      vm.studio.selectFloor(vm.width(), floor);
                  },
                  vm.getMarkerLocation = function () {
                      return vm.markers.getLocation(vm.width(), vm.currentFloor);
                  }
            }

            /**
             * vm object controls all the interactions of the studio objects
             *  @param {selection} The viewport svg of the map (required)
             *  @param {selection} The map selection object (required)
             *  @param {boolean} if isIsometric is true draws everything on the isometric plane
             **/
            function studio (container, map, IS_ISOMETRIC) {
                var vm = this;
                //Building contains all studio information
                vm.building = container
                    .append('g')
                    .classed('studioGroup', true),

                    //The floor is an array of g elements for each floor in the bulding
                    vm.floor = [
                        vm.building
                            .append('g')
                            .classed('floor1', true),
                        vm.building
                            .append('g')
                            .classed('floor2', true)
                    ],

                    /**
                     * vm object controls all the interactions of the studio objects
                     *  @param {number} payload.floor, indicates which floor to draw on(required)
                     *  @param {string} payload.id, assigns dom id (required)
                     *  @param {json} payload.metadata, contains points which has an array of points (required)
                     *  @param {string} payload.subtype, adds class for css styling
                     **/
                    vm.draw = function (payload) {
                        if ((Number(payload.floor) - 1) < 0) {
                            return
                        }
                        vm.floor[Number(payload.floor) - 1]
                            .append('g')
                            .attr('id', payload.id)
                            .classed('studio', true)
                            .classed(payload.subtype, true)
                            .selectAll('polygon')
                            .data(payload.metadata.points)
                            .enter()
                            .append('polygon')
                            .attr("points", function (d) {
                                return d.polygon.map(function (d) {
                                    return [(d.x), (d.y)].join(",");
                                }).join(" ");
                            });
                    },

                    vm.resize = function (mapWidth) {
                        for (var i = 0; i < vm.floor.length; i++) {
                            transform = mapTransformStrings(mapWidth, i + 1, IS_ISOMETRIC); //Floor number is i+1
                            vm.floor[i].attr('transform', transform);
                        }
                    },
                    vm.selectFloor = function (width, floorNum) {
                        var screenScale = getScreenFactor(width);
                        switch (floorNum) {
                            case 1:
                                var setFloor = 'translate(0,' + -SCROLL_MAP_Y * screenScale + ') ';
                                break;
                            case 2:
                                var setFloor = 'translate(0,0) ';
                                break;
                            default:
                                var setFloor = 'translate(0,' + -SCROLL_MAP_Y * screenScale + ') ';
                                break;
                        }

                        vm.building.transition().attr('transform', setFloor).duration(FLOOR_TRANSITION_DELAY);
                        map.transition().attr('transform', setFloor).duration(FLOOR_TRANSITION_DELAY);
                    },

                    //Highlight studio
                    vm.highlight = function (objID) {
                        vm.building.select('#' + objID)
                            .classed('studioHighlight', true)
                    },

                    //Dehighlight studio
                    vm.dehighlight = function (objID) {
                        vm.building.select('#' + objID)
                            .classed('studioHighlight', false)
                    },

                    //on studio click, pass the studio's ID to callback function
                    vm.onClick = function (callback) {
                        d3.selectAll('.studio').on('click', function () {
                            callback(d3.select(vm).attr('id'));
                        })
                    }
            }

            /**
             * vm object controls all the interactions of the marker objects
             * @param {selection} The container that we want to draw markers on
             *
             **/
            function marker(container) {

                vm.markerCluster = [],
                    // Draw all markers in the metadata
                    // @param {markerData} json which contains points and floor
                    vm.draw = function (width, markerData) {
                        var markerNum = markerData.points.length;
                        var currentMarkerNum = vm.markerCluster.length;

                        //Render new markers when there isnt enough
                        if (currentMarkerNum < markerNum) {
                            for (var j = 0; currentMarkerNum + j < markerNum; j++) {
                                vm.markerCluster.push(addMarker(container, currentMarkerNum + j));
                            }
                        }
                        for (k in markerData.points) {
                            var coords = mapTransformCoords(width, markerData.points[k], IS_ISOMETRIC, markerData.floor)

                            //Adjust for marker size
                            coords.x -= Number(vm.markerCluster[k].attr('width')) / 2;
                            coords.y -= Number(vm.markerCluster[k].attr('height'));

                            vm.markerCluster[k]
                                .classed('hide', false)
                                .classed('floor' + markerData.floor, true)
                                .attr('x', coords.x)
                                .attr('y', coords.y)
                        }
                    },

                    vm.hide = function () {
                        for (i in vm.markerCluster) {
                            vm.markerCluster[i].classed('hide', true);
                        }
                    },

                    vm.deleteLast = function () {
                        vm.markerCluster.pop().remove();
                    },

                    vm.deleteAll = function () {
                        while (vm.markerCluster.length != 0) {
                            vm.markerCluster.pop().remove();
                        }
                    },

                    vm.onClick = function () {
                        showMarkerOnClick(vm.markerCluster, container);
                    },

                    vm.getLocation = function (width, floor) {
                        var arrayOfPoints = [];

                        for (i in vm.markerCluster) {
                            var points = {
                                'x': Number(vm.markerCluster[i].attr('x')) + Number(vm.markerCluster[i].attr('width')) / 2,
                                'y': Number(vm.markerCluster[i].attr('y')) + Number(vm.markerCluster[i].attr('height'))
                            };
                            arrayOfPoints.push(undoMapTransformCoords(width, points, isIsometric, floor));
                        }
                        return arrayOfPoints;
                    },

                    vm.onDrag = function () {
                        for (i in vm.markerCluster) {
                            vm.markerCluster[i].call(drag);
                        }
                    }
            };

            var drag = d3.drag()
                .on("drag", function (d) {
                    var obj = d3.select(vm);
                    obj.attr('x', d3.event.x - Number(obj.attr('width') / 2));
                    obj.attr('y', d3.event.y - Number(obj.attr('height')));
                });


            var showMarkerOnClick = function (markerCluster) {
                d3.select('.isoMap').on('click', function () {
                    var studioGroup = d3.select('.studioGroup');
                    var xPos = d3.mouse(studioGroup.node())[0];
                    var yPos = d3.mouse(studioGroup.node())[1];

                    var marker = addMarker(studioGroup);

                    marker
                        .attr('x', xPos - Number(marker.attr('width') / 2))
                        .attr('y', yPos - Number(marker.attr('height')))
                        .call(drag);

                    markerCluster.push(marker);
                })
            }

            //For Transforming groups of studios
            function mapTransformStrings(width, floor, isIso) {
                if (isNaN(width)) {
                    return;
                }
                var screenScale = getScreenFactor(width);

                if (floor === 2) {
                    var translate = 'translate(' + SECOND_FLOOR_X * screenScale + ',' + SECOND_FLOOR_Y * screenScale + ') '; // second floor
                } else {
                    var translate = 'translate(' + FIRST_FLOOR_X * screenScale + ',' + FIRST_FLOOR_Y * screenScale + ') '; // first floor
                }

                if (isIso == true) {
                    var scale = 'scale(' + ISO_MAP_SCALE * screenScale + ',' + ISO_MAP_SCALE * screenScale * ISO_VERT_SCALE + ') ';
                    var rotate = 'rotate(' + ISO_ANGLE + ', 0, 0) ';
                    return translate + scale + rotate;
                } else {
                    var scale = 'scale(' + ISO_MAP_SCALE * screenScale + ',' + ISO_MAP_SCALE * screenScale + ') '; //0.58 vertical scale for isometric map
                    return translate + scale;
                }
            }

            // Undo mapTransformCoords function
            var undoMapTransformCoords = function (width, oldCoords, isIso, floor) {
                var screenScale = getScreenFactor(width);
                var cosA = Math.cos(isoAngle * Math.PI / 180);
                var sinA = Math.sin(isoAngle * Math.PI / 180);

                var transformX = oldCoords.x / screenScale;
                var transformY = oldCoords.y / screenScale;


                if (floor === 2) {
                    transformX -= secondFloorX;
                    transformY -= secondFloorY;
                } else {
                    transformX -= firstFloorX;
                    transformY -= firstFloorY;
                }

                //scaling
                transformX /= isoMapScale;
                if (isIso == true) {
                    transformY /= (isoMapScale * isoVertScale);
                } else {
                    transformY /= isoMapScale;
                }

                if (isIso == true) {
                    var coords = {
                        'x': transformX * cosA + transformY * sinA,
                        'y': -transformX * sinA + transformY * cosA
                    };
                } else {
                    var coords = {
                        'x': transformX,
                        'y': transformY
                    };
                }

                return coords;
            }

            //Mapping points to map
            var mapTransformCoords = function (width, oldCoords, isIso, floor) {
                var screenScale = getScreenFactor(width);
                var cosA = Math.cos(isoAngle * Math.PI / 180);
                var sinA = Math.sin(isoAngle * Math.PI / 180);

                //Rotation of coordinates
                if (isIso == true) {
                    var transformX = oldCoords.x * cosA - oldCoords.y * sinA;
                    var transformY = oldCoords.x * sinA + oldCoords.y * cosA;
                } else {
                    var transformX = oldCoords.x;
                    var transformY = oldCoords.y;
                }

                //scaling
                transformX *= isoMapScale;
                if (isIso == true) {
                    transformY *= (isoMapScale * isoVertScale);
                } else {
                    transformY *= isoMapScale;
                }
                //Translate back into floor plane
                if (floor == 2) {
                    transformX += secondFloorX;
                    transformY += secondFloorY;
                } else {
                    transformX += firstFloorX;
                    transformY += firstFloorY;
                }

                //screensize scale
                transformX *= screenScale;
                transformY *= screenScale;

                var coords = {
                    'x': transformX,
                    'y': transformY
                };

                return coords;
            }

            // Returns the ratio between the current width of viewport and map viewport width
            function getScreenFactor(currentWidth) {
                return currentWidth / ISO_MAP_WIDTH;
            }

            var addMarker = function (container) {
                return container
                    .append('svg:image')
                    .attr('xlink:href', '/assets/marker.svg')
                    .attr('width', 40)
                    .attr('height', 40)
                    .classed('marker', true);
            };

          }
})();
