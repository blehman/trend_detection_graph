
(function() {
  // call the heatmap constructor
  // set parameters for each graph
  // note: slider must be last item in config (if present)
  var graph_config = [
    {
      graph_name:'volume'
      , title:'Count of Tweets containing #SCOTUS'
      , x_col:'date'
      , y_col:'count'
      , margin: {top: 20, right: 20, bottom: 40, left: 50}
      , height: 200
      , graph_type:'line'
      , line_stroke: 'url(#line-hgradient)'
      , line_fill:'none'
      , add_vgradient:false
      , add_hgradient:true
      , theta: 4
    }
    ,{
      graph_name:'eta'
      , title:'Trend Detection Score (eta value)'
      , x_col:'date'
      , y_col: 'eta'
      , margin: {top: 20, right: 20, bottom: 40, left: 50}
      , height: 140
      , graph_type:'area'
      , line_stroke: '#111'
      , line_fill:'url(#line-vgradient)'
      , add_vgradient:true
      , add_hgradient: false
      , theta: 4
    }
  ,{
    graph_name:'slider'
    , x_col:'date'
    , y_col: 'eta'
    , margin: {top: 20, right: 20, bottom: 40, left: 50}
    , height: 140
    , theta: 4
    }
  ]
  var graphs = [];
  var data_path = './data/scotus_analyzed.csv';
  var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
  // get data once
  d3.csv(data_path,function(error, data){
    // set date format
    data.forEach(function(d,i){
        d['date'] = parseTime(d['date']);
    })
    // build graph types from config
    graph_config.forEach(function(config){
      if (error) return console.warn(error);

      var container, chart_obj;
      console.log(config.graph_name)

      if (config.graph_name != 'slider'){
        // set attributes for all graphs (non sliders)
        chart_obj = LineGraph();
        chart_obj.theta(config.theta)
        chart_obj.margin(config.margin)
        chart_obj.title( config.title )
        chart_obj.x_col( config.x_col )
        chart_obj.y_col( config.y_col )
        chart_obj.height(config.height)
        chart_obj.graph_type(config.graph_type,config.graph_name)
        chart_obj.add_vgradient(config.add_vgradient)
        chart_obj.add_hgradient(config.add_hgradient)
        chart_obj.line_fill(config.line_fill)
        chart_obj.line_stroke(config.line_stroke)
        container = d3.select("body").selectAll('#'+config.graph_name);
        graphs.push(chart_obj);
      }else{
        // set attributes for slider
        chart_obj = HSlider();
        chart_obj.theta(config.theta)
        chart_obj.margin(config.margin)
        chart_obj.height(config.height)
        // magic: create callback function
        chart_obj.callback(function(value) {
          graphs[1].theta(value);
          d3.selectAll("#eta").call(graphs[1]);
          graphs[0].theta(value);
          d3.selectAll("#volume").call(graphs[0]);
          chart_obj.theta(value)
          d3.selectAll("#slider").call(chart_obj);
        })

      }
      container = d3.select("body").selectAll('#'+config.graph_name);
      container.data([data])
          .enter()
          .append("div")
          .attr('id',config.graph_name)
          .call(chart_obj);
    })
  })
}())
