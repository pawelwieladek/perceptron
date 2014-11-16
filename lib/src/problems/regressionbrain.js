var Parser = require("../utils/parser");
var Q = require("q");
var _ = require("underscore");
var path = require("path");
var brain = require("brain");

function RegressionBrainProblem() {
    this.net = new brain.NeuralNetwork();
    this.maxSampleValue = 0;
}

RegressionBrainProblem.prototype.normalize = function(number) {
    return number / this.maxSampleValue;
};

RegressionBrainProblem.prototype.denormalize = function(number) {
    return number * this.maxSampleValue;
};

RegressionBrainProblem.prototype.train = function(testInput) {
    var data = [];
    testInput.forEach(function(row)
    {
        var x = parseFloat(row.x);
        var y = parseFloat(row.y);
        this.maxSampleValue = Math.max(x,y,this.maxSampleValue);
        var trainObject = {
            input: [this.normalize(x)],
            output: [this.normalize(y)]
        };
        data.push(trainObject);
    }.bind(this));
    this.net.train(data);
};

RegressionBrainProblem.prototype.test = function(testInput) {
    var testVal = this.normalize(testInput[0]);
    var result = this.net.run([testVal]);
    var output = this.denormalize(result[0]);
    return output;
};

RegressionBrainProblem.prototype.solve = function() {
    var trainingFile = "../../res/regression.train.csv";
    var testFile = "../../res/regression.test.csv";

    var haveParsedTestFile = function() {
        return Parser.parse(path.join(__dirname, testFile))
    }.bind(this);

    var haveLearned = function (trainingSet) {
        return Q.fcall(this.train.bind(this), trainingSet);
    }.bind(this);

    var haveTested = function(testSet) {
        return Q.fcall(function() {
            var result = [];
            testSet.forEach(function(input) {
                input = parseFloat(input.x);
                result.push({ input: input, output: this.test([input])[0] });
            }.bind(this));
            return result;
        }.bind(this));
    }.bind(this);

    return Parser.parse(path.join(__dirname, trainingFile))
        .then(haveLearned)
        .then(haveParsedTestFile)
        .then(haveTested);
};
module.exports = RegressionBrainProblem;