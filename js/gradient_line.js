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
function LineGraph(){

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50}
    , width = 960 - margin.left - margin.right
    , height = 150 - margin.top - margin.bottom
    , title = 'Reuseable Line Graph'
    , x_col = 'date'
    , y_col = 'eta'
    , g_col = 'eta'
    , add_vgradient = false
    , add_hgradient = false
    , line_fill = 'none'
    , line_stroke = '#111'
    , theta = 4
    , gradient_color = [
          {offset: "0%", color: "steelblue"},
          {offset: "50%", color: "gray"},
          {offset: "100%", color: "red"}
        ]
  ;

  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  // define the line
  var value_line = d3.area()
    .x(function(d) { return x(d[x_col]); })
    .y0(y(0))
    .y1(function(d) { return y(d[y_col]); });

  function chart(selection){
    // the chart function builds the heatmap.
    // note: selection is passed in from the .call(chart_obj), which is the same as chart_obj(d3.select('.stuff'))
    var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
    var stop_dates = [];
    selection.each(function(csv){
        var sp=0;
        // format data
        csv.forEach(function(d) {
          d[x_col] = parseTime(d[x_col]);
          d[y_col] = +d[y_col];
          d['eta'] = +d['eta'];
          d['theta_breach']=0;
          if (d.eta >= theta){
            if (sp==0){
              stop_dates.push(d[x_col])
            }
            sp = 1
            d['theta_breach']=1
          }else{
            if (sp==1){
              stop_dates.push(d[x_col])
            }
            sp = 0
          };
          })

    var svg = selection.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the csv
    var date_range = d3.extent(csv, function(d) { return d[x_col]; });
    x.domain(date_range);
    var y_range = [0, d3.max(csv, function(d) { return d[y_col]; })];
    y.domain(y_range);

    if (add_vgradient){
      // Add a vertical gradient to line
        svg.append('linearGradient')
          .attr('id','line-vgradient')
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1',0).attr('y1', y(theta*0.5))
          .attr("x2", 0).attr("y2", y(theta))
          .selectAll("stop")
            .data(gradient_color)
          .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });
    }else if(add_hgradient){
      /*
      var hgradient = svg.append('linearGradient')
          .attr('id','line-hgradient')
          .attr('gradientUnits', 'userSpaceOnUse');
      stop_dates.forEach(function(d,i){
          var n = i+1;
          hgradient.attr('x'+n,x(d))
          })
      */
      //console.log(stop_dates)
      var date_start = date_range[0];
      var date_end = date_range[1];
      //var date_75 = new Date(date_end.getTime()-((date_end.getTime()-date_start.getTime())/4) );
      // i = 0 turns off Steelblue (turns on red) and i = 1 turns on Steelblue (turns off red)
      var gradient_stuff = []
        , x_axis_len = x(date_end) - x(date_start);
      stop_dates.forEach(function(d,i){
        p = (x(d)/x_axis_len)*100
        if (i%2==0){
            on = 'red'
            off = 'steelblue'
            if (i==0){
              prev_p = 0
            }
          }else if (i%2==1){
              on = 'steelblue'
              off = 'red'
        }
        console.log([off,on,prev_p,p])
        gradient_stuff.push({offset: prev_p+"%", color: off})
        gradient_stuff.push({offset: p+"%", color: off})
        gradient_stuff.push({offset: p+"%", color: on})
        if (i==(stop_dates.length-1)){
            gradient_stuff.push({offset: "100%", color: on})
        }
        prev_p = p
      })
      console.log(gradient_stuff)
        svg.append('linearGradient')
          .attr('id','line-hgradient')
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1',x(date_start)).attr('y1',0)
          .attr("x2",x(date_end)).attr("y2", 0)
          .selectAll("stop")
            .data(gradient_stuff)
          .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });
    }else{
      //console.log(csv)
    }
    // Add the value_line path.
    svg.append("path")
        .data([csv])
        .attr("class", "line")
        .attr("d", value_line)
        .style('fill',line_fill)
        .style('stroke',line_stroke);
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
    x = d3.scaleTime().range([0, width])
    return chart;
  };

  chart.height = function(h) {
    if (!arguments.length) { return height; }
    height = h;
    y = d3.scaleLinear().range([height, 0])
    value_line = d3.area()
      .x(function(d) { return x(d[x_col]); })
      .y0(y(0))
      .y1(function(d) { return y(d[y_col]); });
    return chart;
  };

  chart.graph_type = function(t,n) {
    if (!arguments.length) { return value_line; }
    if (t=='line'){
      value_line = d3.line()
      .x(function(d) { return x(d[x_col]); })
      .y(function(d) { return y(d[y_col]); });
    }else if (t=='area'){
      valueline = d3.area()
        .x(function(d) { return x(d[x_col]); })
        .y0(y(0))
        .y1(function(d) { return y(d[y_col]); });
    }
    return chart;
  };

  chart.line_fill = function(f,n) {
    if (!arguments.length) { return line_fill; }
      line_fill = f;
    return chart;
  };

  chart.line_stroke = function(f,n) {
    if (!arguments.length) { return line_stroke; }
      line_stroke = f;
    return chart;
  };

  chart.x_col = function(x) {
    if (!arguments.length) { return x_col; }
    x_col = x;
    return chart;
  };

  chart.y_col = function(y) {
    if (!arguments.length) { return y_col; }
    y_col = y;
    return chart;
  };

  chart.gradient_color = function(c) {
    if (!arguments.length) { return gradient_color; }
    gradient_color = c;
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

  chart.add_vgradient = function(v){
    if (!arguments.length) { return add_vgradient; }
    add_vgradient=v
    return chart;
  };

  chart.add_hgradient = function(h){
    if (!arguments.length) { return add_hgradient; }
    add_hgradient=h
    return chart;
  };
  return chart
}
