import React from "react";

class EnrolledUsers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        }
    }
    componentDidMount() {
        fetch(`/v1/classes/${this.props.classId}/enrolledUsers`).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);

            this.setState({ users: data.enrolledUsers });
        });
    }

    render() {
        return <div className="card m-2">
            <h5 className="card-header">Список записавшихся на занятие</h5>
            <div className="card-body">
                <ul>
                    {
                        this.state.users.length !== 0 ? this.state.users.map(user => {
                            return <li>
                                <img src={`/v1/userpics/${user.email}`} alt="" style={{ height: '25px' }}/>&nbsp;
                                {user.firstName} {user.lastName}&nbsp;
                                (<a href={`mailto:${user.email}`}>{user.email}</a>)
                            </li>;
                        }) : <em>Участники отсутствуют</em>
                    }
                </ul>
            </div>
        </div>;
    }
}

export { EnrolledUsers };
