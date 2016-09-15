
(function() {
  // call the heatmap constructor
  // set parameters for each graph
  var graph_config = [
    {
      graphName:'volume'
      , x_col:'date'
      , y_col:'count'
      , height: 400
      , graph_type:'line'
    }
    ,{
      graphName:'eta'
      , x_col:'date'
      , y_col: 'eta'
      , height: 140
      , graph_type:'area'
    }
  ]
  // create a graph for each dataset
  graph_config.forEach(function(graph){
    console.log(graph.graphName)

    var data_path = './data/scotus_analyzed.csv';

    var data = d3.csv(data_path,function(error, data){
      if (error) return console.warn(error);

      var chart_obj = gradient_line();
      chart_obj.title( 'Example:: '+graph.graphName )
      chart_obj.x_col(graph.x_col)
      chart_obj.y_col(graph.y_col)
      chart_obj.height(graph.height)
      chart_obj.graph_type(graph.graph_type)

      var container = d3.select("body").selectAll('#'+graph.graphName);

      container.data([data])
          .enter()
          .append("div")
          .attr('id',graph.graphName)
          .call(chart_obj);

    })

  })
}())
