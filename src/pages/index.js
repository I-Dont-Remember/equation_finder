import React from "react";
import { Link } from "gatsby";

import "bootstrap/dist/css/bootstrap.min.css";

import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";

import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

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

    on_variable_click = event => {
        // get the long name of the variable that was picked
        const variable_name = event.currentTarget.value;

        // find the variable object that corresponds to the one picked
        let { unchosen_variables } = this.state;
        const variable_obj_index = unchosen_variables.findIndex(
            v => v.long_name === variable_name
        );
        const variable_obj = unchosen_variables[variable_obj_index];
        // add the picked variable object to the list of picked variables
        const picked_variables = this.state.picked_variables.concat([
            variable_obj
        ]);
        // remove the variable from the unchosen variables
        unchosen_variables.splice(variable_obj_index, 1);

        this.setState({
            // set the picked variables
            picked_variables,
            // reset the variable input
            variable: "",
            // set the unchosen variables without the new chosen one
            unchosen_variables,
            // remove all the predicted variables
            predicted_variables: []
        });
    };

    on_variable_delete = event => {
        // get the long name of the variable that was picked
        const variable_name = event.currentTarget.value;

        // find the variable object that corresponds to the one picked
        let { picked_variables } = this.state;
        const variable_obj_index = picked_variables.findIndex(
            v => v.long_name === variable_name
        );
        const variable_obj = picked_variables[variable_obj_index];
        // add the variable object to the list of unpicked variables
        const unchosen_variables = this.state.unchosen_variables.concat([
            variable_obj
        ]);
        // remove the variable from the unchosen variables
        picked_variables.splice(variable_obj_index, 1);

        this.setState({
            // set the picked variables
            picked_variables,
            // reset the variable input
            variable: "",
            // set the unchosen variables without the new chosen one
            unchosen_variables,
            // remove all the predicted variables
            predicted_variables: []
        });
    };

    render() {
        return (
            <Layout>
                <SEO title="Home" />
                <h1>Getcho Equations, mo' Scrongus</h1>
                <p>What variables are known?</p>
                <Form>
                    <Form.Control
                        type="text"
                        name="variable"
                        value={this.state.variable}
                        onChange={this.handle_input_change}
                        placeholder="e.g. height"
                    />
                </Form>

                <ListGroup>
                    {this.state.predicted_variables.map(variable => (
                        <ListGroup.Item
                            action
                            onClick={this.on_variable_click}
                            value={variable.long_name}
                            key={variable.long_name}
                        >
                            {variable.long_name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                <ListGroup>
                    {this.state.picked_variables.map(variable => (
                        <ListGroup.Item
                            action
                            onClick={this.on_variable_delete}
                            value={variable.long_name}
                            key={variable.long_name}
                        >
                            {variable.long_name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                <Link to="/page-2/">Go to page 2</Link>
            </Layout>
        );
    }
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
