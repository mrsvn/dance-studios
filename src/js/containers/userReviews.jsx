import React from 'react';
import { monthNames } from "../util/dateStrings";
import styled from "styled-components";

const ReviewDiv = styled.div`
  display: flex;
  
  .review-author img {
    height: 1.5em;
    
    border-radius: 0.75em;
  }
  
  div {
    margin-left: 1em;
  }
`;

class UserReviews extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: []
        };
    }

    componentDidMount() {
        fetch('/v1/profile/reviews').then(response => {
            return response.json();
        }).then(data => {
            this.setState({reviews: data});
        });
    }

    render() {
        console.log(this.state.reviews);

        return <div>
            {
                this.state.reviews.map(review => {
                    const createdAt = new Date(review.createdAt);

                    return <ReviewDiv key={review._id}>
                        <div>
                            <div className="review-class-title">{ review.classTitle }</div>
                            <div className="review-date">
                                {
                                    createdAt.getDate()
                                } {
                                    monthNames[createdAt.getMonth()]
                                } {
                                    createdAt.getFullYear()
                                }
                            </div>
                        </div>
                        <div className="review-content">
                            <div>
                                { review.rating }
                                {/*★★★★☆*/}
                            </div>
                            {
                                review.content && <div>
                                    { review.content }
                                </div>
                            }
                        </div>
                    </ReviewDiv>;
                })
            }
        </div>;
    }
}

export { UserReviews };
