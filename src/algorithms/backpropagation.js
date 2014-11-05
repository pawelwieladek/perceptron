var Network = require("../perceptron/network");

function Backpropagation(config) {
    if (typeof config.network === "undefined" || config.network === null) {
        throw new Error("Initialize Backpropagation with network.");
    }

    this.network = config.network;
}

Backpropagation.prototype.learn = function(inputs, ouputs) {
    if (typeof inputs !== "array" || typeof ouputs !== "array") {
        throw new Error("Provide input or output as arrays.");
    }
    if (inputs.length !== ouputs.length) {
        throw new Error("Inputs array must be the same length as outputs array.");
    }

    for (var i = 0; i < inputs.length; i++) {

        // Map inputs at network inputs
        this.network.inputs = inputs[i];

        // Feed forward

        // Update error signal

        // Propagate error backwards
    }
};

module.exports = Backpropagation;