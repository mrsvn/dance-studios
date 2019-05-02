import React from "react";
import ReactDOM from "react-dom";

import { StudioProfileEditForm } from "../containers/studioProfileEditForm";
import { StudioClassesForm } from "../containers/studioClassesForm";

class StudioEditPage extends React.Component {
    constructor(props) {
        super(props);

        this.urlBit = this.props.match.params.urlBit;
        console.log("EDITING", this.urlBit);
    }

    render() {
        return <>
            <StudioProfileEditForm urlBit={this.urlBit}/>
            <StudioClassesForm urlBit={this.urlBit}/>
        </>;
    }
}

export { StudioEditPage };

