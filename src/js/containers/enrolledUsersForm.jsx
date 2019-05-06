import React from 'react';

class EnrolledUsers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        }
    }
    componentDidMount() {
        fetch(`/v1/classes/${this.props.classInfo._id}/enrolledUsers`).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);

            this.setState({ users: data.enrolledUsers });
        });
    }

    render() {
        return <div className="card m-2">
            <h5 className="card-header">Список записавшихся на «{this.props.classInfo.title}»</h5>
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
                    return <EnrolledUsers classInfo={classInfo}/>;
                })
            }
        </div>;
    }
}

export { EnrolledUsersForm };
