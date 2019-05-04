import React from 'react';

import { Link, NavLink, Route } from "react-router-dom";

import { AdminUsersForm } from "./adminUsersForm";
import { AdminStudiosForm } from "./adminStudiosForm";
import { AdminInvitationsForm } from "./adminInvitationsForm";

class AdminPage extends React.Component {
    render() {
        return <div>
            <ul className="nav nav-pills nav-fill m-2">
                <li className="nav-item">
                    <NavLink exact={true} to="/admin" className="nav-link" activeClassName="active">Информация</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/users" className="nav-link" activeClassName="active">Пользователи</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/studios" className="nav-link" activeClassName="active">Студии</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/invitations" className="nav-link" activeClassName="active">Приглашения</NavLink>
                </li>
                <li className="nav-item">
                    <a className="nav-link disabled" href="#">Еще че-нибудь</a>
                </li>
            </ul>

            <Route exact path="/admin" render={() => <p className="m-2">Under construction 👀</p>}/>
            <Route exact path="/admin/users" component={AdminUsersForm}/>
            <Route exact path="/admin/studios" component={AdminStudiosForm}/>
            <Route exact path="/admin/invitations" component={AdminInvitationsForm}/>
        </div>;
    }
}

export { AdminPage };
