function Neuron(numWeights) {
    this.output = null;
    this.weights = [];

    for (var i = 0; i < numWeights; i++) {
        this.weights.push(0.0);
    }
}

module.exports = Neuron;