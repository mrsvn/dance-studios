import React from "react";
import ReactDOM from "react-dom";

import { YMaps, Map, GeoObject } from 'react-yandex-maps';

class StudioPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    fetch("/v1/studio/" + location.pathname.split('/').pop()).then(response => {
      return response.json();
    }).then(data => {
      this.setState({
        data: data.studio
      });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <div id="studio-image">
          <img src={this.state.data.imgUrl}/>
        </div>

        <div id="studio-information-container">
          <div id="studio-information">
            <div id="studio-heading">
              <div>
                <h1>{this.state.data.title}</h1>
                <p>Multiple locations</p>
              </div>
              <div id="studio-rating">
                <div>{this.state.data.rating}</div>
              </div>
            </div>

            <div>
              {
                this.state.data.description && this.state.data.description.map(p => <p>{ p }</p>)
              }
            </div>

            <hr/>

            <div>
              <p>Отзывы:</p>
              <div>звездочки</div>
            </div>
            <hr/>

            {/*<div className="studio-review">*/}
              {/*<div className="review-author">*/}
                {/*<img src="http://placehold.jp/64x64.png"/>*/}
                  {/*<div className="">Gennady Pr</div>*/}
              {/*</div>*/}

              {/*<div className="review-content">*/}
                {/*<div className="review-text">В касание</div>*/}
                {/*<div className="review-metadata">*/}
                  {/*<div className="review-date">Февраль, 2019 </div>*/}
                  {/*<div className="review-rating">★★★★☆</div>*/}
                {/*</div>*/}
              {/*</div>*/}
            {/*</div>*/}

            {
              this.state.data.reviews && this.state.data.reviews.map(review => {
                let ratingStars = "";
                for (let i = 0; i < review.rating; i++) {
                  ratingStars += "★";
                }
                for (let i = 0; i < 10-review.rating; i++) {
                  ratingStars += "☆";
                }
                return (
                    <div className="studio-review">
                      <div className="review-author">
                        <img src={review.userpic}/>
                        <div className="">{review.username}</div>
                      </div>

                      <div className="review-content">
                        <div className="review-text">{review.textContent}</div>
                        <div className="review-metadata">
                          <div className="review-date">{review.date}</div>
                          <div className="review-rating">{ratingStars}</div>
                        </div>
                      </div>
                    </div>
                )
              })
            }


          </div>
          <div id="studio-map-and-hours">
            <YMaps>
              <Map className="studio-map" defaultState={{ center: this.state.data.mapCoords, zoom: 11 }}>
                <GeoObject geometry={{
                  type: 'Point',
                  coordinates: this.state.data.mapCoords
                }} properties={{
                  balloonContent: `<strong>${this.state.data.title}</strong>`
                }}/>
              </Map>
            </YMaps>
          </div>

        </div>
      </div>
    );
  }
}

ReactDOM.render(<StudioPage/>, document.querySelector('#studio-page'));
