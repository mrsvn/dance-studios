import React from "react";

import styled from 'styled-components';

import cities from "../util/cities";

class CityDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false
        };
    }

    handleCurrentClick(e) {
        e.preventDefault();

        this.setState({ isExpanded: !this.state.isExpanded });
    }

    hideDropdown() {
        this.setState({ isExpanded: false });
    }

    handleCurrentKeyDown(e) {
        if(e.key === 'Escape') {
            this.setState({ isExpanded: false });
        }
    }

    handleOptionClick(e) {
        e.preventDefault();

        this.setState({ isExpanded: false });

        this.props.onChange(e.target.dataset.locValue);
    }

    render() {
        let selectedName = "";

        cities.forEach(city => {
            if(city.id === this.props.value) {
                selectedName = city.name;
            }
        });

        // TODO: hide on blur as well (make sure to still register an option click, though)
        return <span className="loc-options">
            <a href="#" className="loc-opt-current" onClick={e => this.handleCurrentClick(e)} onKeyDown={e => this.handleCurrentKeyDown(e)}>{ selectedName }</a>
            <div className="loc-opt-dropdown" style={{display: this.state.isExpanded ? 'flex' : 'none'}}>
                {
                    cities.map(city => {
                        if(city.id === this.props.value) {
                            return null;
                        }

                        return <a href="#" key={city.id} data-loc-value={city.id} onClick={e => this.handleOptionClick(e)}>{city.name}</a>;
                    })
                }
            </div>
        </span>;
    }
}

export { CityDropdown };
