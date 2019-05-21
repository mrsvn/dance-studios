
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Link, NavLink, Route, Switch } from "react-router-dom";

import { CityDropdown } from "./components/cityDropdown";
import { LoginCorner } from "./containers/loginCorner";
import { MainPage } from "./components/mainPage";
import { StudiosListPage } from "./containers/studiosListPage";
import { ClassesTablePage } from "./containers/classesTablePage";
import { StudioPage } from "./containers/studioPage";
import { ProfilePage } from "./containers/profilePage";
import { StudioManagePage } from "./containers/studioManagePage";
import { InvitationPage } from "./containers/invitationPage";
import { AdminPage } from "./containers/adminPage";
import cities from "./util/cities";

class AppRouter extends React.Component {
    constructor(props) {
        super(props);
    }

    defaultCity() {
        // TODO: derive from session state...
        return 'moscow';
    }

    render() {
        return <BrowserRouter>
            <header>
                <img alt="🕺" src="/img/logo-brand.png" className="brand-logo" />

                <span className="brand-title">
				NaSheste
                {/* TODO: implement the city dropdown for /classes */}
				<Switch>
                    <Route exact path="/studios" render={() => <CityDropdown value={this.defaultCity()}/>} />
                    <Route exact path="/:city/studios" render={props => <CityDropdown value={props.match.params.city}/>} />
                    <Route render={() => <div style={{minWidth: '5em'}}/>} />
                </Switch>
			</span>

                <nav>
                    <NavLink exact to="/" className="nav-item" activeClassName="nav-current">Главная</NavLink>
                    <NavLink exact to="/studios" className="nav-item" activeClassName="nav-current">Студии</NavLink>
                    <NavLink exact to="/classes" className="nav-item" activeClassName="nav-current">Занятия</NavLink>
                </nav>

                <LoginCorner/>
            </header>

            {/* TODO: city parameter */}
            <Route exact path="/" component={MainPage} />
            <Route exact path="/studios" component={StudiosListPage} />
            { cities.map(city => <Route key={city.id} exact path={`/${city.id}/studios`} render={() => <StudiosListPage city={city.id}/>} />) }
            <Route exact path="/studios/:urlBit" component={StudioPage} />
            <Route path="/studios/:urlBit/manage" component={StudioManagePage} />
            <Route path="/classes/" component={ClassesTablePage} />
            <Route path="/profile/" component={ProfilePage} />
            <Route path="/admin" component={AdminPage} />
            <Route exact path="/invite/:secret" component={InvitationPage} />
        </BrowserRouter>;
    }
}

window.addEventListener('load', () => {
    ReactDOM.render(<AppRouter/>, document.querySelector('.wrap-page'));
});
