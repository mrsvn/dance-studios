import React from "react";

import { Link } from "react-router-dom";

import styled from 'styled-components';

import { YMaps, Map, GeoObject } from 'react-yandex-maps';
import { getCurrentUser } from "../util/sessionData";
import { StudioSchedule } from "./studioSchedule";

const StudioPageDiv = styled.div`
  #studio-image {
      overflow: hidden;
      height: 250px;
      width: 100vw;
      position: relative;
  }
  #studio-image img {
      //height: 250px;
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
  }

  #studio-information-container {
      display: flex;
      max-width: 1000px;
      margin: 0 auto;
  }

  #studio-main-stuff {
    max-width: 1000px;
    margin: 0 auto;
  }

  #studio-information {
      width: 70%;
      /*background: #c4d9ff;*/
  }
  #studio-map-and-hours {
      width: 30%;
      /*background: #ba89cc;*/
  }

  #studio-heading {
      display: flex;
      justify-content: space-between;
  }
  .studio-review {
      display: flex;
  }
  .review-metadata {
      display: flex;
  }

  .studio-map {
      width: 100%;
      height: 25em;
  }
`;

class StudioPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      canEdit: false
    };

    console.log(props);

    this.urlBit = this.props.match.params.urlBit;
  }

  componentDidMount() {
    // Studio profile
    fetch(`/v1/studio/${this.urlBit}`).then(response => {
      return response.json();
    }).then(data => {
      this.setState({
        data: data.studio
      });
    }).catch(error => {
      console.log(error);
    });

    getCurrentUser().then(user => {
      if(user && (user.isAdmin || user.managedStudio === this.urlBit)) {
        this.setState({ canEdit: true });
      }
    });
  }

  handleEnroll(e, classId) {
    e.preventDefault();

    fetch("/v1/enrollments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        classId: classId
      })
    }).then(response => {
      return response.json();
    }).then(data => {
      console.log(data);
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    console.log(this.state);
    return (
      <StudioPageDiv>
        <div id="studio-image">
          <img alt="" src={this.state.data.imgUrl}/>
        </div>

        <div id="studio-information-container">
          <div id="studio-information">
            <div id="studio-heading">
              <div>
                <h1>
                  { this.state.data.title }
                  { this.state.canEdit && <Link to={`/studios/${this.urlBit}/manage`} className="btn btm-sm btn-primary ml-3">Редактировать</Link> }
                </h1>
              </div>
              <div id="studio-rating">
                {this.state.data.rating}
              </div>
            </div>
            <p>
              {
                this.state.data.tags && this.state.data.tags.map(tag => {
                  return <a href={`#${tag}`} className="btn btn-sm btn-link" key={tag}>{tag}</a>;
                })
              }
            </p>

            <div>
              {
                this.state.data.description && this.state.data.description.map((p, i) => <p key={i}>{ p }</p>)
              }
            </div>
          </div>
          <div id="studio-map-and-hours">
            {
              this.state.data.mapCoords && (
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
              )
            }
            <p>
              Москва / Дорогомиловская <br/>
              ул. Ветеранов, д. 14/88
            </p>
          </div>

        </div>
        <div id="studio-main-stuff">
          <hr/>

          <h4>Расписание занятий</h4>

          <StudioSchedule urlBit={this.urlBit}/>

          <hr/>

          <div>
            <h4>Отзывы</h4>
            <div>звездочки</div>
          </div>

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
      </StudioPageDiv>
    );
  }
}

export { StudioPage };

// ReactDOM.render(<StudioPage/>, document.querySelector('#studio-page'));
