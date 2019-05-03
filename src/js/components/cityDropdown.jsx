import React from "react";

import styled from 'styled-components';

import cities from "../util/cities";

const CityDropdownDiv = styled.div`
    padding-left: .5em;
    padding-top: .75em;

    position: relative;

    font-size: .5em;
    vertical-align: bottom;

    &::after {
        content: "";
        display: inline-block;

        width: 0;
    }

    .loc-opt-current {
        padding: 0 2px;
        border: 1px transparent solid;

        text-decoration: none;

        color: black;
        opacity: .75;
    }

    .loc-opt-current:hover {
        color: black;
        border: 1px black dotted;
    }

    .loc-opt-current::after {
        content: "";
        display: inline-block;

        width: 0;
        height: 0;

        margin-left: .25em;
        margin-right: .25em;

        vertical-align: middle;

        border-top: .3em solid;
        border-right: .3em solid transparent;
        border-bottom: 0;
        border-left: .3em solid transparent;

        opacity: .75;
    }

    .loc-opt-dropdown {
        position: absolute;
        z-index: 10;

        background: white;
        border: 1px solid rgba(0, 0, 0, .15);
        border-radius: 5px;

        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .loc-opt-dropdown a {
        padding: 10px 0;
        padding-left: 2px;

        color: black;
        text-decoration: none;
    }

    .loc-opt-dropdown a:hover {
        background: rgba(0, 0, 0, .25);
    }
`;

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
        return <CityDropdownDiv className="loc-options">
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
        </CityDropdownDiv>;
    }
}

export { CityDropdown };
