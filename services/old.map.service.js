(function () {
    angular.module("app")
        .service("mapService", mapService);

    function mapService() {
        const ISO_VERT_SCALE = 0.58;
        const ISO_ANGLE = -135;
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
            init: init,
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
        var displayMarkerOnClick = displayMarkerOnClick;
        var getScreenFactor = getScreenFactor;

        return service;

        ///////////////////////////////////////////////
        function init(container, floor, entries) {
            service.map(container, floor);
            for (i in entries) {
                if (entries[i].type == 'Studio') {
                    if (entries[i].metadata) {
                        var payload = {
                            'metadata': JSON.parse(entries[i].metadata),
                            'subtype': entries[i].subtype,
                            'floor': entries[i].floor,
                            'id': entries[i].key
                        };
                        // service.map.studio.draw(payload);
                    }
                }
            }
        }

        /**
         * Makes an map object that provides methods to change the entire map view
         * @param {string} container ID of the element you wish to attach map to (required)
         * @param {number} floor to view
         *
         **/
        // constructor
        function map(container, floor) {
            console.log("Called map fn");
            var vm = this;
            vm.curFloor = floor;
            vm.nextFloor = nextFloor;
            // container for the map svgs and images
            vm.viewport = null;
            // the map image
            vm.bgMap = null;
            // return width/height of map container
            vm.width = width;
            vm.height = height;
            vm.studio = null;
            vm.markers = null;
            vm.resize = resize;
            vm.selectFloor = selectFloor;
            vm.swipe = swipe;
            vm.getMarkerLocation = getMarkerLocation;

            activate();

            ///////////////////////////

            function activate() {
                vm.viewport = d3.select('#' + container)
                    .append('svg')
                    .attr('id', 'mapContainer' + container)
                    .attr('class', 'mapContainer')
                    .attr('width', '100%')
                    .attr('height', '100%');

                vm.bgMap = vm.viewport
                    .append("svg:image")
                    .attr("xlink:href", MAP_FILE_PATH)
                    .attr('preserveAspectRatio', 'xMinYMin meet')
                    .attr('width', '100%')
                    .attr('height', '1000%')
                    .attr('class', 'isoMap');

                console.log(service);

                vm.studio = new service.studio(vm.viewport, vm.bgMap, IS_ISOMETRIC);
                vm.markers = new service.marker(vm.studio.building);
            }

            function nextFloor() {
                if (vm.curFloor == 1) {
                    vm.curFloor = 2;
                } else {
                    vm.curFloor = 1;
                }
            }

            function width() {
                return vm.viewport.node().getBoundingClientRect().width;
            }

            function height() {
                return vm.viewport.node().getBoundingClientRect().height;

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
                d3.select(vm.studio.building)
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
            vm.building = null;
            vm.floor = null;
            vm.draw = draw;
            vm.resize = resize;
            vm.selectFloor = selectFloor;
            vm.highlight = highlight;
            vm.dehighlight = dehighlight;
            vm.onClick = onClick;

            activate();

            //////////////////////////////////

            function activate() {
                vm.building = container
                    .append('g')
                    .classed('studioGroup', true);

                vm.floor = [
                    vm.building
                        .append('g')
                        .classed('floor1', true),
                    vm.building
                        .append('g')
                        .classed('floor2', true)
                ];
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

            function resize(mapWidth) {
                for (var i = 0; i < vm.floor.length; i++) {
                    var transform = service.transformStudio(mapWidth, i + 1, IS_ISOMETRIC); //Floor number is i+1
                    vm.floor[i].attr('transform', transform);
                }
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
                map.transition().attr('transform', setFloor).duration(FLOOR_TRANSITION_DELAY);
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

            function deleteAll() {
                while (vm.markerCluster.length != 0) {
                    vm.markerCluster.pop().remove();
                }
            }

            function onClick() {
                // TODO: magician sunny's container
                service.displayMarker(vm.markerCluster, container);
            }

            function getLocation(width, floor) {
                var arrayOfPoints = [];

                for (var i in vm.markerCluster) {
                    var points = {
                        'x': Number(vm.markerCluster[i].attr('x')) + Number(vm.markerCluster[i].attr('width')) / 2,
                        'y': Number(vm.markerCluster[i].attr('y')) + Number(vm.markerCluster[i].attr('height'))
                    };
                    arrayOfPoints.push(undo(width, points, IS_ISOMETRIC, floor));
                }
                return arrayOfPoints;
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

    drag = d3.drag()
        .on("drag", function (d) {
            var obj = d3.select(this);
            obj.attr('x', d3.event.x - Number(obj.attr('width') / 2));
            obj.attr('y', d3.event.y - Number(obj.attr('height')));
        });


})();