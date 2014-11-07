function Neuron(numWeights) {
    this.output = null;
    this.weights = [];
    this.bias = 0.0;
    this.weightsDiff = [];
    this.biasDiff = 0.0;
    this.errorSignal = null;

    for (var i = 0; i < numWeights; i++) {
        this.weights.push(0.0);
        this.weightsDiff.push(0.0);
    }
}

module.exports = Neuron;