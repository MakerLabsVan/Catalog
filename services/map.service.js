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
        const SCROLL_MAP_FLOOR_2 = -100;
        const SCROLL_MAP_FLOOR_1 = 1350; //Vertical scroll until next floor
        const FIRST_FLOOR_X = 875; //Translate studios into place
        const FIRST_FLOOR_Y = 2365;
        const SECOND_FLOOR_X = 710;
        const SECOND_FLOOR_Y = 790;

        const MARKER_SIZE = 40; // in PX
        const MARKER_PATH = '/marker.svg';

        var drag = d3.drag()
            .on("drag", function (d) {
                var obj = d3.select(this);
                obj.attr('x', d3.event.x - Number(obj.attr('width') / 2));
                obj.attr('y', d3.event.y - Number(obj.attr('height')));
            });

        var service = {
            // main map object (check below)
            activate: activate,
            map: mapConstructor,
            switchFloor: map.nextFloor,
            resize: map.resize,
            studio: map.studio,
            marker: map.markers,
            getLocation: map.getMarkerLocation

        };

        return service;

        function activate(container, floor, entries) {
            service.map = new mapConstructor(container, floor);
            service.switchFloor = service.map.nextFloor;
            service.resize = service.map.resize;
            service.studio = service.map.studio;
            service.marker = service.map.markers;
            service.getLocation = service.map.getMarkerLocation;

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
            var vm = this;
            vm.viewport = d3.select('#' + containerID)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('id', 'mapContainer' + containerID)
                .attr('class', 'mapContainer');
            vm.map = vm.viewport
                .append("svg:image")
                .attr("xlink:href", MAP_FILE_PATH)
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('class', 'isoMap')
                .attr('width', "100%")
                .attr('height', "1000%")
                .attr('id', 'map-png');
            vm.width = width;
            vm.height = height;
            vm.studio = new studio(vm.viewport, vm.map, IS_ISOMETRIC);
            vm.markers = new marker(vm.studio.building);
            vm.currentFloor = floorNum;
            vm.resize = resize;
            vm.selectFloor = selectFloor;
            vm.nextFloor = nextFloor;
            vm.getMarkerLocation = getMarkerLocation;

            function width() {
                return vm.viewport.node().getBoundingClientRect().width;
            };
            function height() {
                return vm.viewport.node().getBoundingClientRect().height;
            };
            function resize() {
                vm.studio.selectFloor(vm.width(), vm.currentFloor);
                vm.studio.resize(vm.width());
            };
            //Move to floor
            function selectFloor(floor) {
                vm.currentFloor = Number(floor);
                vm.studio.selectFloor(vm.width(), floor);
                vm.resize();
            };
            function nextFloor() {
                vm.currentFloor === 1 ? vm.currentFloor = 2 : vm.currentFloor = 1;
                vm.resize();
            };
            function getMarkerLocation() {
                return vm.markers.getLocation(vm.width(), vm.currentFloor);
            };
        };

        /**
         * vm object controls all the interactions of the studio objects
         *  @param {selection} The viewport svg of the map (required)
         *  @param {selection} The map selection object (required)
         *  @param {boolean} if isIsometric is true draws everything on the isometric plane
         **/
        function studio(container, map, IS_ISOMETRIC) {
            var vm = this;
            //Building contains all studio information
            vm.building = container
                .append('g')
                .classed('studioGroup', true);
            //The floor is an array of g elements for each floor in the bulding
            vm.floor = [
                vm.building
                    .append('g')
                    .classed('floor1', true),
                vm.building
                    .append('g')
                    .classed('floor2', true)
            ];
            vm.draw = draw;
            vm.resize = resize;
            vm.selectFloor = selectFloor;
            vm.highlight = highlight;
            vm.dehighlight = dehighlight;
            vm.onClick = onClick

            /**
             * vm object controls all the interactions of the studio objects
             *  @param {number} payload.floor, indicates which floor to draw on(required)
             *  @param {string} payload.id, assigns dom id (required)
             *  @param {json} payload.metadata, contains points which has an array of points (required)
             *  @param {string} payload.subtype, adds class for css styling
             **/
            function draw(payload) {
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
            };

            function resize(mapWidth) {
                for (var i = 0; i < vm.floor.length; i++) {
                    transform = mapTransformStrings(mapWidth, i + 1, IS_ISOMETRIC); //Floor number is i+1
                    vm.floor[i].attr('transform', transform);
                }
            };
            function selectFloor(width, floorNum) {
                var screenScale = getScreenFactor(width);
                switch (floorNum) {
                    case 1:
                        var setFloor = 'translate(0,' + -SCROLL_MAP_FLOOR_1 * screenScale + ') ';
                        break;
                    case 2:
                        var setFloor = 'translate(0, ' + -SCROLL_MAP_FLOOR_2 * screenScale + ') ';
                        break;
                    default:
                        var setFloor = 'translate(0,' + -SCROLL_MAP_FLOOR_1 * screenScale + ') ';
                        break;
                }

                vm.building.transition().attr('transform', setFloor).duration(FLOOR_TRANSITION_DELAY);
                map.transition().attr('transform', setFloor).duration(FLOOR_TRANSITION_DELAY);
            };

            //Highlight studio
            function highlight(objID) {
                vm.building.select('#' + objID)
                    .classed('studioHighlight', true)
            };

            //Dehighlight studio
            function dehighlight(objID) {
                vm.building.select('#' + objID)
                    .classed('studioHighlight', false)
            };

            //on studio click, pass the studio's ID to callback function
            function onClick(callback) {
                d3.selectAll('.studio').on('click', function () {
                    callback(d3.select(this).attr('id'));
                })
            };
        };

        /**
         * vm object controls all the interactions of the marker objects
         * @param {selection} The container that we want to draw markers on
         *
         **/
        function marker(container) {
            var vm = this;
            vm.markerCluster = [];
            vm.draw = draw;
            vm.hide = hide;
            vm.deleteLast = deleteLast;
            vm.deleteAll = deleteAll;
            vm.onClick = onClick;
            vm.getLocation = getLocation;
            vm.onDrag = onDrag;

            // Draw all markers in the metadata
            // @param {markerData} json which contains points and floor
            function draw(width, markerData) {
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
            };

            function hide() {
                for (i in vm.markerCluster) {
                    vm.markerCluster[i].classed('hide', true);
                }
            };

            function deleteLast() {
                vm.markerCluster.pop().remove();
            };

            function deleteAll() {
                while (vm.markerCluster.length != 0) {
                    vm.markerCluster.pop().remove();
                }
            };

            function onClick() {
                showMarkerOnClick(vm.markerCluster, container);
            };

            function getLocation(width, floor) {
                var arrayOfPoints = [];

                for (i in vm.markerCluster) {
                    var points = {
                        'x': Number(vm.markerCluster[i].attr('x')) + Number(vm.markerCluster[i].attr('width')) / 2,
                        'y': Number(vm.markerCluster[i].attr('y')) + Number(vm.markerCluster[i].attr('height'))
                    };
                    arrayOfPoints.push(undoMapTransformCoords(width, points, IS_ISOMETRIC, floor));
                }
                return arrayOfPoints;
            };

            function onDrag() {
                for (i in vm.markerCluster) {
                    vm.markerCluster[i].call(drag);
                }
            };
        };


        function showMarkerOnClick(markerCluster) {
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
        function undoMapTransformCoords(width, oldCoords, isIso, floor) {
            var screenScale = getScreenFactor(width);
            var cosA = Math.cos(ISO_ANGLE * Math.PI / 180);
            var sinA = Math.sin(ISO_ANGLE * Math.PI / 180);

            var transformX = oldCoords.x / screenScale;
            var transformY = oldCoords.y / screenScale;

            if (floor === 2) {
                transformX -= SECOND_FLOOR_X;
                transformY -= SECOND_FLOOR_Y;
            } else {
                transformX -= FIRST_FLOOR_X;
                transformY -= FIRST_FLOOR_Y;
            }

            //scaling
            transformX /= ISO_MAP_SCALE;
            if (isIso == true) {
                transformY /= (ISO_MAP_SCALE * ISO_VERT_SCALE);
            } else {
                transformY /= ISO_MAP_SCALE;
            }

            //Rotation
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
        function mapTransformCoords(width, oldCoords, isIso, floor) {
            var screenScale = getScreenFactor(width);
            var cosA = Math.cos(ISO_ANGLE * Math.PI / 180);
            var sinA = Math.sin(ISO_ANGLE * Math.PI / 180);

            //Rotation of coordinates
            if (isIso == true) {
                var transformX = oldCoords.x * cosA - oldCoords.y * sinA;
                var transformY = oldCoords.x * sinA + oldCoords.y * cosA;
            } else {
                var transformX = oldCoords.x;
                var transformY = oldCoords.y;
            }

            //scaling
            transformX *= ISO_MAP_SCALE;
            if (isIso == true) {
                transformY *= (ISO_MAP_SCALE * ISO_VERT_SCALE);
            } else {
                transformY *= ISO_MAP_SCALE;
            }
            //Translate back into floor plane
            if (floor == 2) {
                transformX += SECOND_FLOOR_X;
                transformY += SECOND_FLOOR_Y;
            } else {
                transformX += FIRST_FLOOR_X;
                transformY += FIRST_FLOOR_Y;
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

        function addMarker(container) {
            return container
                .append('svg:image')
                .attr('xlink:href', MARKER_PATH)
                .attr('width', MARKER_SIZE)
                .attr('height', MARKER_SIZE)
                .classed('marker', true);
        };

    }
})();
