import React from "react";
import { Link } from "gatsby";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";

import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import TrashIcon from "../components/icons/Trash";

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            variable: "",
            predicted_variables: [],
            picked_variables: [],
            unchosen_variables: [
                { long_name: "Area of a Square", name: "As" },
                { long_name: "Area of a Rectangle", name: "Ar" },
                { long_name: "Area of a Triangle", name: "At" },
                { long_name: "Area of a Circle", name: "Ac" },
                { long_name: "Circumference of a Circle", name: "C" },
                { long_name: "Volume of a Rectangular Prism", name: "Vr" },
                { long_name: "Volume of a Cylinder", name: "Vc" },
                { long_name: "Volume of a Cone", name: "Vco" },
                { long_name: "Length", name: "l" },
                { long_name: "Width", name: "w" },
                { long_name: "Height", name: "h" },
                { long_name: "Radius", name: "r" }
            ]
        };
    }

    // move a variable from one list in state to another
    move_variable = (event, move_from_name, move_to_name) => {
        // get the long name of the variable that was picked
        const variable_name = event.currentTarget.value;

        // find the variable object that corresponds to the one picked
        let move_from = this.state[move_from_name];
        const variable_obj_index = move_from.findIndex(
            v => v.long_name === variable_name
        );
        // remove the variable from the first list
        const [variable_obj] = move_from.splice(variable_obj_index, 1);
        // add the picked variable object to the second list
        const move_to = this.state[move_to_name].concat([variable_obj]);

        this.setState({
            // set the two new lists
            [move_to_name]: move_to,
            [move_from_name]: move_from,
            // reset the variable input
            variable: "",
            // remove all the predicted variables
            predicted_variables: []
        });
    };

    choose_variable = event =>
        this.move_variable(event, "unchosen_variables", "picked_variables");

    remove_variable = event =>
        this.move_variable(event, "picked_variables", "unchosen_variables");

    // when the input text changes, change the input box and filter the results
    handle_input_change = event => {
        const variable = event.currentTarget.value;
        const variable_lc = variable.toLowerCase();

        const predicted_variables =
            variable === ""
                ? []
                : this.state.unchosen_variables.filter(v =>
                      v.long_name.toLowerCase().includes(variable_lc)
                  );

        this.setState({ variable, predicted_variables });
    };

    render() {
        const { picked_variables } = this.state;
        return (
            <Layout>
                <SEO title="Home" />

                <p>What variables are known?</p>
                <Row>
                    <Col sm={12} md={6}>
                        <Form>
                            <Form.Control
                                type="text"
                                name="variable"
                                value={this.state.variable}
                                onChange={this.handle_input_change}
                                placeholder="e.g. height"
                            />
                            <ListGroup
                                variant="flush"
                                className="pickable-vars"
                                style={{
                                    display: this.state.predicted_variables
                                        .length
                                        ? ""
                                        : "none"
                                }}
                            >
                                {this.state.predicted_variables.map(
                                    variable => (
                                        <ListGroup.Item
                                            action
                                            onClick={this.choose_variable}
                                            value={variable.long_name}
                                            key={variable.long_name}
                                        >
                                            {variable.long_name}
                                        </ListGroup.Item>
                                    )
                                )}
                            </ListGroup>
                        </Form>
                    </Col>

                    <Col sm={12} md={6}>
                        {picked_variables.map(variable => (
                            <Button
                                onClick={this.remove_variable}
                                value={variable.long_name}
                                key={variable.long_name}
                                className="picked-variable"
                            >
                                <TrashIcon
                                    stroke={"white"}
                                    height={20}
                                    style={{ marginTop: "-4px" }}
                                />{" "}
                                {variable.long_name}
                            </Button>
                        ))}
                    </Col>
                </Row>

                <Link
                    to={`/page-2?variables=${picked_variables.reduce(
                        (s, v, i) =>
                            s +
                            v.name +
                            (i === picked_variables.length - 1 ? "" : ","),
                        ""
                    )}`}
                >
                    Go to page 2
                </Link>
            </Layout>
        );
    }
}

{
    /* <ListGroup>
    {this.state.picked_variables.map(variable => (
        <ListGroup.Item
            action
            onClick={this.remove_variable}
            value={variable.long_name}
            key={variable.long_name}
        >
            {variable.long_name}
        </ListGroup.Item>
    ))}
</ListGroup> */
}

// const IndexPage = () => (
//     <Layout>
//         <SEO title="Home" />
//         <h1>Hi people</h1>
//         <p>Welcome to your new Gatsby site.</p>
//         <p>Now go build something great.</p>
//         <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
//             <Image />
//         </div>
//         <Link to="/page-2/">Go to page 2</Link>
//     </Layout>
// )

export default IndexPage;
