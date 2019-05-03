import React from "react";

import { AdminInvitationsPage } from "./adminInvitationsPage";
import { AdminStudiosPage } from "./adminStudiosPage";

class AdminUsersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };
    }

    componentDidMount() {
        fetch("/v1/users").then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                users: data.users
            });
        }).catch(error => {
            console.log(error);
        });
    }

    handleDeleteClick(id, e) {
        e.preventDefault();

        fetch(`/v1/users/${id}`, { method: 'DELETE' }).then(response => {
            return response.json();
        }).then(response => {
            if(response.status === 'OK') {
                this.setState({
                    users: this.state.users.filter(user => user._id !== id)
                });
            }
            else {
                console.log(response);
            }
        });
    }

    render() {
        return <div>
            <div className="card m-2">
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
                            <th scope="col">Студия</th>
                            <th scope="col">&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.users.map(user => {
                                return <tr key={user.email}>
                                    <td>{user.email}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.gender}</td>
                                    <td>{user.birthDate}</td>
                                    <td>{user.city}</td>
                                    <td>
                                        { user.managedStudio || <em>нет</em>}
                                    </td>
                                    <td className="p-2">
                                        <button className="btn btn-sm btn-danger" onClick={e => this.handleDeleteClick(user._id, e)}>
                                            Удалить
                                        </button>
                                    </td>
                                </tr>;
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            (/* TODO: unify the three at the common /admin page */)
            <AdminInvitationsPage/>
            <AdminStudiosPage/>
        </div>;
    }
}

export { AdminUsersPage };
