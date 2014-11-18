var express = require('express');
var app = express();
var path = require("path");
var _ = require("underscore");
var parse = require("csv-parse");

var Perceptron = require("../../lib/src/perceptron");

app.post('/api/perceptron', function (req, res) {
    console.log(req.body);
    res.send("ok");
});

// Static files
app.use(express.static(path.join(__dirname, "../client/dist")));

// Run server
var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Perceptron server listening at http://%s:%s', host, port);

});