
import React from "react";
import ReactDOM from "react-dom";

import styled from 'styled-components';

import { subwayMoscow } from "./util/subway";

import { LoginCorner } from "./containers/loginCorner";

class Listing extends React.Component {
    render() {
        const content = this.props.content;

        let tag_links = [];

        content.tags.forEach(tag => {
            tag_links.push(<>
                <a href='#'>{tag}</a>
                &nbsp;
            </>);
        });

        return (
            <div className={'posting'}>
                <div className={'p-thumbnail'}>
                  <img src={content.imgUrl}>
                  </img>
                </div>
              <div className={'p-body'}>
                <div className={'p-details'}>
                <h3 className={'p-title'}>{ content.title }</h3>

                  <div className={'p-tags'}>
                      <p>{ tag_links }</p>
                  </div>
                  <div className={'p-row'}>
                    <b>Расположение:</b> <span> м. { content.location } </span>
                  </div>
                  <div className={'p-description'}>
                    <p>{ content.description }</p>
                  </div>
                </div>
                <div className={ 'p-link' }>
                  <a href={`/studio/${ content.urlBit}`}>Подробнее &rarr;</a>
                </div>
              </div>
            </div>
        );
    }
}

class RatingSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliderValue: 25
    };
  }

  sliderChange(newValue) {
    this.setState({
      sliderValue: newValue
    });

    this.props.onChange(newValue / 10);
  }

  render() {
    return (
        <span>
          <span>{(this.state.sliderValue / 10).toFixed(1)}</span>
          <input
              onChange={e => this.sliderChange(e.target.value)}
              type="range"
              min="0"
              max="50"
              value={this.state.sliderValue}
          />
        </span>
    );
  }
}

class ListingFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="postings-filter">
          <div className="search-query-container">
            <input onChange={e => this.props.onQueryChange(e.target.value)} id="search-query" placeholder="Поиск по названию" autoFocus={true} />
            <button className="search-query-showfilters" id="show-filters">
              <img src="img/filter.svg" />
            </button>
            <button className="search-query-submit" type="submit">
              <img src="img/search.svg" />
            </button>
          </div>

          <div id="postings-filters-form">
            <select onChange={e => this.props.onStyleChange(e.target.value)}>
              <option disabled={true} selected={true}>Направление</option>
              <option>джаз</option>
              <option>модерн</option>
              <option>джаз-модерн</option>
              <option>бачата</option>
            </select>
            <select onChange={e => this.props.onLocationChange(e.target.value)}>
              <option disabled={true} selected={true}>Станция метро</option>
              {
                subwayMoscow.map((stationName, i) => <option key={i}>{stationName}</option>)
              }
            </select>
            <RatingSlider onChange={v => this.props.onRatingChange(v)} />
          </div>
        </div>
    )
  }

}

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
          <ListingFilter onQueryChange={q => this.handleQueryChange(q)}
                         onLocationChange={q => this.handleLocationChange(q)}
                         onStyleChange={q => this.handleStyleChange(q)}
                         onRatingChange={q => this.handleRatingChange(q)} />


          <div className="postings-count">
            Найдено <span>{ this.state.numTotal }</span> студий
          </div>


          <div className={'postings-container'}>
            { filteredData.map(datum => <Listing content={datum} />) }
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
