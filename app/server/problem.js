var Q = require('q');
var fs = require('fs');
var path = require("path");
var parse = require("csv-parse");
var _ = require("underscore");

var Perceptron = require("../../lib/src/perceptron");

function Problem(options) {
    this.learningData = [];
    this.testingData = [];
    this.maxValue = 0;
    this.perceptron = null;

    this.learnFile = options.learnFile;
    this.testFile = options.testFile;
    this.numIterations = options.numIterations;
    this.activationFunction = options.activationFunction;
    this.learningRate = options.learningRate;
    this.momentum = options.momentum;
    this.bipolar = options.bipolar;
    this.bias = options.bias;
}

Problem.prototype = {
    readLearnFile: function() {
        return Q.nfcall(fs.readFile, path.join(__dirname, this.learnFile), "utf-8");
    },
    readTestFile: function() {
        return Q.nfcall(fs.readFile, path.join(__dirname, this.testFile), "utf-8");
    },
    parseCsv: function(content) {
        return Q.nfcall(parse, content, { columns: true, skip_empty_lines: true });
    },
    formatLearningData: function(learningData) {
        return Q.fcall(function() {
            this.learningData = _.map(learningData, function(pattern) {
                return _.values(pattern).map(function(val) { return parseFloat(val); } );
            });
        }.bind(this));
    },
    formatTestingData: function(testingData) {
        return Q.fcall(function() {
            this.testingData = _.map(testingData, function(pattern) {
                return _.values(pattern).map(function(val) { return parseFloat(val); } );
            });
        }.bind(this));
    },
    trainNetwork: function() {
        return Q.fcall(function() {
            this.maxValue = Math.abs(_.max(_.flatten(this.learningData.concat(this.testingData))));

            var max = this.maxValue;

            var learningSet = [];
            this.learningData.forEach(function(pattern) {
                learningSet.push({
                    input: _.map(pattern.slice(0, 1), function(x) { return x / max }),
                    output: _.map(pattern.slice(1, 2), function(x) { return x / max })
                })
            });

            this.perceptron = new Perceptron({
                bias: this.bias,
                bipolar: this.bipolar,
                learningRate: this.learningRate,
                momentum: this.momentum,
                activation: this.activationFunction
            });

            this.perceptron.train(learningSet, {
                iterations: this.numIterations
            });

        }.bind(this));
    },
    testNetwork: function() {
        return Q.fcall(function() {

            var max = this.maxValue;
            var testingSet = _.map(this.testingData, function(test) {
                return _.map(test, function(x) { return x / max } )
            });

            var results = [];
            testingSet.forEach(function(test) {
                var result = _.map(this.perceptron.run(test), function(x) {
                    return x * max;
                });
                results.push(result);
            }.bind(this));

            results = _.zip(this.testingData, results);

            results = _.map(results, function(result) {
                return {
                    x: result[0][0],
                    y: result[1][0]
                }
            });

            var learningData = _.map(this.learningData, function(learn) {
                return {
                    x: learn[0],
                    y: learn[1]
                }
            });

            return [learningData, results];

        }.bind(this));
    },
    solve: function() {
        return this.readLearnFile()
            .then(this.parseCsv.bind(this))
            .then(this.formatLearningData.bind(this))
            .then(this.readTestFile.bind(this))
            .then(this.parseCsv.bind(this))
            .then(this.formatTestingData.bind(this))
            .then(this.trainNetwork.bind(this))
            .then(this.testNetwork.bind(this))
            .fail(function(err) {
                console.log(err);
            })
    }
};

module.exports = Problem;