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
    componentDidMount: function() {
        superagent
            .post('/api/perceptron')
            .send({ learningSet: this.props.learningSet })
            .end(function(error, res){
                this.setState({
                    data: res.body
                })
            }.bind(this));
    },
    componentDidUpdate: function() {
        console.log(this.state.data);
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