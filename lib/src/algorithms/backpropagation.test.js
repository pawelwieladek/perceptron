var Backpropagation = require("./backpropagation");
var Network = require("../perceptron/network");

describe("Backpropagation", function() {

    var backpropagation;
    var options = {
        network: {},
        activationFunction: {}
    };

    beforeEach(function() {
        options.network = new Network();
        options.network.setInputSize(3);
        options.network.addHiddenLayer(4);
        options.network.addOutputLayer(2);
        options.activationFunction = function(x) { return x };
        backpropagation = new Backpropagation(options);

        // Because mathematical operations are not full accurate
        // we will need to explicitly specify tested accuracy
        round = function (value, digits) {
            var accuracy = Math.pow(10,digits);
            return Math.round(value * accuracy) / accuracy;
        }
    });

    it("initialized weights", function() {

        backpropagation.bipolar = true;
        backpropagation.initializeWeights();

        backpropagation.network.layers[0].neurons.forEach(function (neuron) {
            expect(neuron.bias).toBeLessThan(1);
            expect(neuron.bias).not.toBeLessThan(-1);
            neuron.weights.forEach(function (weight) {
                expect(weight).toBeLessThan(1);
                expect(weight).not.toBeLessThan(-1);
            });
        });

        backpropagation.bipolar = false;
        backpropagation.initializeWeights();

        backpropagation.network.layers[0].neurons.forEach(function (neuron) {
            expect(neuron.bias).toBeLessThan(1);
            expect(neuron.bias).not.toBeLessThan(0);
            neuron.weights.forEach(function (weight) {
                expect(weight).toBeLessThan(1);
                expect(weight).not.toBeLessThan(0);
            });
        });

        backpropagation.weightingFunction = function () {
            return 0.5;
        };
        backpropagation.initializeWeights();

        backpropagation.network.layers[0].neurons.forEach(function (neuron) {
            expect(neuron.bias).toEqual(0.5);
            neuron.weights.forEach(function (weight) {
                expect(weight).toEqual(0.5);
            });
        });
    });

    it("feeds forward", function() {
        var inputs = [-0.2, 0.0, 0.4];

        backpropagation.weightingFunction = function () {
            return 0.5;
        };
        backpropagation.initializeWeights();
        backpropagation.feedForward(inputs);

        backpropagation.network.layers[0].neurons.forEach(function (neuron) {
            expect(neuron.output).toEqual(0.6);
        });

        backpropagation.network.layers[1].neurons.forEach(function (neuron) {
            expect(neuron.output).toEqual(1.7);
        });

    });

    it("calculates error signal for the output layer", function() {
        var inputs = [-0.2, 0.0, 0.4];
        var outputs = [2.0,2.0];

        backpropagation.weightingFunction = function () {
            return 0.5;
        };
        backpropagation.initializeWeights();
        backpropagation.feedForward(inputs);
        backpropagation.updateErrorSignal(outputs);
        backpropagation.network.layers[1].neurons.forEach(function (neuron) {
            expect(round(neuron.errorSignal,3)).toEqual(-0.357);
        });
    });

    it("calculates neurons signal error", function() {
        var inputs = [-0.2, 0.0, 0.4];
        var outputs = [2.0,2.0];

        backpropagation.weightingFunction = function () {
            return 0.5;
        };
        backpropagation.initializeWeights();
        backpropagation.feedForward(inputs);
        backpropagation.updateErrorSignal(outputs);
        backpropagation.network.layers[0].neurons.forEach(function (neuron) {
            expect(round(neuron.errorSignal,5)).toEqual(-0.08568);
        });
    });

    it("updates bias and nodes weights (backpropagates the error)", function() {
        var inputs = [-0.2, 0.0, 0.4];
        var outputs = [2.0,2.0];

        // Because mathematical operations are not full accurate
        // we have to explicitly specify tested accuracy
        var accuracy = Math.pow(10,8); // check 8 significant digits

        backpropagation.weightingFunction = function () {
            return 0.5;
        };
        backpropagation.initializeWeights();
        backpropagation.feedForward(inputs);
        backpropagation.updateErrorSignal(outputs);
        backpropagation.backPropagateError();
        backpropagation.network.layers[1].neurons.forEach(function (neuron) {
            expect(round(neuron.bias,7)).toEqual(0.49643);

            var expectedWeights = [0.497858,0.497858,0.497858,0.497858];
            neuron.weights.forEach(function (weight, i) {
                expect(round(weight,8)).toEqual(expectedWeights[i]);
            });
        });
        backpropagation.network.layers[0].neurons.forEach(function (neuron) {
            expect(round(neuron.bias,7)).toEqual(0.4991432);

            var expectedWeights = [0.50017136,0.5,0.49965728];
            neuron.weights.forEach(function (weight, i) {
                expect(round(weight,8)).toEqual(expectedWeights[i]);
            });
        });
    });

    it("calculates global error", function() {

        var inputs = [
            [-0.2, 0.0, 0.4]
        ];

        var outputs = [
            [2.0,2.0]
        ];

        // Because mathematical operations are not full accurate
        // we have to explicitly specify tested accuracy
        var accuracy = Math.pow(10,8); // check 8 significant digits

        backpropagation.weightingFunction = function () {
            return 0.5;
        };
        backpropagation.learn(inputs,outputs);
        expect(round(backpropagation.globalError,2)).toEqual(0.09);
    });

});