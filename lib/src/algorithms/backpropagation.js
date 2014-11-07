var Network = require("../perceptron/network");

function Backpropagation(config) {
    if (typeof config.network === "undefined" || config.network === null) {
        throw new Error("Initialize Backpropagation with network.");
    }

    if (typeof config.activationFunction === "undefined" || config.activationFunction === null) {
        throw new Error("Initialize Backpropagation with activation function.");
    }

    this.network = config.network;
    this.activationFunction = config.activationFunction;
    this.normalizeFunction = config.normalizeFunction || function(x) { return x };
    this.bipolar = config.bipolar || false;
    this.weightingFunction = config.weightingFunction;
}

Backpropagation.prototype.learn = function(inputs, outputs) {
    if (inputs.length !== outputs.length) {
        throw new Error("Inputs array must be the same length as outputs array.");
    }

    this.initializeWeights();

    for (var i = 0; i < inputs.length; i++) {
        this.setInputs(inputs[i]);
        this.feedForward();
        this.updateErrorSignal(outputs[i]);
        // TODO: propagate error and update weights and biases
    }
};

Backpropagation.prototype.setInputs = function(inputVector) {
    this.network.inputs = inputVector;
    this.network.layers[0].inputs = this.network.inputs;
};

Backpropagation.prototype.initializeWeights = function () {
    var weightingFunction;
    if (typeof this.weightingFunction !== "undefined") {
        weightingFunction = this.weightingFunction;
    } else {
        if (this.bipolar) {
            weightingFunction = this.bipolarRandom;
        } else {
            weightingFunction = this.unipolarRandom;
        }
    }
    this.network.initializeWeights(weightingFunction);
};

Backpropagation.prototype.bipolarRandom = function() {
    return -1 + 2 * Math.random();
};

Backpropagation.prototype.unipolarRandom = function() {
    return Math.random();
};

Backpropagation.prototype.feedForward = function() {
    var normalizeFunction = this.normalizeFunction;
    var activationFunction = this.activationFunction;
    for (var layerId = 0; layerId < this.network.layers.length; layerId++) {
        for (var n = 0; n < this.network.layers[layerId].neurons.length; n++) {
            var potential = 0;

            // Sum all weighted inputs
            for (var w = 0; w < this.network.layers[layerId].neurons[n].weights.length; w++) {
                potential += this.network.layers[layerId].inputs[w] * this.network.layers[layerId].neurons[n].weights[w];
            }

            // Add bias
            potential += this.network.layers[layerId].neurons[n].bias;

            // Calculate output with normalized activation value
            this.network.layers[layerId].neurons[n].output = normalizeFunction(activationFunction(potential));

            // Update following layer's input with current layer output
            if (layerId < this.network.layers.length - 1) {
                this.network.layers[layerId + 1].inputs[n] = this.network.layers[layerId].neurons[n].output;
            }
        }
    }
    this.network.updateOutputs();
};

Backpropagation.prototype.updateErrorSignal = function(output) {
    var outputLayer = this.network.layers[this.network.layers.length - 1];

    // Update output layer error signal
    this.updateLayerWithErrorSignal(outputLayer, this.calculateOutputErrorSignal(outputLayer, output));

    // Update backwards hidden layers' error signal
    for (var layerId = this.network.layers.length - 2; layerId >= 0; layerId--) {
        this.updateLayerWithErrorSignal(this.network.layers[layerId], this.calculateHiddenErrorSignal(this.network.layers[layerId], this.network.layers[layerId + 1]));
    }
};

Backpropagation.prototype.calculateOutputErrorSignal = function (outputLayer, outputVector) {
    var errorSignals = [];
    for (var n = 0; n < outputLayer.neurons.length; n++) {
        var nodeOutput = outputLayer.neurons[n].output;
        errorSignals.push((outputVector[n] - nodeOutput) * nodeOutput * (1 - nodeOutput));
    }
    return errorSignals;
};

Backpropagation.prototype.calculateHiddenErrorSignal = function (hiddenLayer, followingLayer) {
    var errorSignals = [];
    for (var h = 0; h < hiddenLayer.neurons.length; h++) {
        var weightedSignalErrorSum = 0;

        for (var f = 0; f < followingLayer.neurons.length; f++) {
            weightedSignalErrorSum += followingLayer.neurons[f].weights[h] * followingLayer.neurons[f].errorSignal;
        }
        errorSignals.push(hiddenLayer.neurons[h].output * (1 - hiddenLayer.neurons[h].output) * weightedSignalErrorSum);
    }
    return errorSignals;
};

Backpropagation.prototype.updateLayerWithErrorSignal = function(layer, errorSignals) {
    if (layer.neurons.length !== errorSignals.length) {
        throw new Error("Neurons length and error signals length are not the same");
    }

    for (var n = 0; n < layer.neurons.length; n++) {
        layer.neurons[n].errorSignal = errorSignals[n];
    }
};

module.exports = Backpropagation;