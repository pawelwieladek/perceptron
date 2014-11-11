var Parser = require("../utils/parser");
var Backpropagation = require("../algorithms/backpropagation");
var Network = require("../perceptron/network");
var Q = require("q");
var path = require("path");

function ClassificationProblem() {
    this.inputs = [];
    this.outputs = [];
    this.backpropagation = {};
}

ClassificationProblem.prototype.initializeBackpropagation = function () {
    var network = new Network();
    network.setInputSize(2);
    network.addHiddenLayer(4);
    network.addOutputLayer(3);

    var sigmoid = function (x) {
        return 1 / (1 + Math.exp(-x));
    };

    this.backpropagation = new Backpropagation({
        network: network,
        activationFunction: sigmoid
    });
    this.backpropagation.prototype.feedForward = function(inputVector) {
        // Update inputs
        this.network.inputs = inputVector;
        this.network.layers[0].inputs = this.network.inputs;

        for (var layerId = 0; layerId < this.network.layers.length; layerId++) {
            for (var neuronId = 0; neuronId < this.network.layers[layerId].neurons.length; neuronId++) {
                var potential = 0;

                // Sum all weighted inputs
                for (var weightId = 0; weightId < this.network.layers[layerId].neurons[neuronId].weights.length; weightId++) {
                    potential += this.network.layers[layerId].inputs[weightId] * this.network.layers[layerId].neurons[neuronId].weights[weightId];
                }

                // Add bias
                potential += this.network.layers[layerId].neurons[neuronId].bias;

                // Set potential to output
                this.network.layers[layerId].neurons[neuronId].output = potential;
            }

            // Calculate Softmax activation function
            // Based on:
            // http://msdn.microsoft.com/en-us/magazine/jj190808.aspx
            // http://z0rch.com/2014/02/01/softmax-activation-function


            var max = this.network.layers[layerId].neurons[0].output;
            for (var i = 0; i < this.network.layers[layerId].neurons.length; ++i) {
                if (this.network.layers[layerId].neurons[i].output > max) {
                    max = this.network.layers[layerId].neurons[i].output;
                }
            }

            var scale = 0.0;
            for (var i = 0; i < this.network.layers[layerId].neurons.length; ++i) {
                scale += Math.Exp(this.network.layers[layerId].neurons[i].output - max);
            }

            var result = [];
            for (var i = 0; i < this.network.layers[layerId].neurons.length; ++i) {
                result.push(Math.Exp(this.network.layers[layerId].neurons[i].output - max) / scale);
            }

            // Set Softmax results to neurons output

            for (var neuronId = 0; neuronId < this.network.layers[layerId].neurons.length; neuronId++) {
                this.network.layers[layerId].neurons[neuronId].output = result[neuronId];

                // Update following layer's input with current layer output
                if (layerId < this.network.layers.length - 1) {
                    this.network.layers[layerId + 1].inputs[neuronId] = this.network.layers[layerId].neurons[neuronId].output;
                }
            }
        }

        this.network.updateOutputs();
    };
};

ClassificationProblem.prototype.initializeSamples = function (trainingSet) {
    var inputs = [];
    var outputs = [];
    //todo: CSV column names should transparent for parser (currently we are dependent from x,y,cls)
    trainingSet.forEach(function(point) {
        inputs.push([parseFloat(point.x),parseFloat(point.y)]);
        outputs.push([parseFloat(point.cls)]);
    });
    this.inputs = inputs;
    this.outputs = this.normalizeOutputs(outputs);
};

ClassificationProblem.prototype.normalizeOutputs = function (outputs) {
    var neuronsInOutput = this.network.layers[this.network.layers.length - 1].neurons.length;
    var normalizedOutputs = [];
    outputs.forEach(function(output) {
        var normalizedOutput = [];
        neuronsInOutput.foreach(function() {
           normalizedOutput.push(0.0);
        });
        // Assume output classes are from 1.0 to n
        // We want to set
        // 1.0 to [ 1.0 , 0.0 , 0.0 , 0.0 ]
        // 2.0 to [ 0.0 , 1.0 , 0.0 , 0.0 ]
        // and so on..
        normalizedOutput[parseInt(output - 1.0)] = 1.0;
        normalizedOutputs.push(normalizedOutput);
    });
    return normalizedOutputs;

};

ClassificationProblem.prototype.learn = function(trainingSet) {
    this.initializeSamples(trainingSet);
    this.initializeBackpropagation();
    this.backpropagation.learn(this.inputs, this.outputs);

    // error is
    return this.backpropagation.network.outputs;
};

ClassificationProblem.prototype.solve = function() {
    var self = this;
    var filepath = "../../res/classification.train.csv";
    return Parser.parse(path.join(__dirname, filepath))
        .then(function(trainingSet) {
            return Q.fcall(self.learn.bind(self), trainingSet);
        });
        // TODO: implement ClassificationProblem.prototype.test method
        // In Classification problem test we should normalize outputs
        // When we get output vector like [ 0.15 , 0.6 , 0.25 ]
        // We treat those numbers like propability
        // It means that 0.6 gives the highest propability of class [ 0.0 , 1.0 , 0.0 ]
        //
        // So normalized output takes highest propability and converts it to one of our classes
};

module.exports = ClassificationProblem;