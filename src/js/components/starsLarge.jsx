import React from 'react';

import styled from 'styled-components';

const StarsDiv = styled.div`
  .rating-text {
    font-weight: 200;
    font-size: 0.75em; // REMOVE
  }

  .stars {
    position: relative;
  }

  img {
    height: 1em;
  }

  .stars-on {
    position: absolute;
    left: 0;

    overflow-x: hidden;
    white-space: nowrap;
  }
`;

class StarsLarge extends React.Component {
    render() {
        // TODO: FIX THE VERTICAL ALIGNMENT OF DIGITS

        return <StarsDiv>
            <span className="rating-text">
                { this.props.rating }
            </span>
            <span className="stars">
                <span className="stars-off">
                    <img src={"/img/star-off.svg"}/>
                    <img src={"/img/star-off.svg"}/>
                    <img src={"/img/star-off.svg"}/>
                    <img src={"/img/star-off.svg"}/>
                    <img src={"/img/star-off.svg"}/>
                </span>
                <span className="stars-on" style={{width: (this.props.rating / 5 * 100) + '%'}}>
                    <img src={"/img/star-on.svg"}/>
                    <img src={"/img/star-on.svg"}/>
                    <img src={"/img/star-on.svg"}/>
                    <img src={"/img/star-on.svg"}/>
                    <img src={"/img/star-on.svg"}/>
                </span>
            </span>
        </StarsDiv>;
    }
}

export { StarsLarge };
