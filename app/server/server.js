var express = require('express');
var app = express();
var path = require("path");
var _ = require("underscore");
var parse = require("csv-parse");
var bodyParser = require('body-parser');
var Q = require('q');

var Perceptron = require("../../lib/src/perceptron");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/api/perceptron', function (req, res) {
    var data = {
        learningSet: [],
        testingSet: []
    };
    Q.nfcall(parse, req.body.learningSet, { columns: true, skip_empty_lines: true })
        .then(function(learningSet) {
            return Q.fcall(function() {
                data.learningSet = _.map(learningSet, function(pattern) {
                    return _.values(pattern).map(function(val) { return parseFloat(val); } );
                });
            });
        })
        .then(function() {
            return Q.nfcall(parse, req.body.testingSet, { columns: true, skip_empty_lines: true })
        })
        .then(function(testingSet) {
            return Q.fcall(function() {
                data.testingSet = _.map(testingSet, function(pattern) {
                    return _.values(pattern).map(function(val) { return parseFloat(val); } );
                });
            });
        })
        .then(function() {
            var max = Math.abs(_.max(_.flatten(data.learningSet.concat(data.testingSet))));

            var learningSet = [];
            data.learningSet.forEach(function(pattern) {
                learningSet.push({
                    input: _.map(pattern.slice(0, 1), function(x) { return x / max }),
                    output: _.map(pattern.slice(1, 2), function(x) { return x / max })
                })
            });

            var testingSet = _.map(data.testingSet, function(test) {
                return _.map(test, function(x) { return x / max } )
            });

            var perceptron = new Perceptron({
                activation: "tanh"
            });
            perceptron.train(learningSet);

            var results = [];
            testingSet.forEach(function(test) {
                var result = _.map(perceptron.run(test), function(x) {
                    return x * max;
                });
                results.push(result);
            });

            results = _.zip(data.testingSet, results);

            results = _.map(results, function(result) {
                return {
                    x: result[0][0],
                    y: result[1][0]
                }
            });

            learningSet = _.map(learningSet, function(learn) {
                return {
                    x: max * learn.input[0],
                    y: max * learn.output[0]
                }
            });

            var response = [learningSet, results];

            res.send(response);
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