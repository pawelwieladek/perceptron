var Parser = require("../utils/parser");
var Backpropagation = require("../algorithms/backpropagation");
var Network = require("../perceptron/network");
var Q = require("q");
var path = require("path");

function RegressionProblem() {
    this.inputs = [];
    this.outputs = [];
    this.backpropagation = {};
}

RegressionProblem.prototype.initializeBackpropagation = function () {
    var network = new Network();
    network.setInputSize(1);
    network.addHiddenLayer(4);
    network.addOutputLayer(1);

    var sigmoid = function (x) {
        return 1 / (1 + Math.exp(-x));
    };

    this.backpropagation = new Backpropagation({
        network: network,
        activationFunction: sigmoid
    });
};

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

RegressionProblem.prototype.learn = function(trainingSet) {
    this.initializeSamples(trainingSet);
    this.initializeBackpropagation();
    this.backpropagation.learn(this.inputs, this.outputs);
    return this.backpropagation.network.outputs;
};

RegressionProblem.prototype.solve = function(filepath) {
    var self = this;
    return Parser.parse(path.join(__dirname, filepath))
        .then(function(trainingSet) {
            return Q.fcall(self.learn.bind(self), trainingSet);
    });
};

module.exports = RegressionProblem;