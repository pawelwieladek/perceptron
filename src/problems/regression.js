var Parser = require("../utils/parser");
var Backpropagation = require("../algorithms/backpropagation");
var Network = require("../perceptron/network");
var Q = require("q");

function RegressionProblem() {

}

RegressionProblem.prototype.solve = function() {
    var deferred = Q.defer();

    Parser.parse("../resources/regression.train.csv").done(function(trainingSet) {
        var inputs = [];
        var outputs = [];
        trainingSet.forEach(function(point) {
            inputs.push([parseFloat(point.x)]);
            outputs.push([parseFloat(point.y)]);
        });

        var network = new Network();
        network.setInputSize(1);
        network.addHiddenLayer(4);
        network.addOutputLayer(1);

        var sigmoid = function (x) {
            return 1 / (1 + Math.exp(-x));
        };

        var backpropagation = new Backpropagation({
            network: network,
            activationFunction: sigmoid
        });

        backpropagation.learn(inputs, outputs);

        deferred.resolve(backpropagation.network.outputs);
    });

    return deferred.promise;
};

module.exports = RegressionProblem;