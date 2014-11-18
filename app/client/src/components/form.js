var React = require("react");
var Bootstrap = require("react-bootstrap");
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Well = Bootstrap.Well;
var Input = Bootstrap.Input;
var Button = Bootstrap.Button;

var Form = React.createClass({
    handleSubmit: function(event) {
        event.preventDefault();
        var learningSet = this.refs.learningSet.getValue();
        var testingSet = this.refs.testingSet.getValue();
        var learningRate = parseFloat(this.refs.learningRate.getValue());
        var momentum = parseFloat(this.refs.momentum.getValue());
        var bipolar = this.refs.bipolar.getChecked();
        var bias = this.refs.bias.getChecked();

        this.props.onSubmit({
            learningSet: learningSet,
            testingSet: testingSet,
            learningRate: learningRate,
            momentum: momentum,
            bipolar: bipolar,
            bias: bias
        });
    },
    render: function() {
        return (
            <div>
                <Row>
                    <Col md={6}>
                        <Input type="textarea" ref="learningSet" label="Learning set" />
                    </Col>
                    <Col md={6}>
                        <Input type="textarea" ref="testingSet" label="Testing set" />
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Input type="number" ref="learningRate" label="Learning Rate" step="0.1" max="1.0" min="0.0"/>
                    </Col>
                    <Col md={6}>
                        <Input type="number" ref="momentum" label="Momentum" step="0.1" max="1.0" min="0.0" />
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Input type="checkbox" ref="bipolar" label="Bipolar"/>
                    </Col>
                    <Col md={6}>
                        <Input type="checkbox" ref="bias" label="Bias"/>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Well className="text-center">
                            <Button bsStyle="primary" onClick={this.handleSubmit}>Submit</Button>
                        </Well>
                    </Col>
                </Row>
            </div>
        );
    }
});

module.exports = Form;