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
            formData: formData
        });
    },
    render: function() {
        var chart = null;
        if (this.state.drawChart) {
            chart = <Chart formData={this.state.formData} />;
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