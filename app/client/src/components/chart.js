var React = require("react");
var Bootstrap = require("react-bootstrap");
var UUID = require("node-uuid");
var _ = require("underscore");
var superagent = require("superagent");

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
    getData: function(params) {
        console.log(params);
        superagent
            .post('/api/perceptron')
            .send({
                source: params.source,
                learningRate: params.learningRate,
                momentum: params.momentum,
                bipolar: params.bipolar,
                bias: params.bias
            })
            .type('application/json')
            .end(function(error, res){
                this.setState({
                    data: res.body
                })
            }.bind(this));
    },
    componentDidMount: function() {
        this.getData(this.props.formData);
    },
    componentWillReceiveProps: function(props) {
        this.getData(props.formData);
    },
    componentDidUpdate: function() {
        var data = this.state.data;
        var width = $(this.refs.chart.getDOMNode()).width();

        data_graphic({
            title: this.props.title,
            data: data,
            width: width,
            height: 250,
            target: "#" + this.state.uuid,
            x_accessor: "x",
            y_accessor: "y",
            interpolate: "basic",
            area: false
        });
    },
    render: function() {
        return (
            <div>
                <Row>
                    <Col md={12}>
                        <div className="chart" id={this.state.uuid} ref="chart"></div>
                    </Col>
                </Row>
            </div>
        );
    }
});

module.exports = Chart;