
import React from "react";
import ReactDOM from "react-dom";

import styled from 'styled-components';

import { subwayMoscow } from "./util/subway";

import { LoginCorner } from "./containers/loginCorner";
import { RatingSlider } from "./components/ratingSlider";

import { StudioListing } from "./components/studioListing";
import { StudioFilters } from "./components/studioFilters";

class ListingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      numTotal: null,
      searchQuery: "",
      filterLocation: null,
      filterStyle: null,
      filterRating: null
    };
  }

  handleQueryChange(newQuery) {
    this.setState({
      searchQuery: newQuery
    });
  }

  handleLocationChange(newLocation) {
    this.setState({
      filterLocation: newLocation
    });
  }

  handleStyleChange(newStyle) {
    this.setState({
      filterStyle: newStyle
    });
  }

  handleRatingChange(newRating) {
    this.setState({
      filterRating: newRating
    });
  }

  componentDidMount() {
    fetch("/v1/studios/los-angeles").then(response => {
      return response.json();
    }).then(data => {
      this.setState({
        data: data.studios,
        numTotal: data.numTotal
      });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    let filteredData = [];

    this.state.data.forEach(item => {
      if (item.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
        if (item.location === this.state.filterLocation || this.state.filterLocation === null) {
          if (item.tags.includes(this.state.filterStyle) || this.state.filterStyle === null) {
            if (item.rating >= this.state.filterRating) {
              filteredData.push(item);
            }
          }
        }
      }
    });

    return (
        <>
          <StudioFilters onQueryChange={q => this.handleQueryChange(q)}
                         onLocationChange={q => this.handleLocationChange(q)}
                         onStyleChange={q => this.handleStyleChange(q)}
                         onRatingChange={q => this.handleRatingChange(q)} />


          <div className="postings-count">
            Найдено <span>{ this.state.numTotal }</span> студий
          </div>


          <div className={'postings-container'}>
            { filteredData.map(datum => <StudioListing content={datum} />) }
          </div>

          <div id="postings-more">
            <a href="#">Следующие 20</a>
          </div>
        </>
    )
  }
}

window.addEventListener('load', () => {
    ReactDOM.render(<LoginCorner/>, document.querySelector('#login-corner'));
    ReactDOM.render(<ListingsPage/>, document.querySelector('#listings'));

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
