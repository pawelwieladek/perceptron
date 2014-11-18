var _ = require("underscore");

var Perceptron = function(options) {
    options = options || {};
    this.bias = options.bias != false;
    this.bipolar = options.bipolar != false;
    this.learningRate = options.learningRate || 0.3;
    this.momentum = options.momentum || 0.1;
    this.hiddenLayers = options.hiddenLayers;
    this.activation = options.activation || "sigmoid";
};

Perceptron.prototype = {
    initialize: function (sizes) {
        this.sizes = sizes;
        this.outputLayer = this.sizes.length - 1;

        this.biases = [];
        this.weights = [];
        this.outputs = [];

        this.deltas = [];
        this.changes = [];
        this.errors = [];

        for (var layer = 0; layer <= this.outputLayer; layer++) {
            var size = this.sizes[layer];
            this.deltas[layer] = zeros(size);
            this.errors[layer] = zeros(size);
            this.outputs[layer] = zeros(size);

            if (layer > 0) {
                if(this.bias) {
                    this.biases[layer] = this.random(size);
                }
                this.weights[layer] = new Array(size);
                this.changes[layer] = new Array(size);

                for (var node = 0; node < size; node++) {
                    var prevSize = this.sizes[layer - 1];
                    this.weights[layer][node] = this.random(prevSize);
                    this.changes[layer][node] = zeros(prevSize);
                }
            }
        }
    },

    run: function (input) {
        this.outputs[0] = input;  // set output state of input layer

        for (var layer = 1; layer <= this.outputLayer; layer++) {
            for (var node = 0; node < this.sizes[layer]; node++) {
                var weights = this.weights[layer][node];

                var sum = 0;
                if (this.bias) {
                    sum += this.biases[layer][node];
                }
                for (var k = 0; k < weights.length; k++) {
                    sum += weights[k] * input[k];
                }
                this.outputs[layer][node] = this.activationFunction(sum);
            }
            var output = input = this.outputs[layer];
        }
        return output;
    },

    train: function (data, options) {

        options = options || {};
        var iterations = options.iterations || 20000;
        var errorThreshold = options.errorThreshold || 0.005;
        var log = options.log || false;
        var logPeriod = options.logPeriod || 10;
        var learningRate = options.learningRate || this.learningRate || 0.3;
        var callback = options.callback;
        var callbackPeriod = options.callbackPeriod || 10;

        var inputSize = data[0].input.length;
        var outputSize = data[0].output.length;

        var hiddenSizes = this.hiddenLayers;
        if (!hiddenSizes) {
            hiddenSizes = [ Math.max(3, Math.floor(inputSize / 2)) ];
        }
        var sizes = _([inputSize, hiddenSizes, outputSize]).flatten();
        this.initialize(sizes);

        var globalError = 1;
        for (var i = 0; i < iterations && globalError > errorThreshold; i++) {
            var errorSum = 0;
            for (var j = 0; j < data.length; j++) {
                this.learn(data[j].input, data[j].output, learningRate);
                errorSum += meanSquaredError(this.errors[this.outputLayer]);
            }
            globalError = errorSum / data.length;

            if (log && (i % logPeriod == 0)) {
                console.log("iterations:", i, "training error:", globalError);
            }
            if (callback && (i % callbackPeriod == 0)) {
                callback({error: globalError, iterations: i});
            }
        }

        return {
            error: globalError,
            iterations: i
        };
    },

    learn: function (input, target, learningRate) {
        learningRate = learningRate || this.learningRate;

        // forward propagate
        this.run(input);

        // back propagate
        this.calculateDeltas(target);
        this.adjustWeights(learningRate);
    },

    calculateDeltas: function (target) {
        for (var layer = this.outputLayer; layer >= 0; layer--) {
            for (var node = 0; node < this.sizes[layer]; node++) {
                var output = this.outputs[layer][node];

                var error = 0;
                if (layer == this.outputLayer) {
                    error = target[node] - output;
                }
                else {
                    var deltas = this.deltas[layer + 1];
                    for (var k = 0; k < deltas.length; k++) {
                        error += deltas[k] * this.weights[layer + 1][k][node];
                    }
                }
                this.errors[layer][node] = error;
                this.deltas[layer][node] = error * this.activationDerivative(output);
            }
        }
    },

    adjustWeights: function (learningRate) {
        for (var layer = 1; layer <= this.outputLayer; layer++) {
            var incoming = this.outputs[layer - 1];

            for (var node = 0; node < this.sizes[layer]; node++) {
                var delta = this.deltas[layer][node];

                for (var k = 0; k < incoming.length; k++) {
                    var change = this.changes[layer][node][k];

                    change = (learningRate * delta * incoming[k]) + (this.momentum * change);

                    this.changes[layer][node][k] = change;
                    this.weights[layer][node][k] += change;
                }
                if (this.bias) {
                    this.biases[layer][node] += learningRate * delta;
                }
            }
        }
    },

    activationFunction: function(x) {
        switch (this.activation) {
            case "tanh":
                return tanh(x);
            case "sigmoid":
            default:
                return sigmoid(x);
        }
    },

    activationDerivative: function(x) {
        switch (this.activation) {
            case "tanh":
                return tanhDerivative(x);
            case "sigmoid":
            default:
                return sigmoidDerivative(x);
        }
    },

    random: function(size) {
        if (this.bipolar) {
            return randoms(size, randomBipolar);
        } else {
            return randoms(size, randomUnipolar);
        }
    }
};

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x) {
    return (1 - x) * x;
}

function tanh(x) {
    if(x === Infinity) {
        return 1;
    } else if(x === -Infinity) {
        return -1;
    } else {
        var y = Math.exp(2 * x);
        return (y - 1) / (y + 1);
    }
}

function tanhDerivative(x) {
    return 1 - Math.pow(tanh(x), 2);
}

function randomBipolar() {
    return Math.random() * 0.4 - 0.2;
}

function randomUnipolar() {
    return Math.random() * 0.2;
}

function zeros(size) {
    var array = new Array(size);
    for (var i = 0; i < size; i++) {
        array[i] = 0;
    }
    return array;
}

function randoms(size, randomFunction) {
    var array = new Array(size);
    for (var i = 0; i < size; i++) {
        array[i] = randomFunction();
    }
    return array;
}

function meanSquaredError(errors) {
    // mean squared error
    var sum = 0;
    for (var i = 0; i < errors.length; i++) {
        sum += Math.pow(errors[i], 2);
    }
    return sum / errors.length;
}

module.exports = Perceptron;