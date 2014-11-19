var Q = require('q');
var fs = require('fs');
var path = require("path");
var parse = require("csv-parse");
var _ = require("underscore");

var Perceptron = require("../../lib/src/perceptron");

function Problem(options) {
    this.learningData = [];
    this.testingData = [];
    this.globalError = [];
    this.maxValue = 0;
    this.perceptron = null;

    this.inputSize = options.inputSize;
    this.outputSize = options.outputSize;
    this.learnFile = options.learnFile;
    this.testFile = options.testFile;
    this.numIterations = options.numIterations;
    this.activationFunction = options.activationFunction;
    this.learningRate = options.learningRate;
    this.momentum = options.momentum;
    this.bipolar = options.bipolar;
    this.bias = options.bias;
    this.hiddenLayers = options.hiddenLayers;
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

            this.classes = _.map(this.learningData, function(x) { return x[this.inputSize] }.bind(this));
            this.classes = _.uniq(this.classes);

            var learningSet = [];
            this.learningData.forEach(function(pattern) {
                learningSet.push({
                    input: _.map(pattern.slice(0, this.inputSize), function(x) { return x / max }),
                    output: _.map(this.classes, function(className) { return pattern[this.inputSize] == className ? 1.0 : 0.0}.bind(this))
                })
            }.bind(this));

            var hiddenLayers = this.hiddenLayers.split(",");
            hiddenLayers = _.map(hiddenLayers, function(x) { return parseInt(x); });

            this.perceptron = new Perceptron({
                bias: this.bias,
                bipolar: this.bipolar,
                learningRate: this.learningRate,
                momentum: this.momentum,
                activation: this.activationFunction,
                hiddenLayers: hiddenLayers
            });

            learningSet = _.shuffle(learningSet);

            this.perceptron.train(learningSet, {
                iterations: this.numIterations,
                errorThreshold: this.errorThreshold,
                log: true,
                logPeriod: 1000,
                callbackPeriod: 1,
                callback: function(info) {
                    this.globalError.push({
                        iteration: info.iterations,
                        error: info.error
                    });
                }.bind(this)
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
                var result = this.perceptron.run(test);
                var output = this.classes[_.indexOf(result, _.max(result))];
                results.push(output);
            }.bind(this));

            results = _.zip(this.testingData, results);

            results = _.map(results, function(result) {
                return {
                    x: result[0][0],
                    y: result[0][1],
                    z: result[1]
                }
            });

            var learningData = _.map(this.learningData, function(learn) {
                return {
                    x: learn[0],
                    y: learn[1],
                    z: learn[2]
                }
            });

            return {
                learningData: learningData,
                results: results,
                globalError: this.globalError
            };

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