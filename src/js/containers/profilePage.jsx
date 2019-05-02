import React from 'react';

import styled from 'styled-components';
import { BrowserRouter, Route, NavLink } from "react-router-dom";

import { UserCalendar } from "./userCalendar";
import { ProfileEditForm } from "./profileEditForm";

const ProfileMain = styled.main`
  display: flex;

  .calendar-modes {
    text-align: right;
  }

  .dashboard-main {
    flex-grow: 1;
  }
  
  .link-current {
    font-weight: 500;
  }
`;

class ProfilePage extends React.Component {
    render() {
        // TODO: keep on the same page as profile display: editing, favourites

        return <BrowserRouter>
            <ProfileMain>
                <nav>
                    <ul>
                        <li><NavLink exact to="/profile/" activeClassName="link-current">Профиль</NavLink></li>
                        <li><NavLink to="/profile/calendar" activeClassName="link-current">Расписание</NavLink></li>
                        <li><a href="#">Избранные студии</a></li>
                        <li><NavLink to="/profile/edit" activeClassName="link-current">Редактировать профиль</NavLink></li>
                    </ul>
                </nav>
                <div className="dashboard-main">
                    <Route exact path="/profile" render={() => <div>Under construction 🏠</div>} />
                    <Route exact path="/profile/calendar" component={UserCalendar} />
                    <Route exact path="/profile/edit" component={ProfileEditForm} />
                </div>
            </ProfileMain>
        </BrowserRouter>;
    }
}

export { ProfilePage };
