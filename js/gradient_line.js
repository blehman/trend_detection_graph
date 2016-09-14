// Closure
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();


// add elements in which to place the chart
function gradient_line(){

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50}
    , width = 960 - margin.left - margin.right
    , height = 150 - margin.top - margin.bottom
    , title = 'Reuseable Heatmap'
    , x_col = 'date'
    , y_col = 'eta';

  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  // define the line
  var valueline = d3.area()
    .x(function(d) { return x(d[x_col]); })
    .y0(y(0))
    .y1(function(d) { return y(d[y_col]); });

  function chart(selection){
    // the chart function builds the heatmap.
    // note: selection is passed in from the .call(myHeatmap), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
    selection.each(function(csv){
        console.log(csv)
        console.log(height)

        // format data
        csv.forEach(function(d) {
        d[x_col] = parseTime(d[x_col]);
        d[y_col] = +d[y_col];
        })

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the csv
    x.domain(d3.extent(csv, function(d) { return d[x_col]; }));
    y.domain([0, d3.max(csv, function(d) { return d[y_col]; })]);

    // Add a gradient to line
    svg.append('linearGradient')
      .attr('id','line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1',0).attr('y1', y(d3.max(csv, function(d) { return d.eta; })*0.20))
      .attr("x2", 0).attr("y2", y(d3.max(csv, function(d) { return d.eta; })*0.5))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "steelblue"},
          {offset: "50%", color: "gray"},
          {offset: "100%", color: "red"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    // Add the valueline path.
    svg.append("path")
        .data([csv])
        .attr("class", "line")
        .attr("d", valueline);
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

      // Add title
      svg.append('g')
          .classed('title_container',true)
          .append('text')
          .classed('title',true)
          .attr('x',0)
          .attr('y',margin.top)
          .text(title)
    })
  }

  chart.margin = function(m) {
    if (!arguments.length) { return margin; }
    margin = m;
    return chart;
  };

  chart.width = function(w) {
    if (!arguments.length) { return width; }
    width = w;
    return chart;
  };

  chart.height = function(h) {
    if (!arguments.length) { return height; }
    height = h;
    return chart;
  };

  chart.gridSize = function(m) {
    if (!arguments.length) { return gridSize; }
    gridSize = m;
    return chart;
  };

  chart.colors = function(c) {
    if (!arguments.length) { return colors; }
    colors = c;
    colorScale = d3.scale.linear().domain(colorDomain).range(colors);
    return chart;
  };

  chart.colorDomain = function(d) {
    if (!arguments.length) { return colorDomain; }
    colorDomain = d;
    colorScale = d3.scale.linear().domain(colorDomain).range(colors);
    return chart;
  };

  chart.title = function(t) {
    if (!arguments.length) { return title; }
    title = t;
    return chart;
  };

  return chart
}
