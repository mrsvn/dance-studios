import React from "react";
import ReactDOM from "react-dom";

import styled from 'styled-components';

import { YMaps, Map, GeoObject } from 'react-yandex-maps';

const StudioPageDiv = styled.div`
  #studio-image {
      overflow: hidden;
      height: 400px;
      position: relative;
  }
  #studio-image img {
      /*height: 400px;*/
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
  }

  #studio-information-container {
      display: flex;
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
      classes: []
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

    // Studio schedule
    fetch(`/v1/studio/${this.urlBit}/classes`).then(response => {
      return response.json();
    }).then(data => {
      if(data.status === 'OK') {
        this.setState({
          classes: data.classes
        });
      }
      else {
        console.log(data);
      }
    }).catch(error => {
      console.log(error);
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
    return (
      <StudioPageDiv>
        <div id="studio-image">
          <img src={this.state.data.imgUrl}/>
        </div>

        <div id="studio-information-container">
          <div id="studio-information">
            <div id="studio-heading">
              <div>
                <h1>{this.state.data.title}</h1>
                <p>Multiple locations</p>
                {/* TODO: display tags */}
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

            {
              this.state.classes.map(classInfo => {
                return <div key={classInfo._id}>
                  <pre>{ JSON.stringify(classInfo, null, 4) }</pre>
                  <a href="#" onClick={e => this.handleEnroll(e, classInfo._id)}>Записаться!</a>
                </div>;
              })
            }

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
      </StudioPageDiv>
    );
  }
}

export { StudioPage };

// ReactDOM.render(<StudioPage/>, document.querySelector('#studio-page'));
