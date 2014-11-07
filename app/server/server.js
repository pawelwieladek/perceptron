var express = require('express');
var app = express();
var path = require("path");

// API
var RegressionProblem = require("../../lib/src/problems/regression");
app.get('/regression', function (req, res) {
    var regression = new RegressionProblem();
    regression.solve()
        .then(function(result) {
            res.send(result);
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