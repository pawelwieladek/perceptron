var React = require("react");
var Bootstrap = require("react-bootstrap");
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Input = Bootstrap.Input;

var Form = require("./components/form");
var Chart = require("./components/chart");

var App = React.createClass({
    render: function() {
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
                        <Form />
                    </Col>
                    <Col md={6}>
                        <h2>Results</h2>
                        <Chart endpoint={"/api/regression/learning"} title="Learning" />
                        <Chart endpoint={"/api/regression/testing"} title="Testing" />
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