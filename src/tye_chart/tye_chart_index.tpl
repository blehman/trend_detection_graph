<!DOCTYPE html>
<html>

  <head>
    <meta charset="UTF-8">
    <title>Tye Chart</title>
    <!-- D3 -->
    <!--<script src="https://d3js.org/d3.v4.js"></script>-->
    <!--Graph -->
    <script src="src/tye_chart/js/gradient_line.js"></script>
    <script src="src/tye_chart/js/hline_slider.js"></script>
    <!-- File Saver-->
    <script src="src/tye_chart/js/filesaver.js"></script>
    <!-- CSS -->
    <link href="src/tye_chart/css/style.css" type="text/css" rel="stylesheet">
  </head>

  <body>
    <!-- Buttons -->
    <input id="save"   type="image" title="download dates" src="src/tye_chart/img/download-icon.png" alt="download dates" width=40px>
    <!-- GRAPH -->
    <script>
      var x = [1,2]
      console.log(d3.max(x))
    </script>
    <script>
      <!-- GET D3-->
      function load_lib(url, callback){
        console.log('INSIDE load_lib')
        var s = document.createElement('script');
        s.src = url;
        s.async = true;
        s.onreadystatechange = s.onload = callback;
        s.onerror = function(){console.warn("failed to load library " + url);};
        document.getElementsByTagName("head")[0].appendChild(s);
      }
      if ( typeof(d3) !== "undefined" ){
          console.log('d3 is defined');
          graph_{{graph_id}}();
      }else if(typeof define === "function" && define.amd){
        console.log('trying d3 with require');
        require.config({paths: {d3: "{{ d3_url[:-3] }}"}});
            console.log('trying {{ d3_url[:-3] }}');

            require(["d3"], function(d3){
              window.d3 = d3;
              console.log('loaded d3 with require');
              graph_{{grah_id}}();
        });
      }else{
          consle.log('trying to load from load_lib');
          load_lib("//d3js.org/d3.v4.min.js", {{grap_id}}());
      }
    </script>
    <script src="src/tye_chart/js/app.tpl.js"></script>
  </body>

</html>

