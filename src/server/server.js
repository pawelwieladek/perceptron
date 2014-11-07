var express = require('express');
var app = express();
var path = require("path");

var RegressionProblem = require("../problems/regression");

//app.get('/regression', function (req, res) {
//    var regression = new RegressionProblem();
//    regression.solve().done(function(result) {
//        res.send(result);
//    });
//});

app.use(express.static(path.join(__dirname, "../app")));

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Perceptron server listening at http://%s:%s', host, port);

});