var express = require('express');
var app = express();
var path = require("path");

// API
var RegressionProblem = require("../../lib/src/problems/regression");
app.get('/api/regression', function (req, res) {
    var regression = new RegressionProblem();
    regression.solve()
        .then(function(results) {
            var chart = {
                key: "Regression",
                values: []
            };
            results.forEach(function(result) {
                chart.values.push({
                    series: 0,
                    shape: "circle",
                    size: 0.1,
                    x: result.input,
                    y: result.output
                });
            });
            res.send([chart]);
        });
});

// Static files
app.use(express.static(path.join(__dirname, "../client/dist")));

// Run server
var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Perceptron server listening at http://%s:%s', host, port);

});