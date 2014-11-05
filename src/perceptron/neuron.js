function Neuron(numWeights) {
    this.output = null;
    this.weights = [];

    for (var i = 0; i < numWeights; i++) {
        this.weights.push(0.0);
    }
}

Neuron.prototype.updateWeight = function(index, weight) {
    this.weights[index] = weight;
};

module.exports = Neuron;