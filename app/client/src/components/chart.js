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
            uuid: UUID.v4()
        }
    },
    getData: function(params) {
        superagent
            .post('/api/perceptron')
            .send({
                source: params.source,
                problemType: params.problemType,
                numIterations: params.numIterations,
                activationFunction: params.activationFunction,
                learningRate: params.learningRate,
                momentum: params.momentum,
                bipolar: params.bipolar,
                bias: params.bias,
                hiddenLayers: params.hiddenLayers,
                errorThreshold: params.errorThreshold
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

        if(_.contains(["regression", "activation", "multimodal"], this.props.formData.problemType)) {
            data_graphic({
                title: "Results",
                data: [data.learningData, data.results],
                width: width,
                height: 250,
                target: "#results" + this.state.uuid,
                x_accessor: "x",
                y_accessor: "y",
                interpolate: "basic",
                area: false
            });
        } else if(_.contains(["classification", "noisyxor", "circles"], this.props.formData.problemType)) {
            data_graphic({
                title: "Learning",
                data: data.learningData,
                width: width,
                height: 250,
                target: "#learn" + this.state.uuid,
                chart_type: 'point',
                x_accessor: "x",
                y_accessor: "y",
                color_accessor: "z",
                interpolate: "basic",
                area: false
            });

            data_graphic({
                title: "Testing",
                data: data.results,
                width: width,
                height: 250,
                target: "#results" + this.state.uuid,
                chart_type: 'point',
                x_accessor: "x",
                y_accessor: "y",
                color_accessor: "z",
                interpolate: "basic",
                area: false
            });
        }

        data_graphic({
            title: "Global error",
            data: data.globalError,
            width: width,
            height: 250,
            target: "#error" + this.state.uuid,
            x_accessor: "iteration",
            y_accessor: "error",
            interpolate: "basic",
            area: false
        });
    },
    render: function() {
        return (
            <div>
                <Row>
                    <Col md={12}>
                        <div className="chart" id={"learn" + this.state.uuid} ref="chart"></div>
                        <div className="chart" id={"results" + this.state.uuid} ref="chart"></div>
                        <div className="chart" id={"error" + this.state.uuid} ref="chart"></div>
                    </Col>
                </Row>
            </div>
        );
    }
});

module.exports = Chart;