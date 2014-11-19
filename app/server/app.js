function App() {

}

App.prototype = {
    parseCsv: function(content) {
        return Q.nfcall(parse, content, { columns: true, skip_empty_lines: true });
    }
};

module.exports = App;