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

    // TODO: remove this return, it's only for debug reason.
    return this.backpropagation.network.outputs;
};

RegressionProblem.prototype.solve = function() {
    var self = this;
    var filepath = "../../res/regression.train.csv";
    return Parser.parse(path.join(__dirname, filepath))
        .then(function(trainingSet) {
            return Q.fcall(self.learn.bind(self), trainingSet);
        });
        // TODO: implement RegressionProblem.prototype.test method
        // test method should returns output vector and global error
        // How to do it:
        //
        //.then(function() {
        //    return Q.fcall(self.test.bind(self), testingSet)
        //});
        //
        // Checkout Q library: https://github.com/kriskowal/q
        // self.test.bind(self) means that "this" in self.test method will be self
        // due to the fact that Q unbinds "this"
        // Checkout bind method: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
};

module.exports = RegressionProblem;