import React from 'react';

import { EnrolledUsers } from "./enrolledUsers";

class ClassCard extends React.Component {
    constructor(props) {
        super(props);

        this.classId = this.props.match.params.classId;
    }

    render() {
        return <div>
            {/*<h4>Class card {this.classId}</h4>*/}
            <EnrolledUsers classId={this.classId}/>
        </div>;
    }
}

export { ClassCard };
