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
      	  .attr("x", 500)
      	  .attr("y", 25)
      	  .attr("height", 100)
      	  .attr("width", 100)

      	legend.selectAll('g')
          .data(dataset)
          .enter()
          .append('g')
          .attr('class','legendItem')
          .each(function(d, i) {
              var g = d3.select(this);
              g.append("rect")
                .attr("x", 0)
                .attr("y", i*40)
                .attr("width", 100 + 'px')
                .attr("height", 25 +'px')
                .style("fill", d.color);

              g.append("text")
                .attr("x", 0)
                .attr("y", i * 40 + 15)
                .attr("height",100)
                .attr("width",100)
                .style("fill", 'black')
                .text(d.label);

            });
          };
}})();
