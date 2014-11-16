var express = require('express');
var app = express();
var path = require("path");
var _ = require("underscore");

// API
var RegressionProblem = require("../../lib/src/problems/regression");
app.get('/api/regression/testing', function (req, res) {
    var regression = new RegressionProblem();
    regression.solve()
        .then(function(results) {
            var chart = [];
            results.forEach(function(result) {
                chart.push({
                    x: result.input,
                    y: result.output
                });
            });
            res.send(chart);
        });
});
app.get('/api/regression/learning', function (req, res) {
    var regression = new RegressionProblem();
    regression.getTrainingSet()
        .then(function(points) {
            res.send(points);
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