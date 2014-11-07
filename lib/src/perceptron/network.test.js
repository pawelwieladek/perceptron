var Network = require("./network");

describe("Network", function() {

    var network;

    beforeEach(function() {
        network = new Network();
    });

    it("is initialized empty", function() {
        expect(network.layers.length).toEqual(0);
        expect(network.inputs.length).toEqual(0);
        expect(network.outputs.length).toEqual(0);
    });

    it("has input layer initialized with zero", function() {
        network.setInputSize(3);

        expect(network.inputs.length).toEqual(3);
        network.inputs.forEach(function(input) {
            expect(input).toEqual(0.0);
        });
    });

    it("has input layer initialized with array", function() {
        var inputs = [1.0, 2.0];
        network.setInputs(inputs);

        expect(network.inputs.length).toEqual(2);
        expect(network.inputs[0]).toEqual(1.0);
        expect(network.inputs[1]).toEqual(2.0);
    });

    it("forbids adding hidden layer without input layer", function() {
        expect(network.addHiddenLayer).toThrow();
    });

    it("adds one hidden layer with proper number of inputs and neurons", function() {
        network.setInputSize(3);
        network.addHiddenLayer(5);

        expect(network.layers.length).toEqual(1);
        expect(network.layers[0].inputs.length).toEqual(3);
        expect(network.layers[0].neurons.length).toEqual(5);
    });

    it("adds more hidden layer with proper number of inputs and neurons", function() {
        network.setInputSize(3);
        network.addHiddenLayer(5);
        network.addHiddenLayer(7);

        expect(network.layers.length).toEqual(2);
        expect(network.layers[0].inputs.length).toEqual(3);
        expect(network.layers[0].neurons.length).toEqual(5);
        expect(network.layers[1].inputs.length).toEqual(5);
        expect(network.layers[1].neurons.length).toEqual(7);
    });

    it("forbids adding output layer without hidden layer", function() {
        expect(network.addOutputLayer).toThrow();
    });

    it("adds output layer with proper number of inputs and neurons", function() {
        network.setInputSize(3);
        network.addHiddenLayer(5);
        network.addOutputLayer(2);

        expect(network.layers.length).toEqual(2);
        expect(network.layers[0].inputs.length).toEqual(3);
        expect(network.layers[0].neurons.length).toEqual(5);
        expect(network.layers[1].inputs.length).toEqual(5);
        expect(network.layers[1].neurons.length).toEqual(2);
        expect(network.outputs.length).toEqual(2);
        network.outputs.forEach(function(output) {
            expect(output).toEqual(0.0);
        });
    });

    it("initializes weights correctly", function() {
        network.setInputSize(3);
        network.addHiddenLayer(5);
        network.addOutputLayer(2);

        var wrongArgument = [];

        expect(function () {
            network.initializeWeights(wrongArgument);
        }).toThrow();

        var wrongFunction = function() {
            return {};
        };

        expect(function () {
            network.initializeWeights(wrongFunction);
        }).toThrow();

        var correctFunction = function() {
            return 0.5;
        };

        expect(function () {
            network.initializeWeights(correctFunction);
        }).not.toThrow();

        network.initializeWeights(correctFunction);
        network.layers[0].neurons.forEach(function(neuron) {
            expect(neuron.weights.length).toEqual(3);
            neuron.weights.forEach(function(weight) {
                expect(weight).toEqual(0.5);
            });
        });
    });
});