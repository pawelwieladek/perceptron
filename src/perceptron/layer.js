var Neuron = require("./neuron");

function Layer(numInputs, numNeurons) {
    this.neurons = [];
    this.inputs = [];

    for(var j = 0; j < numInputs; j++) {
        this.inputs.push(0.0);
    }

    for(var i = 0; i < numNeurons; i++) {
        this.neurons.push(new Neuron(numInputs));
    }
}

module.exports = Layer;