import React from 'react';

import styled from "styled-components";

import { StarsSmall } from "../components/starsSmall";
import { monthNames } from "../util/dateStrings";
import { tagNameById } from "../util/tags";

const ReviewDiv = styled.div`
  display: flex;
  
  .review-author img {
    height: 1.5em;
    
    border-radius: 0.75em;
  }
`;

class StudioReviews extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            reviews: []
        };
    }

    componentDidMount() {
        fetch(`/v1/studio/${this.props.urlBit}/reviews`).then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                reviews: data
            });
        });
    }

    render() {
        return <>
            {
                this.state.reviews.map(review => {
                    const createdAt = new Date(review.createdAt);

                    return <ReviewDiv key={review.createdAt}>
                        <div>
                            <div className="review-author">
                                <img src={`/v1/userpics/${review.email}`}/>
                                <span>{ review.firstName }</span>
                            </div>
                            <div className="review-class-title">{ tagNameById(review.tags) }</div>
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
                                <StarsSmall rating={review.rating}/>
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
        </>;
    }
}

export { StudioReviews };
