
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Link, NavLink, Route } from "react-router-dom";

import styled from 'styled-components';

import { LoginCorner } from "./containers/loginCorner";
import { StudiosListPage } from "./containers/studiosListPage";

class AppRouter extends React.Component {
    render() {
        return <BrowserRouter>
            <header>
                <img src="/img/logo-brand.png" className="brand-logo" />

                <span className="brand-title">
				NaSheste
				<span className="loc-options">
					<a href="#" className="loc-opt-current">Лос-Анджелес</a>
					<div className="loc-opt-dropdown" style={{display: 'none'}}>
						<a href="#" data-loc-value="los-angeles" style={{display: 'none'}}>Лос-Анджелес</a>
						<a href="#" data-loc-value="st-tropez">Сен-Тропе</a>
						<a href="#" data-loc-value="miami">Майами</a>
						<a href="#" data-loc-value="volzhsky">Волжский</a>
						<a href="#" data-loc-value="ivanovo">Иваново</a>
					</div>
				</span>
			</span>

                <nav>
                    <NavLink to="/" exact className="nav-item" activeClassName="nav-current">Главная</NavLink>
                    <NavLink to="/studios" className="nav-item" activeClassName="nav-current">Студии</NavLink>
                    <NavLink to="/classes" className="nav-item" activeClassName="nav-current">Занятия</NavLink>
                </nav>

                <LoginCorner/>
            </header>

            <Route exact path="/" component={() => <p>Under construction 🏠</p>} />
            <Route path="/studios/" component={StudiosListPage} />
            <Route path="/classes/" component={() => <p>Under construction 🌝</p>} />
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
