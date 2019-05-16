import React from 'react';

import styled from 'styled-components';

const StarsDiv = styled.div`
  position: relative;

  img {
    height: 1em;
  }

  div {
    display: inline;
  }

  .stars-on {
    position: absolute;
    left: 0;

    overflow-x: hidden;
    white-space: nowrap;
  }
`;

class StarsSmall extends React.Component {
    render() {
        return <StarsDiv>
            <div className="stars-off">
                <img src={"/img/star-off.svg"}/>
                <img src={"/img/star-off.svg"}/>
                <img src={"/img/star-off.svg"}/>
                <img src={"/img/star-off.svg"}/>
                <img src={"/img/star-off.svg"}/>
            </div>
            <div className="stars-on" style={{width: (this.props.rating / 5 * 100) + '%'}}>
                <img src={"/img/star-on.svg"}/>
                <img src={"/img/star-on.svg"}/>
                <img src={"/img/star-on.svg"}/>
                <img src={"/img/star-on.svg"}/>
                <img src={"/img/star-on.svg"}/>
            </div>
        </StarsDiv>;
    }
}

export { StarsSmall };
