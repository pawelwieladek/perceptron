var React = require("react");
var Bootstrap = require("react-bootstrap");
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Input = Bootstrap.Input;

var Form = require("./components/form");
var Chart = require("./components/chart");

var App = React.createClass({
    getInitialState: function() {
        return {
            drawChart: false
        }
    },
    handleSubmit: function(formData) {
        this.setState({
            drawChart: true,
            learningSet: formData.learningSet,
            testingSet: formData.testingSet,
            learningRate: formData.learningRate,
            momentum: formData.momentum,
            bipolar: formData.bipolar,
            bias: formData.bias
        });
    },
    render: function() {
        var chart = null;
        if (this.state.drawChart) {
            chart = <Chart
                learningSet={this.state.learningSet}
                testingSet={this.state.testingSet}
                learningRate={this.state.learningRate}
                momentum={this.state.momentum}
                bipolar={this.state.bipolar}
                bipolar={this.state.bipolar}
                bias={this.state.bias}
            />;
        }
        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <h1>Perceptron.js</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <h2>Settings</h2>
                        <Form onSubmit={this.handleSubmit} />
                    </Col>
                    <Col md={6}>
                    {chart}
                    </Col>
                </Row>
            </Grid>
        );
    }
});

React.render(
    <App />,
    document.body
);