var fs = require("fs");
var parse = require("csv-parse");
var Q = require("q");

function Parser() { }

Parser.parse = function(filepath) {
    return Q.nfcall(fs.readFile, filepath, "utf-8")
        .then(function(data) {
            return Q.nfcall(parse, data, { columns: true })
        })
        .fail(function (error) {
            console.log(error);
            return error;
        })
};

module.exports = Parser;