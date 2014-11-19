var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");

var Perceptron = require("../../lib/src/perceptron");
var Regression = require("./regression");
var Classification = require("./classification");

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
            },
            square: {
                learn: "../resources/square.learn.csv",
                test: "../resources/square.test.csv"
            }
        };

        var learnFile = null;
        var testFile = null;
        var inputSize = null;
        var outputSize = null;

        var problem;

        if (request.body.problemType === "regression") {
            learnFile = samples.regression.learn;
            testFile = samples.regression.test;
            inputSize = 1;
            outputSize = 1;

            problem = new Regression({
                inputSize: inputSize,
                outputSize: outputSize,
                learnFile: learnFile,
                testFile: testFile,
                activationFunction: request.body.activationFunction,
                numIterations: request.body.numIterations,
                learningRate: request.body.learningRate,
                momentum: request.body.momentum,
                bipolar: request.body.bipolar,
                bias: request.body.bias,
                hiddenLayers: request.body.hiddenLayers,
                errorThreshold: request.body.errorThreshold
            });

        } else if (request.body.problemType === "classification") {
            learnFile = samples.classification.learn;
            testFile = samples.classification.test;
            inputSize = 2;
            outputSize = 1;

            problem = new Classification({
                inputSize: inputSize,
                outputSize: outputSize,
                learnFile: learnFile,
                testFile: testFile,
                activationFunction: request.body.activationFunction,
                numIterations: request.body.numIterations,
                learningRate: request.body.learningRate,
                momentum: request.body.momentum,
                bipolar: request.body.bipolar,
                bias: request.body.bias,
                hiddenLayers: request.body.hiddenLayers,
                errorThreshold: request.body.errorThreshold
            });
        }

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