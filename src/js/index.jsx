
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Link, NavLink, Route } from "react-router-dom";

import { CityDropdown } from "./components/cityDropdown";
import { LoginCorner } from "./containers/loginCorner";
import { StudiosListPage } from "./containers/studiosListPage";
import { ClassesTablePage } from "./containers/classesTablePage";
import { StudioPage } from "./containers/studioPage";
import { ProfilePage } from "./containers/profilePage";
import { StudioManagePage } from "./containers/studioManagePage";
import { InvitationPage } from "./containers/invitationPage";
import { AdminPage } from "./containers/adminPage";

class AppRouter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            city: 'los-angeles'
        };
    }

    handleCityChange(city) {
        // TODO: do stuff to local and session storage...
        this.setState({ city: city });
    }

    render() {
        return <BrowserRouter>
            <header>
                <img alt="🕺" src="/img/logo-brand.png" className="brand-logo" />

                <span className="brand-title">
				NaSheste
				<CityDropdown value={this.state.city} onChange={city => this.handleCityChange(city)}/>
			</span>

                <nav>
                    <NavLink to="/" exact className="nav-item" activeClassName="nav-current">Главная</NavLink>
                    <NavLink to="/studios" className="nav-item" activeClassName="nav-current">Студии</NavLink>
                    <NavLink to="/classes" className="nav-item" activeClassName="nav-current">Занятия</NavLink>
                </nav>

                <LoginCorner/>
            </header>

            {/* TODO: city parameter */}
            <Route exact path="/" component={() => <p>Under construction 🏠</p>} />
            <Route exact path="/studios" component={StudiosListPage} />
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
