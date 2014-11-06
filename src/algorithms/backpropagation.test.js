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
    });

    it("sets inputs", function() {
        var inputVector = [-2.0, 0.0, 2.0];

        backpropagation.setInputs(inputVector);

        expect(backpropagation.network.inputs.length).toEqual(3);
        expect(backpropagation.network.inputs).toEqual(inputVector);
        expect(backpropagation.network.layers[0].inputs.length).toEqual(3);
        expect(backpropagation.network.layers[0].inputs).toEqual(inputVector);
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
        backpropagation.setInputs(inputs);
        backpropagation.feedForward();

        backpropagation.network.layers[0].neurons.forEach(function (neuron) {
            expect(neuron.output).toEqual(0.6);
        });

        backpropagation.network.layers[1].neurons.forEach(function (neuron) {
            expect(neuron.output).toEqual(1.7);
        });

    });
});