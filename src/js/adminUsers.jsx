import React from 'react';
import ReactDOM from "react-dom";

class AdminUsers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };
    }

    componentDidMount() {
        fetch("/v1/admin/users").then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                users: data.users
            });
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return <div className="card">
            <h5 className="card-header">Пользователи</h5>
            <div className="card-body">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">E-mail</th>
                            <th scope="col">Имя</th>
                            <th scope="col">Фамилия</th>
                            <th scope="col">Пол</th>
                            <th scope="col">Дата рождения</th>
                            <th scope="col">Город</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map(user => {
                                return <tr>
                                    <td>{user.email}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.gender}</td>
                                    <td>{user.birthDate}</td>
                                    <td>{user.city}</td>
                                    <td>
                                        <a href="#" className="btn btn-sm btn-danger">Удалить</a>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

ReactDOM.render(<AdminUsers/>, document.querySelector('#admin-users'));
