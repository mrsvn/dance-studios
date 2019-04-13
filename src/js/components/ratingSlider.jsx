import React from "react";

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
        return (
            <span>
          <span>{(this.state.sliderValue / 10).toFixed(1)}</span>
          <input
              onChange={e => this.sliderChange(e.target.value)}
              type="range"
              min="0"
              max="50"
              value={this.state.sliderValue}
          />
        </span>
        );
    }
}

export { RatingSlider };
