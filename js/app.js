
(function() {
  // call the heatmap constructor
  // set parameters for each graph
  var graph_config = [
    {
      graph_name:'volume'
      , x_col:'date'
      , y_col:'count'
      , height: 400
      , graph_type:'line'
      , line_stroke: 'url(#line-hgradient)'
      , line_fill:'none'
      , add_vgradient:false
      , add_hgradient:true
    }
    ,{
      graph_name:'eta'
      , x_col:'date'
      , y_col: 'eta'
      , height: 140
      , graph_type:'area'
      , line_stroke: '#111'
      , line_fill:'url(#line-vgradient)'
      , add_vgradient:true
      , add_hgradient: false
    }
  ,{
      graph_name:'slider'
    }
  ]
  var graphs = [];
  // create a line graph for each dataset
  var data_path = './data/scotus_analyzed.csv';
  var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
  d3.csv(data_path,function(error, data){
    data.forEach(function(d,i){
        d['date'] = parseTime(d['date']);
    })
    graph_config.forEach(function(config){
      var container, chart_obj;
      console.log(config.graph_name)

      if (error) return console.warn(error);
      if (config.graph_name != 'slider'){
        chart_obj = LineGraph();
        chart_obj.title( config.graph_name )
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

        container = d3.select("body").selectAll('#'+'hslider');
        chart_obj = HSlider();
        // create callback function
        chart_obj.callbackr(function(value) {
          graphs[1].theta(value);
          d3.selectAll("#eta").call(graphs[1]);
          graphs[0].theta(value);
          d3.selectAll("#volume").call(graphs[0]);
        });

      }
      container.data([data])
          .enter()
          .append("div")
          .attr('id',config.graph_name)
          .call(chart_obj);
    })
  })
  // create slider
}())
