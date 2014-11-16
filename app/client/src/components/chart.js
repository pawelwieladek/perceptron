var React = require("react");
var Bootstrap = require("react-bootstrap");
var _ = require("underscore");
var UUID = require("node-uuid");

var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Input = Bootstrap.Input;

var Chart = React.createClass({
    getInitialState: function() {
        return {
            uuid: "chart" + UUID.v4()
        }
    },
    componentDidMount: function() {

        var width = $(this.refs.testingChart.getDOMNode()).width();

        d3.json(this.props.endpoint, function(data) {

            var max_x = _.max(_.map(data, function(p) { return parseFloat(p.x); }));
            var max_y = _.max(_.map(data, function(p) { return parseFloat(p.y); }));
            var min_x = _.min(_.map(data, function(p) { return parseFloat(p.x); }));
            var min_y = _.min(_.map(data, function(p) { return parseFloat(p.y); }));

            data_graphic({
                title: this.props.title,
                data: data,
                max_x: max_x,
                max_y: max_y,
                min_x: min_x,
                min_y: min_y,
                width: width,
                height: 250,
                target: "#" + this.state.uuid,
                x_accessor: "x",
                y_accessor: "y",
                interpolate: "basic",
                area: false
            });
        }.bind(this));
    },
    render: function() {
        return (
            <div>
                <Row>
                    <Col md={12}>
                        <div className="chart" id={this.state.uuid} ref="testingChart"></div>
                    </Col>
                </Row>
            </div>
        );
    }
});

module.exports = Chart;