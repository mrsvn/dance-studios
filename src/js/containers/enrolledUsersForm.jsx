import React from 'react';

import { EnrolledUsers } from "./enrolledUsers";

class EnrolledUsersForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: []
        };
    }

    componentDidMount() {
        fetch(`/v1/studio/${this.props.urlBit}/classes`).then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                classes: data.classes
            });
        })
    }

    render() {
        return <div>
            {
                this.state.classes.map(classInfo => {
                    return <EnrolledUsers classId={classInfo._id}/>;
                })
            }
        </div>;
    }
}

export { EnrolledUsersForm };
