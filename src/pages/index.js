import React from "react";
import { Link } from "gatsby";

import "bootstrap/dist/css/bootstrap.min.css";

import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";

import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

const ALL_VARIABLES = [
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
];

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { variable: "", predicted_variables: [] };
    }

    // when the input text changes, change the input box and filter the results
    handle_input_change = event => {
        const variable = event.currentTarget.value;
        const variable_lc = variable.toLowerCase();

        const predicted_variables =
            variable === ""
                ? []
                : ALL_VARIABLES.filter(v =>
                      v.long_name.toLowerCase().includes(variable_lc)
                  );

        this.setState({ variable, predicted_variables });
    };

    on_variable_click = event => {
        console.log("variable clicked");
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
