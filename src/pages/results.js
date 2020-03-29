import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

const DEFAULT_EQUATIONS = [
    {
        equation: "Fw = 0.5*p*v^2*A",
        confidence: 100,
        description:
            "Wind force is like totally legit bro, like honestly I don't even know what to say. Like, fo real. Hot diggity schlongus up in this higgity hizzoussee bro! Anyway here's my number, hit me up sometime if you wanna listen to Linkin Park and drink mountain dew and play Halo, it's lit. Bro, I'm serious, bro."
    },
    {
        equation: "Eq2 = schliggity kringle",
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

        this.state = {
            equations: DEFAULT_EQUATIONS
        };
    }

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

                    <ListGroup variant="flush">
                        {this.state.equations.map((eq, eq_index) => (
                            <ListGroup.Item
                                key={eq.equation}
                                className="equation-list-item"
                            >
                                <Row>
                                    <Col xs={4}>{eq.equation}</Col>
                                    <Col xs={4}>{eq.confidence}%</Col>
                                    <Col
                                        xs={4}
                                        className="description-col"
                                        style={{
                                            flexDirection: eq.expanded
                                                ? "column"
                                                : "row"
                                        }}
                                    >
                                        <div
                                            className={
                                                eq.expanded
                                                    ? ""
                                                    : "ellipses-text"
                                            }
                                        >
                                            {eq.description}
                                        </div>
                                        <button
                                            className={`text-button ${
                                                eq.expanded ? "expanded" : ""
                                            }`}
                                            value={eq_index}
                                            onClick={this.toggle_expand}
                                        >
                                            ^
                                        </button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                <Link to="/">Try different variables</Link>
            </Layout>
        );
    }
}

export default Results;
