# Tye Chart
We can tie together two charts through a trend detections score that we
call ETA. To start, we use data in this format: 
<pre>
date,count,eta
2014-08-24 00:00:00,76.0,0
2014-08-24 02:00:00,91.0,0.34
2014-08-24 04:00:00,69.0,0.45
2014-08-24 06:00:00,76.0,0.17
2014-08-24 08:00:00,39.0,0.84
2014-08-24 10:00:00,36.0,0.094
2014-08-24 12:00:00,59.0,0.77
2014-08-24 14:00:00,58.0,0.025
2014-08-24 16:00:00,58.0,0 
</pre>

The config file is available in js/app.js, which is where we indicate
the data path:
<pre>
var data_path = './data/scotus_analyzed.csv';
</pre>
To run the chart on a local server, we can visit the tye_chart directory and run a
server.  
<pre>
$cd trend_detection_graph/src/tye_chart

$python -m SimpleHTTPServer 8080
...OR... 
$python3 -m http.server 8080
</pre>

We then open a browser to `localhost:8080`.
