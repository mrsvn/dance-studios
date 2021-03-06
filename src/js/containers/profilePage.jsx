import React from 'react';

import styled from 'styled-components';
import { BrowserRouter, Route, NavLink } from "react-router-dom";

import { UserCalendar } from "./userCalendar";
import { ProfileEditForm } from "./profileEditForm";
import { FavouriteStudiosList } from "./favouriteStudiosList";
import { ClassReviewForm } from "./classReviewForm";
import { UserReviews } from "./userReviews";
import { getCurrentUser } from "../util/sessionData";

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

        getCurrentUser().then(user => {
            if(!user) {
                this.props.history.push({
                    pathname: '/studios'
                });
            }
        });

        return <BrowserRouter>
            <ProfileMain>
                <nav>
                    <ul>
                        <li><NavLink exact to="/profile/" activeClassName="link-current">Профиль</NavLink></li>
                        <li><NavLink to="/profile/calendar" activeClassName="link-current">Расписание</NavLink></li>
                        <li><NavLink to="/profile/favourites" activeClassName="link-current">Избранные студии</NavLink></li>
                        <li><NavLink to="/profile/reviews" activeClassName="link-current">Мои отзывы</NavLink></li>
                        <li><NavLink to="/profile/edit" activeClassName="link-current">Редактировать профиль</NavLink></li>
                    </ul>
                </nav>
                <div className="dashboard-main">
                    <Route exact path="/profile" render={() => <div>Under construction 🏠</div>} />
                    <Route exact path="/profile/calendar" component={UserCalendar} />
                    <Route exact path="/profile/favourites" component={FavouriteStudiosList} />
                    <Route exact path="/profile/reviews" component={UserReviews} />
                    <Route exact path="/profile/reviews/new/:classId" component={ClassReviewForm} />
                    <Route exact path="/profile/edit" component={ProfileEditForm} />
                </div>
            </ProfileMain>
        </BrowserRouter>;
    }
}

export { ProfilePage };
