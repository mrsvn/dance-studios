import React from "react";

import styled from 'styled-components';

const SliderSpan = styled.span`
  display: flex;
  flex-direction: row;

  span {
    padding-right: 1em;
  }

  input {
    flex-grow: 1;
  }
`;

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
        return <SliderSpan>
            <span>{(this.state.sliderValue / 10).toFixed(1)}</span>
            <input onChange={e => this.sliderChange(e.target.value)}
                   type="range"
                   min="0"
                   max="50"
                   value={this.state.sliderValue}/>
        </SliderSpan>;
    }
}

export { RatingSlider };
