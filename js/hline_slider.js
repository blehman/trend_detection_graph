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
    , h_line = d3.select('#theta_hline-overlay')
    , x_col = 'date'
    , y_col = 'eta'
    , callbackr
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

        // h_line
        h_line.on('click',function(){console.log('CLICK')})
        h_line.call(d3.drag()
                //.on("start.interrupt", function() { slider.interrupt(); })
          .on("start drag", function() { on_changer(y.invert(d3.event.y)); }))
        ;
    /*
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

    // unclear what this does
    function on_change(h) {
      thetaTarget = h;
      d3.select(".handle").attr("cx", d3.event.x);
      callback(h);
    }
    */
       // pass in theta and use callback to update gradient of other graphs
    });
        function on_changer(h) {
          thetaTarget = h;
          //d3.select(".handle").attr("cx", d3.event.x);
          callbackr(h);
        }

    }

/*
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
*/
  chart.callbackr = function(A) {
    if (!arguments.length) { return callbackr; }
    callbackr = A;
    return chart;
  };

  return chart
}
