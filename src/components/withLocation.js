import React from "react";
import { Location } from "@reach/router";

const withLocation = ComponentToWrap => props => (
    <Location>
        {({ location, navigate }) => (
            <ComponentToWrap
                {...props}
                location={location}
                navigate={navigate}
            />
        )}
    </Location>
);

export default withLocation;
