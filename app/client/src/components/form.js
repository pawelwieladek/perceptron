var React = require("react");
var Bootstrap = require("react-bootstrap");
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Well = Bootstrap.Well;
var Input = Bootstrap.Input;
var Button = Bootstrap.Button;

var Form = React.createClass({
    render: function() {
        return (
            <form>
                <Row>
                    <Col md={6}>
                        <Input type="file" id="learningFile" label="Learning file" />
                    </Col>
                    <Col md={6}>
                        <Input type="file" id="testingFile" label="Testing file" />
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Input type="number" id="inputDimension" label="Input dimension" />
                    </Col>
                    <Col md={6}>
                        <Input type="number" id="outputDimension" label="Output dimension" />
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Input type="number" id="learningRate" label="Learning Rate" step="0.1" max="1.0" min="0.0"/>
                    </Col>
                    <Col md={6}>
                        <Input type="number" id="momentum" label="Momentum" step="0.1" max="1.0" min="0.0" />
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Input type="checkbox" label="Bipolar"/>
                    </Col>
                    <Col md={6}>
                        <Input type="checkbox" label="Bias"/>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Well className="text-center">
                            <Button bsStyle="primary">Submit</Button>
                        </Well>
                    </Col>
                </Row>
            </form>
        );
    }
});

module.exports = Form;