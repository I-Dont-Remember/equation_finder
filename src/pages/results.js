import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import DownCaret from "../components/icons/DownCaret";

import axios from "axios";
import MathJax from "react-mathjax2";

const DEFAULT_EQUATIONS = [
    {
        equation: "F_w = 0.5pv^2A",
        confidence: 100,
        description:
            "Wind force is like totally legit bro, like honestly I don't even know what to say. Like, fo real. Hot diggity schlongus up in this higgity hizzoussee bro! Anyway here's my number, hit me up sometime if you wanna listen to Linkin Park and drink mountain dew and play Halo, it's lit. Bro, I'm serious, bro."
    },
    {
        equation: "p(v) = (4v^(2))/(pi^(1/2))(m/(2kT))^(3/2)e^(-(mv^2)/(2kT))",
        confidence: 80,
        description: "yuh"
    },
    {
        equation: "Eq3 = ur mom lol",
        confidence: 50,
        description: "GOT EEM"
    }
];

class Results extends React.Component {
    constructor(props) {
        super(props);

        this.state = { equations: [] };
    }

    // get the requested equations from the api
    componentDidMount() {
        console.log("this.props.location: ", this.props.location);
        const api_url =
            "https://nb7gul591a.execute-api.us-west-1.amazonaws.com/dev/equations";

        axios
            .get(api_url + this.props.location.search)
            .then(response => {
                console.log("response: ", response);
                this.setState({
                    equations:
                        response.data.possible_equations || DEFAULT_EQUATIONS
                });
            })
            .catch(error => {
                console.log("error getting data: ", error);
            });
    }

    // expand or collapse a description
    toggle_expand = event => {
        const eq_index = event.currentTarget.value;
        let equations = this.state.equations.slice(0);
        equations[eq_index].expanded = !equations[eq_index].expanded;

        this.setState({ equations });
    };

    render() {
        return (
            <Layout>
                <SEO title="Results" />
                <h1>Your equations:</h1>

                <div className="results">
                    <Row>
                        <Col>
                            <h4>Equation</h4>
                        </Col>
                        <Col>
                            <h4>Confidence</h4>
                        </Col>
                        <Col>
                            <h4>Description</h4>
                        </Col>
                    </Row>

                    <MathJax.Context>
                        <ListGroup variant="flush">
                            {this.state.equations.map((eq, eq_index) => (
                                <ListGroup.Item
                                    key={eq.equation}
                                    className="equation-list-item"
                                >
                                    <EquationRow
                                        equation={eq}
                                        equation_index={eq_index}
                                        toggle_expand={this.toggle_expand}
                                    />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </MathJax.Context>
                </div>

                <Link to="/">Try different variables</Link>
            </Layout>
        );
    }
}

const EquationRow = ({ equation, equation_index, toggle_expand }) => (
    <Row>
        <Formula equation={equation} />
        <Confidence equation={equation} />
        <Description
            equation={equation}
            equation_index={equation_index}
            toggle_expand={toggle_expand}
        />
    </Row>
);

const Formula = ({ equation }) => (
    <Col xs={4}>
        <MathJax.Node>{equation.equation}</MathJax.Node>
    </Col>
);

const Confidence = ({ equation }) => (
    <Col xs={4}>{Math.round((equation.confidence || 0) * 100)}%</Col>
);

const Description = ({ equation, equation_index, toggle_expand }) => (
    <Col
        xs={4}
        className="description-col"
        style={{ flexDirection: equation.expanded ? "column" : "row" }}
    >
        <div className={equation.expanded ? "" : "ellipses-text"}>
            {equation.description}
        </div>
        <button
            className={`expander ${equation.expanded ? "expanded" : ""}`}
            value={equation_index}
            onClick={toggle_expand}
        >
            <DownCaret height={"1em"} width={"1em"} />
        </button>
    </Col>
);

export default Results;
