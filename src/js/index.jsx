
import React from "react";
import ReactDOM from "react-dom";

import styled from 'styled-components';

import { LoginCorner } from "./containers/loginCorner";
import { StudiosListPage } from "./containers/studiosListPage";

window.addEventListener('load', () => {
    ReactDOM.render(<LoginCorner/>, document.querySelector('#login-corner'));
    ReactDOM.render(<StudiosListPage/>, document.querySelector('#studio-list-page'));

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
