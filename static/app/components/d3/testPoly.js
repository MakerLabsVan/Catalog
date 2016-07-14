var polygonConstructor = function( studioName ){
  this.container = d3.select('body').append('svg')
    .attr('width', '100%')
    .attr('height', '100%'),
  this.points = [],
  this.startDraw = function(){
    console.log(this.points)
    var stuff = this.points;
    this.container.on('click', function(){
      var x = d3.mouse(this)[0];
      var y = d3.mouse(this)[1];
      stuff.concat([x, y]);
      console.log(stuff)
    });
  },
  this.draw = function() {
      d3.select(".p").remove();
      this.container.append("svg:polygon")
        .style("fill", "red")
        .style("stroke-width", "1")
        .classed("p", true)
        .attr("points", this.points + " ");
  }
}

var polygon = new polygonConstructor('testing');
polygon.startDraw();


var polyClick = function() {
var x = d3.mouse(this)[0];
var y = d3.mouse(this)[1];
clicks.push.apply(clicks, [x, y]);
}

var drawPoly = function() {
d3.select(".p").remove();
mySVG.append("svg:polygon")
  .style("fill", "red")
  .style("stroke-width", "1")
  .classed("p", true)
  .attr("points", params + " ");
}
