(function () {
    angular.module("app")
        .service("mapLegend", mapLegend);

    function mapLegend() {
      var dataset = [
        { 'label': 'Studio', 'color': '#606AA6'},
        { 'label': 'Avaliable Studio', 'color': '#8EFF58'},
        { 'label': 'Common Area', 'color':'#A3FAFF' },
        { 'label': 'Staff', 'color': '#FAFF9E' }
      ];
      const WIDTH = 100;
      const HEIGHT = 100;
      const LOC_X = 0;
      const LOC_Y = 25;

      const BAR_X = 100;
      const BAR_Y_SPACING = 40;
      const BAR_WIDTH = 100;
      const BAR_HEIGHT = 40;
      const TEXT_Y_OFFSET = 15;

      var service = {
          activate: activate
      };

      return service;

      function activate( containerID ){
        // var container = d3.select( '#' + containerID);
        var container = d3.select('.mapContainer');
        drawLegend(container);
      };

      function drawLegend(container){
        // add legend
      	var legend = container.append("g")
      	  .attr("class", "legend")
      	  .attr("x", LOC_X)
      	  .attr("y", LOC_Y)
      	  .attr("height", HEIGHT)
      	  .attr("width", WIDTH);

      	legend.selectAll('g')
          .data(dataset)
          .enter()
          .append('g')
          .attr('class','legendItem')
          .each(function(d, i) {
              var g = d3.select(this);
              g.append("rect")
                .attr("x", LOC_X)
                .attr("y", i*BAR_Y_SPACING + LOC_Y)
                .attr("width", BAR_WIDTH + 'px')
                .attr("height", BAR_HEIGHT +'px')
                .style("fill", d.color);

              g.append("text")
                .attr("x", LOC_X)
                .attr("y", i * BAR_Y_SPACING + LOC_Y + TEXT_Y_OFFSET)
                .attr("height", BAR_HEIGHT)
                .attr("width", BAR_WIDTH)
                .style("fill", 'black')
                .text(d.label);

            });
          };
}})();
