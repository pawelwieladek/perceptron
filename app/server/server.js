var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");

var Perceptron = require("../../lib/src/perceptron");
var Problem = require("./problem");

// Parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/perceptron', function (request, response) {

    if (request.body.source.name === "sample") {

        var samples = {
            regression: {
                learn: "../resources/regression.learn.csv",
                test: "../resources/regression.test.csv"
            },
            classification: {
                learn: "../resources/classification.learn.csv",
                test: "../resources/classification.test.csv"
            }
        };

        var learnFile = null;
        var testFile = null;

        if (request.body.problemType === "regression") {
            learnFile = samples.regression.learn;
            testFile = samples.regression.test;
        } else if (request.body.problemType === "classification") {
            learnFile = samples.classification.learn;
            testFile = samples.classification.test;
        }

        var problem = new Problem({
            learnFile: learnFile,
            testFile: testFile,
            activationFunction: request.body.activationFunction,
            numIterations: request.body.numIterations,
            learningRate: request.body.learningRate,
            momentum: request.body.momentum,
            bipolar: request.body.bipolar,
            bias: request.body.bias
        });

        problem.solve()
            .then(function(output) {
                response.send(output);
            });

    } else if (request.body.source.name === "custom") {
        console.log("custom");
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, "../client/dist")));

// Run server
var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Perceptron server listening at http://%s:%s', host, port);

});