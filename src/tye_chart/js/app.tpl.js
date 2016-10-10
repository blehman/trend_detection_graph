(function() {
  // call the heatmap constructor
  // set parameters for each graph
  // note: slider must be last item in config (if present)
  var theta_starting = 0.4
  var graph_config = [
    {
      graph_name:'volume'
      , graph_id: 1
      , graph_name_id: 'volume_'+ 1
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
      , theta: theta_starting
    }
    ,{
      graph_name:'eta'
      , graph_id: 1
      , graph_name_id: 'eta_' + 1
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
      , theta: theta_starting
    }
  ,{
    graph_name:'slider'
    , graph_id: 1
    , graph_name_id: 'slider_' + 1
    , x_col:'date'
    , y_col: 'eta'
    , margin: {top: 20, right: 20, bottom: 40, left: 50}
    , height: 140
    , theta: theta_starting
    }
  ]
  var graphs = [];
  //var data_path = './data/scotus_analyzed.csv';
  //var data_path = './data/scotus_analyzed_mode_a.csv';
  var data_path = './data/scotus_analyzed_WeightedDataTemplates.csv';
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
        chart_obj.graph_id(config.graph_id)
        chart_obj.graph_name_id(config.graph_name_id)
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
        container = d3.select("body").selectAll('#'+config.graph_name+'_'+graph_id);
        graphs.push(chart_obj);
      }else{
        // set attributes for slider
        chart_obj = HSlider();
        chart_obj.theta(config.theta)
        chart_obj.graph_id(config.graph_id)
        chart_obj.graph_name_id(config.graph_name_id)
        chart_obj.margin(config.margin)
        chart_obj.height(config.height)
        // magic: create callback function
        chart_obj.callback(function(value) {
          graphs[1].theta(value);
          d3.selectAll('#eta_'+config.graph_id).call(graphs[1]);
          graphs[0].theta(value);
          d3.selectAll('#volume_'+config.graph_id).call(graphs[0]);
          chart_obj.theta(value)
          d3.selectAll('#slider_'+config.graph_id).call(chart_obj);
        })

      }
      container = d3.select('body').selectAll('#'+config.graph_name_id);
      container.data([data])
          .enter()
          .append('div')
          .attr('id',config.graph_name_id)
          .call(chart_obj);

    })
  })
}())
