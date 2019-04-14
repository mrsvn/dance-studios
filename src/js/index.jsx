
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Link, Route } from "react-router-dom";

import styled from 'styled-components';

import { LoginCorner } from "./containers/loginCorner";
import { StudiosListPage } from "./containers/studiosListPage";

class AppRouter extends React.Component {
    render() {
        return <>
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
                    <a href="#" className="nav-item">Рекомендации</a>
                    <span className="nav-item nav-current">Студии</span>
                    <a href="#" className="nav-item">Занятия</a>
                </nav>

                <LoginCorner/>
            </header>

            <StudiosListPage/>
        </>;
    }
}

window.addEventListener('load', () => {
    ReactDOM.render(<AppRouter/>, document.querySelector('.wrap-page'));

    const gMapCanvas = document.getElementById('gmap_canvas');

    gMapCanvas.src = gMapCanvas.dataset.src;

    gMapCanvas.onload = () => {
        document.getElementById('gmap-spinner').style.display = 'none';
    };


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
