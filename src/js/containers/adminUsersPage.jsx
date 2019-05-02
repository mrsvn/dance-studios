import React from "react";

class AdminUsersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            studios: []
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

    render() {
        return <div>
            <div className="card">
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
                                        <a href="#" className="btn btn-sm btn-danger" onClick={e => this.handleDeleteClick(user._id, e)}>
                                            Удалить
                                        </a>
                                    </td>
                                </tr>
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card">
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
                                return <tr>
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
