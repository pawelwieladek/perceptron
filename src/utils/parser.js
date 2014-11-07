var fs = require("fs");
var parse = require("csv-parse");
var Q = require("q");

function Parser() { }

Parser.parse = function(filepath) {
    var deferred = Q.defer();
    fs.readFile(filepath, "utf8", function (error, data) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            parse(data, { columns: true }, function(error, output) {
                if (error) {
                    deferred.reject(new Error(error));
                } else {
                    deferred.resolve(output);
                }
            });
        }
    });
    return deferred.promise;
};

module.exports = Parser;