import React from "react";

class AdminUsersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            studios: [],
            invitations: [],
            isSending: false
        };
    }

    loadInvitations() {
        fetch("/v1/invitations").then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                invitations: data.invitations
            });
        }).catch(error => {
            console.log(error);
        });
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

        this.loadInvitations();

        fetch("/v1/studios").then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                studios: data.studios
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

    handleNewInvitationClick() {
        this.setState({isSending: true});

        fetch("/v1/invitations", { method: 'POST' }).then(response => {
            return response.json();
        }).then(() => {
            this.setState({isSending: false});
            this.loadInvitations();
        }).catch(error => {
            console.log(error);
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
            <div className="card m-2">
                <h5 className="card-header">Ссылки-приглашения менеджерам</h5>
                <div className="card-body">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Ссылка</th>
                            <th scope="col">Создана</th>
                            <th scope="col">Действительна до</th>
                            <th scope="col">&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.invitations.map(invitation => {
                                return <tr key={invitation.secret}>
                                    <td>{invitation.secret}</td>
                                    <td>{invitation.createdAt}</td>
                                    <td>{invitation.expiresAt}</td>
                                    <td>
                                        <a href="#" className="btn btn-sm btn-danger">Удалить</a>
                                    </td>
                                </tr>;
                            })
                        }
                        </tbody>
                    </table>

                    <button className="btn btn-primary" onClick={() => this.handleNewInvitationClick()} disabled={this.state.isSending}>
                        Создать новое приглашение
                    </button>
                </div>
            </div>
            <div className="card m-2">
                <h5 className="card-header">Студии</h5>
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Название</th>
                                <th scope="col">Менеджер</th>
                                <th scope="col">URL</th>
                                <th scope="col">Город</th>
                                <th scope="col">Отображается</th>
                                <th scope="col">&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.studios.map(studio => {
                                return <tr key={studio.urlBit}>
                                    <td>{studio.title}</td>
                                    <td>—</td>
                                    <td>/{studio.urlBit}</td>
                                    <td>{studio.city}</td>
                                    <td>{studio.isShown ? "да" : "нет"}</td>
                                    <td className="p-2">
                                        <a href="#" className="btn btn-sm btn-primary">Редактировать</a>
                                        &nbsp;
                                        <a href="#" className="btn btn-sm btn-danger">Удалить</a>
                                    </td>
                                </tr>;
                            })
                        }
                        </tbody>
                    </table>

                    <a href="#" className="btn btn-primary">Создать новую студию</a>
                </div>
            </div>
        </div>;
    }
}

export { AdminUsersPage };
