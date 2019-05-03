
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Link, NavLink, Route } from "react-router-dom";

import styled from 'styled-components';

import { LoginCorner } from "./containers/loginCorner";
import { StudiosListPage } from "./containers/studiosListPage";
import { ClassesTablePage } from "./containers/classesTablePage";
import { StudioPage } from "./containers/studioPage";
import { ProfilePage } from "./containers/profilePage";
import { AdminUsersPage } from "./containers/adminUsersPage";
import { StudioEditPage } from "./containers/studioEditPage";
import { InvitationPage } from "./containers/invitationPage";

import cities from './util/cities';

class LocOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            location: 'los-angeles',
            isExpanded: false
        };
    }

    handleCurrentClick(e) {
        e.preventDefault();

        this.setState({ isExpanded: !this.state.isExpanded });
    }

    handleOptionClick(e) {
        e.preventDefault();

        this.setState({
            location: e.target.dataset.locValue,
            isExpanded: false
        });
    }

    render() {
        let selectedName = "";

        cities.forEach(city => {
            if(city.id === this.state.location) {
                selectedName = city.name;
            }
        });

        return <span className="loc-options">
            <a href="#" className="loc-opt-current" onClick={e => this.handleCurrentClick(e)}>{ selectedName }</a>
            <div className="loc-opt-dropdown" style={{display: this.state.isExpanded ? 'flex' : 'none'}}>
                {
                    cities.map(city => {
                        if(city.id === this.state.location) {
                            return null;
                        }

                        return <a href="#" key={city.id} data-loc-value={city.id} onClick={e => this.handleOptionClick(e)}>{city.name}</a>;
                    })
                }
            </div>
        </span>;
    }
}

class AppRouter extends React.Component {
    render() {
        return <BrowserRouter>
            <header>
                <img alt="🕺" src="/img/logo-brand.png" className="brand-logo" />

                <span className="brand-title">
				NaSheste
				<LocOptions/>
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
            <Route exact path="/studios/:urlBit/edit" component={StudioEditPage} />
            <Route path="/classes/" component={ClassesTablePage} />
            <Route path="/profile/" component={ProfilePage} />
            <Route exact path="/admin/users" component={AdminUsersPage} />
            <Route exact path="/invite/:secret" component={InvitationPage} />
        </BrowserRouter>;
    }
}

window.addEventListener('load', () => {
    ReactDOM.render(<AppRouter/>, document.querySelector('.wrap-page'));

    // document.querySelector('#postings-more').onclick = e => {
    //     e.preventDefault();
    //     loadData();
    // };

    // const locOptions = document.querySelector('.loc-options');
    // const locCurrent = locOptions.querySelector('.loc-opt-current');
    // const locDropdown = locOptions.querySelector('.loc-opt-dropdown')
    // const locVariants = Array.from(locOptions.querySelectorAll('a'));
    //
    // locOptions.querySelector('.loc-opt-current').onclick = e => {
    //     e.preventDefault();
    // };
    //
    // locOptions.querySelector('.loc-opt-current').onfocus = e => {
    //     locDropdown.style.display = null;
    // };
    //
    // locVariants.forEach(el => {
    //     if(el.dataset.locValue) {
    //         el.onclick = e => {
    //             e.preventDefault();
    //
    //             if(!locOptions.style.minWidth) {
    //                 locOptions.style.minWidth = e.target.clientWidth + 'px';
    //             }
    //
    //             locCurrent.textContent = el.textContent;
    //
    //             el.style.display = 'none';
    //
    //             locVariants.forEach(otherEl => {
    //                 otherEl.style.display = (el.dataset.locValue === otherEl.dataset.locValue) ? 'none' : null;
    //             });
    //         }
    //     }
    //
    //     el.onblur = e => {
    //         if(!e.relatedTarget || e.relatedTarget.parentNode !== locOptions.querySelector('.loc-opt-dropdown')) {
    //             locDropdown.style.display = 'none';
    //         }
    //     };
    //
    //     el.onkeydown = e => {
    //         if(e.key === 'Escape') {
    //             e.target.blur();
    //         }
    //     };
    // });
});
