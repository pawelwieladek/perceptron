var Layer = require("./layer");

function Network() {
    this.layers = [];
    this.inputs = [];
    this.outputs = [];
}

Network.prototype.addInputLayer = function(size) {
    for (var i = 0; i < size; i++) {
        this.inputs.push(0.0);
    }
};

Network.prototype.addHiddenLayer = function(size) {
    if (this.inputs.length === 0) {
        throw new Error("Define input layer first.");
    }

    if (this.layers.length === 0) {
        this.layers.push(new Layer(this.inputs.length, size));
    } else {
        this.layers.push(new Layer(this.layers[this.layers.length - 1].neurons.length, size));
    }
};

Network.prototype.addOutputLayer = function(size) {
    if (this.layers.length === 0) {
        throw new Error("Define hidden layer first.");
    }

    this.layers.push(new Layer(this.layers[this.layers.length - 1].neurons.length, size));

    for (var i = 0; i < size; i++) {
        this.outputs.push(0.0);
    }
};

Network.prototype.initializeWeights = function(weightFunction) {
    if (typeof weightFunction !== "function" || typeof weightFunction() !== "number") {
        throw new Error("Initialize weight with weight function that returns weight value");
    }

    this.layers.forEach(function(layer) {
        layer.neurons.forEach(function(neuron) {
            for (var i = 0; i < neuron.weights.length; i++) {
                neuron.updateWeight(i, weightFunction());
            }
        });
    });
};

module.exports = Network;