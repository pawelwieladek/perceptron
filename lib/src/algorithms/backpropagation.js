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
    this.learningRate = config.learningRate || 0.01;
    this.momentum = config.momentum || 0.1;
    this.globalError = 0;
    this.learningOutputs = [];
}

function bipolarRandom() {
    return -1 + 2 * Math.random();
}

function unipolarRandom() {
    return Math.random();
}

function calculateOutputErrorSignal(outputLayer, outputVector) {
    var errorSignals = [];
    for (var i = 0; i < outputLayer.neurons.length; i++) {
        var nodeOutput = outputLayer.neurons[i].output;
        errorSignals.push((outputVector[i] - nodeOutput) * nodeOutput * (1 - nodeOutput));
    }
    return errorSignals;
}

function calculateHiddenErrorSignal(hiddenLayer, followingLayer) {
    var errorSignals = [];
    for (var hiddenNeuronId = 0; hiddenNeuronId < hiddenLayer.neurons.length; hiddenNeuronId++) {
        var weightedSignalErrorSum = 0;

        for (var followingNeuronId = 0; followingNeuronId < followingLayer.neurons.length; followingNeuronId++) {
            weightedSignalErrorSum += followingLayer.neurons[followingNeuronId].weights[hiddenNeuronId] * followingLayer.neurons[followingNeuronId].errorSignal;
        }
        errorSignals.push(hiddenLayer.neurons[hiddenNeuronId].output * (1 - hiddenLayer.neurons[hiddenNeuronId].output) * weightedSignalErrorSum);
    }
    return errorSignals;
}

function updateLayerWithErrorSignal(layer, errorSignals) {
    if (layer.neurons.length !== errorSignals.length) {
        throw new Error("Neurons length and error signals length are not the same");
    }

    for (var i = 0; i < layer.neurons.length; i++) {
        layer.neurons[i].errorSignal = errorSignals[i];
    }
}

Backpropagation.prototype.learn = function(inputs, outputs) {

    this.initializeWeights();

    for (var i = 0; i < inputs.length; i++) {

        this.feedForward(inputs[i]);
        this.saveLearningOutputs();
        this.updateErrorSignal(outputs[i]);
        this.backPropagateError();
    }
    this.calculateGlobalError(outputs);
};

Backpropagation.prototype.initializeWeights = function () {
    var weightingFunction;
    if (typeof this.weightingFunction !== "undefined") {
        weightingFunction = this.weightingFunction;
    } else {
        if (this.bipolar) {
            weightingFunction = bipolarRandom;
        } else {
            weightingFunction = unipolarRandom;
        }
    }
    this.network.initializeWeights(weightingFunction);
};

Backpropagation.prototype.feedForward = function(inputVector) {

    // Update inputs
    this.network.inputs = inputVector;
    this.network.layers[0].inputs = this.network.inputs;

    var normalizeFunction = this.normalizeFunction;
    var activationFunction = this.activationFunction;
    for (var layerId = 0; layerId < this.network.layers.length; layerId++) {
        for (var neuronId = 0; neuronId < this.network.layers[layerId].neurons.length; neuronId++) {
            var potential = 0;

            // Sum all weighted inputs
            for (var weightId = 0; weightId < this.network.layers[layerId].neurons[neuronId].weights.length; weightId++) {
                potential += this.network.layers[layerId].inputs[weightId] * this.network.layers[layerId].neurons[neuronId].weights[weightId];
            }

            // Add bias
            potential += this.network.layers[layerId].neurons[neuronId].bias;

            // Calculate output with normalized activation value
            this.network.layers[layerId].neurons[neuronId].output = normalizeFunction(activationFunction(potential));

            // Update following layer's input with current layer output
            if (layerId < this.network.layers.length - 1) {
                this.network.layers[layerId + 1].inputs[neuronId] = this.network.layers[layerId].neurons[neuronId].output;
            }
        }
    }

    this.network.updateOutputs();
};

Backpropagation.prototype.updateErrorSignal = function(outputVector) {
    var outputLayer = this.network.layers[this.network.layers.length - 1];

    // Update output layer error signal
    updateLayerWithErrorSignal(outputLayer, calculateOutputErrorSignal(outputLayer, outputVector));

    // Update backwards hidden layers' error signal
    for (var layerId = this.network.layers.length - 2; layerId >= 0; layerId--) {
        updateLayerWithErrorSignal(this.network.layers[layerId], calculateHiddenErrorSignal(this.network.layers[layerId], this.network.layers[layerId + 1]));
    }
};

Backpropagation.prototype.saveLearningOutputs = function() {
    var outputVector = [];
    this.network.layers[this.network.layers.length - 1].neurons.forEach( function(neuron) {
       outputVector.push(neuron.output);
    });
    this.learningOutputs.push(outputVector);
};

Backpropagation.prototype.backPropagateError = function() {
    for (var layerId = this.network.layers.length - 1; layerId >= 0; layerId--) {
        for (var neuronId = 0; neuronId < this.network.layers[layerId].neurons.length; neuronId++) {

            var neuronErrorSignal = this.network.layers[layerId].neurons[neuronId].errorSignal;

            // Update Bias weight difference
            this.network.layers[layerId].neurons[neuronId].biasDiff = this.learningRate * neuronErrorSignal + this.momentum * this.network.layers[layerId].neurons[neuronId].biasDiff;

            // Update Bias
            this.network.layers[layerId].neurons[neuronId].bias += this.network.layers[layerId].neurons[neuronId].biasDiff;

            // Update Weights
            for (var weightId = 0; weightId < this.network.layers[layerId].neurons[neuronId].weights.length; weightId ++) {

                // During analyzing first hidden layer the previous one is input layer
                if(layerId  == 0) {
                    // Update weights diff
                    this.network.layers[layerId].neurons[neuronId].weightsDiff[weightId] = this.learningRate * neuronErrorSignal * this.network.inputs[weightId] + this.momentum * this.network.layers[layerId].neurons[neuronId].weightsDiff[weightId];
                }
                else {

                    // Update weights diff
                    this.network.layers[layerId].neurons[neuronId].weightsDiff[weightId] = this.learningRate * neuronErrorSignal * this.network.layers[layerId - 1].neurons[weightId].output + this.momentum * this.network.layers[layerId].neurons[neuronId].weightsDiff[weightId];
                }

                // Update weights
                this.network.layers[layerId].neurons[neuronId].weights[weightId] += this.network.layers[layerId].neurons[neuronId].weightsDiff[weightId];
            }
        }
    }
};

Backpropagation.prototype.calculateGlobalError = function(outputs) {
    for (var outputId = 0; outputId < outputs.length; outputId++) {

        // Get output layer
        var outputLayer = this.network.layers[this.network.layers.length - 1];

        for (var neuronId = 0; neuronId < outputLayer.neurons.length; neuronId++) {

            // Calculate global error
            this.globalError += 0.5 * (Math.pow(outputs[outputId][neuronId] - this.learningOutputs[outputId][neuronId],2.0));
        }
    }
};

module.exports = Backpropagation;