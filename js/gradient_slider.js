// add elements in which to place the chart
function Slider(){

  // set the dimensions 
  var margin = {top: 20, right: 80, bottom: 30, left: 20}
    , width = 960 - margin.left - margin.right
    , height = 70 - margin.top - margin.bottom
  // set slider variables
  var hueActual = 0,
      hueTarget = 4,
      hueAlpha = 1;

   function chart(selection){
    // build svg
    var svg = selection.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    // set slider variables
    var hueTimer = d3.timer(hueTween);

    // create scale
    var x = d3.scaleLinear()
      .domain([0, 20])
      .range([0, width])
      .clamp(true);

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
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { hue(x.invert(d3.event.x)); }));

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
        .attr("r", 9);

    // unclear what this does
    function hue(h) {
      hueTarget = h;
      hueTimer.restart(hueTween);
    }

    // unclear what this does too
    function hueTween() {
      var hueError = hueTarget - hueActual;
      if (Math.abs(hueError) < 1e-3) hueActual = hueTarget, hueTimer.stop();
      else hueActual += hueError * hueAlpha;
      handle.attr("cx", x(hueActual));
      d3.select('#slider svg').style("background-color", d3.hsl(hueActual, 0.8, 0.8));
    }
  }

  chart.margin = function(m) {
    if (!arguments.length) { return margin; }
    margin = m;
    return chart;
  };

  chart.hueActual = function(A) {
    if (!arguments.length) { return hueActual; }
    hueActual = A;
    return chart;
  };

  chart.hueTarget = function(T) {
    if (!arguments.length) { return hueTarget; }
    hueTarget = T;
    return chart;
  };

  chart.hueAlpha = function(A) {
    if (!arguments.length) { return hueAlpha; }
    hueAlpha = A;
    return chart;
  };

  return chart
}
