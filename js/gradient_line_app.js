
(function() {
  // call the heatmap constructor
  var gl_obj = gradient_line();
  // the number of elements in this array determines the number of heatmaps created
  var dataPathArray = ['scotus_analyzed.csv'
                      ];
  // create a graph for each dataset
  dataPathArray.forEach(function(dataFileName){
    console.log(dataFileName)

    var data = d3.csv('./data/'+dataFileName,function(error, data){
      if (error) return console.warn(error);

      gl_obj.title( 'Example:: '+dataFileName )
      var container = d3.select("body").selectAll('#'+dataFileName);

      container.data([data])
          .enter()
          .append("div")
          .attr('id',dataFileName)
          .call(gl_obj);

    })

  })
}())
