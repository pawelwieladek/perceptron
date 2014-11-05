var Layer = require("./layer");

describe("Layer", function() {
    it("initializes with proper number of neurons and weights", function() {
        var layer = new Layer(2, 3);
        expect(layer.inputs.length).toBe(2);
        expect(layer.neurons.length).toBe(3);
        layer.neurons.forEach(function(neuron) {
            expect(neuron.weights.length).toEqual(2);
        });
    });
});