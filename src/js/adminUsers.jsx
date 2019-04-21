import React from 'react';
import ReactDOM from "react-dom";

class AdminUsers extends React.Component {
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
                        <tr>
                            <td>d@k.com</td>
                            <td>Павел</td>
                            <td>Драньков</td>
                            <td>male</td>
                            <td>1997-03-17</td>
                            <td>miami</td>
                            <td>
                                <a href="#" className="btn btn-sm btn-danger">Удалить</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

ReactDOM.render(<AdminUsers/>, document.querySelector('#admin-users'));
