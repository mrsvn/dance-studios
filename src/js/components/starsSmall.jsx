import React from 'react';

import styled from 'styled-components';

const StarsDiv = styled.div`
  position: relative;

  display: inline-block;

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

class StarsSmall extends React.Component {
    render() {
        // TODO: display hidden text (for screen reader)
        return <StarsDiv>
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
        </StarsDiv>;
    }
}

export { StarsSmall };
