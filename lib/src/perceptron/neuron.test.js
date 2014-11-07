var Neuron = require("./neuron");

describe("Neuron", function() {

    var neuron;

    beforeEach(function() {
        neuron = new Neuron(3);
    });

    it("initializes empty", function() {
        expect(neuron.output).toBe(null);
        expect(neuron.weights.length).toBe(3);
        neuron.weights.forEach(function(weight) {
            expect(weight).toEqual(0.0);
        });
    });
});