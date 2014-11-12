var superagent = require("superagent");

require("d3");
require("nvd3");

nv.addGraph(function() {
    var chart = nv.models.scatterChart()
        .interactive(false)
        .color(d3.scale.category10().range());

    //Axis settings
    chart.xAxis.tickFormat(d3.format('.02f'));
    chart.yAxis.tickFormat(d3.format('.02f'));

    superagent.get("/api/regression", function(res) {
        d3.select('#chart svg')
            .datum(res.body)
            .call(chart);
    });

    return chart;
});