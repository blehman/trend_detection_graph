
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
      , line_fill: 'none'
      , add_vgradient:false
    }
    ,{
      graph_name:'eta'
      , x_col:'date'
      , y_col: 'eta'
      , height: 140
      , graph_type:'area'
      , line_fill:'url(#line-gradient)'
      , add_vgradient:true
    }
  ]
  // create a graph for each dataset
  graph_config.forEach(function(graph){
    console.log(graph.graph_name)

    var data_path = './data/scotus_analyzed.csv';

    var data = d3.csv(data_path,function(error, data){
      if (error) return console.warn(error);

      var chart_obj = LineGraph();
      chart_obj.title( 'Example:: '+graph.graph_name )
      chart_obj.x_col(graph.x_col)
      chart_obj.y_col(graph.y_col)
      chart_obj.height(graph.height)
      chart_obj.graph_type(graph.graph_type,graph.graph_name)
      chart_obj.add_vgradient(graph.add_vgradient)
      chart_obj.line_fill(graph.line_fill)

      var container = d3.select("body").selectAll('#'+graph.graph_name);

      container.data([data])
          .enter()
          .append("div")
          .attr('id',graph.graph_name)
          .call(chart_obj);
    })
  })
}())
