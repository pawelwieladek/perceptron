var Parser = require("../utils/parser");
var Backpropagation = require("../algorithms/backpropagation");
var Network = require("../perceptron/network");
var Q = require("q");
var _ = require("underscore");
var path = require("path");

function RegressionProblem() {
    this.inputs = [];
    this.outputs = [];
    this.backpropagation = {};
}

RegressionProblem.prototype.initializeSamples = function (trainingSet) {
    var inputs = [];
    var outputs = [];
    trainingSet.forEach(function(point) {
        inputs.push([parseFloat(point.x)]);
        outputs.push([parseFloat(point.y)]);
    });
    this.inputs = inputs;
    this.outputs = outputs;
};

RegressionProblem.prototype.initializeBackpropagation = function () {
    var network = new Network();
    network.setInputSize(1);
    network.addHiddenLayer(4);
    network.addOutputLayer(1);

    var sigmoid = function (x) {
        return 1 / (1 + Math.exp(-x));
    };

    //var max = _.max(this.outputs, function(x) {
    //    return x[0];
    //})[0];
    //
    //var normalizeFunction = function(x) {
    //    return max * x;
    //};

    this.backpropagation = new Backpropagation({
        network: network,
        activationFunction: sigmoid
    });
};

RegressionProblem.prototype.learn = function(trainingInputs) {
    this.initializeSamples(trainingInputs);
    this.initializeBackpropagation();
    this.backpropagation.learn(this.inputs, this.outputs);
};

RegressionProblem.prototype.test = function(testInput) {
    this.backpropagation.feedForward(testInput);
    return this.backpropagation.network.outputs;
};

RegressionProblem.prototype.solve = function() {
    var trainingFile = "../../res/regression.train.csv";
    var testFile = "../../res/regression.test.csv";

    var haveParsedTestFile = function() {
        return Parser.parse(path.join(__dirname, testFile))
    }.bind(this);

    var haveLearned = function (trainingSet) {
        return Q.fcall(this.learn.bind(this), trainingSet);
    }.bind(this);

    var haveTested = function(testSet) {
        return Q.fcall(function() {
            var result = [];
            testSet.forEach(function(input) {
                input = parseFloat(input.x);
                result.push({ input: input, output: this.test([input])[0] });
            }.bind(this));
            return result;
        }.bind(this));
    }.bind(this);

    return Parser.parse(path.join(__dirname, trainingFile))
        .then(haveLearned)
        .then(haveParsedTestFile)
        .then(haveTested);
};
module.exports = RegressionProblem;