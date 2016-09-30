// add elements in which to place the chart
function HSlider(){

/*
  // set the dimensions 
  var margin = {top: 20, right: 80, bottom: 30, left: 20}
    , width = 960 - margin.left - margin.right
    , height = 70 - margin.top - margin.bottom
    , callback;

  var x = d3.scaleTime().range([0, 890]);
  var y = d3.scaleLinear().range([100, 0]);
  // set slider variables
  */
  var margin = {top: 20, right: 20, bottom: 30, left: 50}
    , width = 960 - margin.left - margin.right
    , height = 150 - margin.top - margin.bottom
    , x_col = 'date'
    , y_col = 'eta'
    , theta = 4
    , callback
    ;
  function chart(selection){
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);
      // iteration through data
      selection.each(function(csv){
        // Scale the x range of the csv
        var date_range = d3.extent(csv, function(d) { return d[x_col]; });
        x.domain(date_range);

        // Scale the y range of the csv
        var y_range = [0, d3.max(csv, function(d) { return d[y_col]; })];
        y.domain(y_range);

        // Set start/end dates
        var date_start = date_range[0];
        var date_end = date_range[1];

        // create horizontal line
        var svg = d3.select('#eta svg g')
        svg.select('#theta_hline').remove()
        svg.select('#theta_hline-overlay').remove()
        var slide = svg.append("line")
            .attr('id','theta_hline',true)
            .classed('slide','true')
            .attr("x1", x(date_start))
            .attr("y1", y(theta))
            .attr("x2", x(date_end))
            .attr("y2", y(theta))
          .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr('id','theta_hline-overlay')
            .classed('slide',true)
        ;

        // create drag behavior on horizontal line
        slide.call(d3.drag()
          .on("start drag", function() {
            console.log("DRAG")
            on_change(y.invert(d3.event.y));
          }));
    });
        function on_change(h) {
          thetaTarget = h;
          //d3.select(".handle").attr("cx", d3.event.x);
          callback(h);
        }
  }
  chart.margin = function(m) {
    if (!arguments.length) { return margin; }
    margin = m;
    return chart;
  };

  chart.callback = function(A) {
    if (!arguments.length) { return callback; }
    callback = A;
    return chart;
  };

  chart.width = function(w) {
    if (!arguments.length) { return width; }
    width = w;
    x = d3.scaleTime().range([0, width])
    return chart;
  };

  chart.theta = function(h){
    if (!arguments.length) { return theta; }
    theta=h
    return chart;
  };
  chart.height = function(h) {
    if (!arguments.length) { return height; }
    height = h;
    return chart;
  };

  return chart
}
