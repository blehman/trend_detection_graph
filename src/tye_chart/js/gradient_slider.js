// add elements in which to place the chart
function Slider(){

  // set the dimensions 
  var margin = {top: 20, right: 80, bottom: 30, left: 20}
    , width = 960 - margin.left - margin.right
    , height = 70 - margin.top - margin.bottom
    , callback;

  var x = d3.scaleTime().range([0, 890]);
  var y = d3.scaleLinear().range([100, 0]);
  // set slider variables

   function chart(selection){
    // build svg
    var svg = selection.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // create scale
    var x = d3.scaleLinear()
      .domain([0, 18])
      .range([0, width])
      .clamp(true);
    var theta = 4;
    // build slider 
    var slider = svg.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

    // create track
    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            //.on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { on_change(x.invert(d3.event.x)); }));

    // create ticks & labels
    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) { return d; });

    // create ball slider
    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9)
        .attr("cx",x(theta));

    // pass in theta and use callback to update gradient of other graphs
    function on_change(h) {
      thetaTarget = h;
      d3.select(".handle").attr("cx", d3.event.x);
      callback(h);
    }
  }

  chart.margin = function(m) {
    if (!arguments.length) { return margin; }
    margin = m;
    return chart;
  };

  chart.targetChart = function(A) {
    if (!arguments.length) { return targetChart; }
    targetChart = A;
    return chart;
  };

  chart.callback = function(A) {
    if (!arguments.length) { return callback; }
    callback = A;
    return chart;
  };

  chart.theta = function(h){
    if (!arguments.length) { return theta; }
    theta=h
    return chart;
  };

  return chart
}
