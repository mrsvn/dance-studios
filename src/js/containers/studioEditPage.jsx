import React from "react";
import ReactDOM from "react-dom";

import { StudioProfileEditForm } from "../containers/studioProfileEditForm";
import { StudioClassesForm } from "../containers/studioClassesForm";

class StudioEditPage extends React.Component {
    render() {
        return <>
            <StudioProfileEditForm/>
            <StudioClassesForm/>
        </>;
    }
}

export { StudioEditPage };

