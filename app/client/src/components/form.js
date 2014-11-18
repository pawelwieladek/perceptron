var React = require("react");
var Bootstrap = require("react-bootstrap");
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Well = Bootstrap.Well;
var Input = Bootstrap.Input;
var Button = Bootstrap.Button;

var Form = React.createClass({
    getInitialState: function() {
        return {
            showCustomSourceInput: false,
            bipolar: true,
            bias: true
        }
    },
    handleSubmit: function(event) {
        event.preventDefault();
        var learningRate = parseFloat(this.refs.learningRate.getValue());
        var momentum = parseFloat(this.refs.momentum.getValue());
        var bipolar = this.refs.bipolar.getChecked();
        var bias = this.refs.bias.getChecked();
        var activationFunction = this.refs.activationFunction.getChecked();
        var numIterations = this.refs.numIterations.getChecked();
        var problemType = this.refs.problemType.getChecked();

        var source = {};
        if (this.refs.sampleSource.getChecked()) {
            source = {
                name: "sample"
            };
        } else if (this.refs.customSource.getChecked()) {
            source = {
                name: "custom",
                data: {
                    learningSet: this.refs.learningSet.getValue(),
                    testingSet: this.refs.testingSet.getValue(),
                    inputSize: parseInt(this.refs.inputSize.getValue()),
                    outputSize: parseInt(this.refs.outputSize.getValue())
                }
            };
        }

        this.props.onSubmit({
            problemType: problemType,
            source: source,
            activationFunction: activationFunction,
            numIterations: numIterations,
            learningRate: learningRate,
            momentum: momentum,
            bipolar: bipolar,
            bias: bias
        });
    },
    componentDidMount: function() {
        this.setState({ showCustomSourceInput: this.refs.customSource.getChecked() });
    },
    handleBipolarChange: function() {
        this.setState({ bipolar: this.refs.bipolar.getChecked() });
    },
    handleBiasChange: function() {
        this.setState({ bias: this.refs.bias.getChecked() });
    },
    handleSourceChange: function() {
        this.setState({ showCustomSourceInput: this.refs.customSource.getChecked() });
    },
    render: function() {
        var customSource = null;
        if (this.state.showCustomSourceInput) {
            customSource =
                <div>
                    <Input type="textarea" ref="learningSet" label="Learning set" rows={5} />
                    <Input type="textarea" ref="testingSet" label="Testing set" rows={5} />
                    <Input type="number" ref="inputSize" label="Input size" />
                    <Input type="number" ref="outputSize" label="Output size" />
                </div>;
        }
        return (
            <div>
                <h2>Settings</h2>
                <Row>
                    <Col md={6}>
                        <label>Data source</label>
                        <Input type="radio" ref="sampleSource" label="Sample" name="source" onChange={this.handleSourceChange}/>
                        <Input type="radio" ref="customSource" label="Custom" name="source" onChange={this.handleSourceChange}/>
                        {customSource}
                    </Col>
                    <Col md={6}>
                        <Input type="select" ref="problemType" label="Problem type" defaultValue="sigmoid">
                            <option value="regression">Regression</option>
                            <option value="classification">Classification</option>
                        </Input>
                        <Input type="select" ref="activationFunction" label="Activation function"  defaultValue="sigmoid">
                            <option value="sigmoid">Sigmoid</option>
                            <option value="tanh">Tanh</option>
                        </Input>
                        <Input type="number" ref="numIterations" label="Number of iterations" defaultValue="2000" />
                        <Input type="number" ref="learningRate" label="Learning Rate" step="0.1" max="1.0" min="0.0" defaultValue="0.3" />
                        <Input type="number" ref="momentum" label="Momentum" step="0.1" max="1.0" min="0.0" defaultValue="0.1" />
                        <Input type="checkbox" ref="bipolar" label="Bipolar" checked={this.state.bipolar} onChange={this.handleBipolarChange} />
                        <Input type="checkbox" ref="bias" label="Bias" checked={this.state.bias} onChange={this.handleBiasChange} />
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