import React from 'react';

import styled from 'styled-components';
import { Link } from "react-router-dom";

const FavItemDiv = styled.div`
  display: inline-block;

  border: 1px gray dotted;
  padding: 1em 2em;
  margin: 0.5em;
  
  .fav-link {
    margin-right: 2em;
  }
  
  .fav-star {
    cursor: pointer;
    
    display: inline-block;
    transform: scale(1.5);
    
    &.fav-star-on {
      color: #f3c949;
      text-shadow: 0 0 2px black;
    
      &::before {
        content: "★";
      }
    }
    
    &.fav-star-off {
      color: gray;
    
      &::before {
        content: "☆";
      }
    }
  }
`;

/**
 * The star should be yellow (.fav-star-on) when the item is in favourites, gray (fav-star-off) otherwise.
 *
 * When the star is clicked, the favourite state of the item is toggled via following endpoints:
 *   - POST /v1/favourites/:studioId -- add the item to favourites
 *   - DELETE /v1/favourites/:studioId -- remove the item from favourites
 *
 * While the request is in progress, a spinner should be displayed NEXT TO the star, and the star should be inactive
 * (no reaction to clicks, cursor: default).
 *
 * Be sure to carefully process errors (the .catch branch of the fetch() future) and cases where server reports NO_OP.
 */
class FavouriteStudioItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isActive: Math.random() < 0.5 // TODO: remove this
        };
    }

    render() {
        return <FavItemDiv>
            <Link to={`/studios/${this.props.urlBit}`} className="fav-link">{ this.props.title }</Link>
            {
                this.state.isActive ? (
                    <span className="fav-star fav-star-on"/>
                ) : (
                    <span className="fav-star fav-star-off"/>
                )
            }
        </FavItemDiv>;
    }
}

export { FavouriteStudioItem };
