(function () {
    angular.module("app")
        .service("mapService", mapService);

    function mapService() {
        const ISO_VERT_SCALE = 0.58;
        const ISO_ANGLE = -135;
        const FLOOR_TRANSITION_DELAY = 1000; //1 second

        // ISOMETRIC MAP
        const IS_ISOMETRIC = true; //Draws 2d map if false
        const MAP_FILE_PATH = "/assets/ISO4.png";
        const ISO_MAP_SCALE = 8.5; //database value to isometric map conversion
        const ISO_MAP_WIDTH = 1464; // Width of isometric map, used to dynamically resize map
        const SCROLL_MAP_Y = 1375; //Vertical scroll until next floor
        const FIRST_FLOOR_X = 875; //Translate studios into place
        const FIRST_FLOOR_Y = 2365;
        const SECOND_FLOOR_X = 710;
        const SECOND_FLOOR_Y = 790;

        var service = {
            // main map object (check below)
            map: map,
            studio: studio,
            marker: marker,
            displayMarker: displayMarker,
            addMarker: addMarker,
            transformStudio: transformStudio,
            undo: undo,
            // map coords to map
            transformMap: transformMap
        };

        var drag = drag;
        var getScreenFactor = getScreenFactor;

        return service;

        ///////////////////////////////////////////////
        /**
         * Makes an map object that provides methods to change the entire map view
         * @param {string} container ID of the element you wish to attach map to (required)
         * @param {number} floor to view
         *
         **/
        function map(container, floor) {
            var vm = this;
            vm.curFloor = floor;
            vm.nextFloor = nextFloor;
            // container for the map svgs and images
            vm.viewport = viewport;
            // the map image
            vm.map = map;
            // return width/height of map container
            vm.width = width;
            vm.height = height;
            vm.studio = studio;
            vm.markers = markers;
            vm.resize = resize;
            vm.selectFloor = selectFloor;
            vm.swipe = swipe;
            vm.getMarkerLocation = getMarkerLocation;

            ///////////////////////////
            function nextFloor() {
                if (vm.curFloor == 1) {
                    vm.curFloor = 2;
                } else {
                    vm.curFloor = 1;
                }
            }

            function viewport() {
                return d3.select('#' + container)
                    .append('svg')
                    .attr('id', 'mapContainer' + container)
                    .attr('class', 'mapContainer');
            }

            function map() {
                return vm.viewport
                    .append("svg:image")
                    .attr("xlink:href", MAP_FILE_PATH)
                    .attr('preserveAspectRatio', 'xMinYMin meet')
                    .attr('class', 'isoMap');
            }

            function width() {
                return vm.viewport.node().getBoundingClientRect().width;
            }

            function height() {
                return vm.viewport.node().getBoundingClientRect().height;

            }

            function studio() {
                return new service.studio(vm.viewport, vm.map, IS_ISOMETRIC);
            }

            function markers() {
                return new service.marker(vm.studio.building());
            }

            function resize() {
                vm.studio.resize(vm.width);
                vm.studio.selectFloor(vm.width, vm.curFloor);
            }

            function selectFloor(floor) {
                vm.curFloor = floor;
                vm.studio.selectFloor(vm.width, floor);
            }

            function swipe() {
                d3.select(vm.studio.Building)
                    .on("drag", dragAlert);

                function dragAlert() {
                    alert("It works!");
                }
            }

            function getMarkerLocation() {
                return vm.markers.getLocation(vm.width, vm.curFloor);
            }
        }

        function studio(container, map, IS_ISOMETRIC) {
            var vm = this;
            vm.building = building;
            vm.floor = floor;
            vm.draw = draw;
            vm.resize = resize;
            vm.selectFloor = selectFloor;
            vm.highlight = highlight;
            vm.dehighlight = dehighlight;
            vm.onClick = onClick;


            //////////////////////////////////
            function building() {
                return container
                    .append('g')
                    .classed('studioGroup', true);
            }

            function floor() {
                return [
                    vm.building
                        .append('g')
                        .classed('floor1', true),
                    vm.building
                        .append('g')
                        .classed('floor2', true)
                ]
            }

            function draw(payload) {
                if ((Number(payload.floor) - 1) < 0) {
                    return;
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
            }

            function selectFloor(width, floor) {
                var screenScale = getScreenFactor(width);

                var setFloor;
                switch (floor) {
                    case 1:
                        setFloor = 'translate(0,' + -SCROLL_MAP_Y * screenScale + ') ';
                        break;
                    case 2:
                        setFloor = 'translate(0,0) ';
                        break;
                    default:
                        setFloor = 'translate(0,' + -SCROLL_MAP_Y * screenScale + ') ';
                        break;
                }

                vm.building.transition().attr('transform', setFloor).duration(FLOOR_TRANSITION_DELAY);
                service.map.map.transition().attr('transform', setFloor).duration(FLOOR_TRANSITION_DELAY);
            }

            function highlight(id) {
                vm.building.select('#' + id)
                    .classed('studioHighlight', true)
            }

            function dehighlight(id) {
                vm.building.select('#' + id)
                    .classed('studioHighlight', false)
            }

            function onClick(callback) {
                d3.selectAll('.studio').on('click', function () {
                    callback(d3.select(vm).attr('id'));
                })
            }
        }

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


            ////////////////////////////
            function draw(width, markerData) {
                var markerNum = markerData.points.length;
                var currentMarkerNum = vm.markerCluster.length;

                //Render new markers when there isnt enough
                if (currentMarkerNum < markerNum) {
                    for (var j = 0; currentMarkerNum + j < markerNum; j++) {
                        vm.markerCluster.push(service.addMarker(container, currentMarkerNum + j));
                    }
                }
                for (var k in markerData.points) {
                    var coords = service.transformMap(width, markerData.points[k], IS_ISOMETRIC, markerData.floor);

                    //Adjust for marker size
                    coords.x -= Number(vm.markerCluster[k].attr('width')) / 2;
                    coords.y -= Number(vm.markerCluster[k].attr('height'));

                    vm.markerCluster[k]
                        .classed('hide', false)
                        .classed('floor' + markerData.floor, true)
                        .attr('x', coords.x)
                        .attr('y', coords.y)
                }
            }

            function hide() {
                for (var i in vm.markerCluster) {
                    vm.markerCluster[i].classed("hide", true);
                }
            }

            function deleteLast() {
                vm.markerCluster.pop().remove();
            }

            function onClick() {
                service.displayMarker(vm.markerCluster, container);
            }

            function onDrag() {
                for (var i in vm.markerCluster) {
                    vm.markerCluster[i].call(drag);
                }
            }
        }

        function displayMarker(markerCluster) {
            d3.select('.isoMap').on('click', function () {
                var studioGroup = d3.select('.studioGroup');
                var xPos = d3.mouse(studioGroup.node())[0];
                var yPos = d3.mouse(studioGroup.node())[1];

                var marker = service.addMarker(studioGroup);

                marker
                    .attr('x', xPos - Number(marker.attr('width') / 2))
                    .attr('y', yPos - Number(marker.attr('height')))
                    .call(drag);

                markerCluster.push(marker);
            })
        }

        function transformStudio(width, floor, isIso) {
            if (isNaN(width)) {
                return;
            }
            var screenScale = getScreenFactor(width);

            var translate;
            if (floor === 2) {
                translate = 'translate(' + SECOND_FLOOR_X * screenScale + ',' + SECOND_FLOOR_Y * screenScale + ') '; // second floor
            } else {
                translate = 'translate(' + FIRST_FLOOR_X * screenScale + ',' + FIRST_FLOOR_Y * screenScale + ') '; // first floor
            }

            var scale;
            if (isIso == true) {
                scale = 'scale(' + ISO_MAP_SCALE * screenScale + ',' + ISO_MAP_SCALE * screenScale * ISO_VERT_SCALE + ') ';
                var rotate = 'rotate(' + ISO_ANGLE + ', 0, 0) ';
                return translate + scale + rotate;
            } else {
                scale = 'scale(' + ISO_MAP_SCALE * screenScale + ',' + ISO_MAP_SCALE * screenScale + ') '; //0.58 vertical scale for isometric map
                return translate + scale;
            }
        }

        function undo(width, oldCoords, isIso, floor) {
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

            var coords;
            if (isIso == true) {
                coords = {
                    'x': transformX * cosA + transformY * sinA,
                    'y': -transformX * sinA + transformY * cosA
                };
            } else {
                coords = {
                    'x': transformX,
                    'y': transformY
                };
            }

            return coords;
        }

        function transformMap(width, oldCoords, isIso, floor) {
            var screenScale = getScreenFactor(width);
            var cosA = Math.cos(ISO_ANGLE * Math.PI / 180);
            var sinA = Math.sin(ISO_ANGLE * Math.PI / 180);

            //Rotation of coordinates
            var transformX, transformY;
            if (isIso == true) {
                transformX = oldCoords.x * cosA - oldCoords.y * sinA;
                transformY = oldCoords.x * sinA + oldCoords.y * cosA;
            } else {
                transformX = oldCoords.x;
                transformY = oldCoords.y;
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

        function getScreenFactor(currentWidth) {
            return currentWidth / ISO_MAP_WIDTH;
        }

        function addMarker(container) {
            return container
                .append('svg:image')
                .attr('xlink:href', '/assets/marker.svg')
                .attr('width', 40)
                .attr('height', 40)
                .classed('marker', true);
        }


    }


})();