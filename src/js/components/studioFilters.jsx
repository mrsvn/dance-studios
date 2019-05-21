import React from "react";

import { subwayMoscow } from "../util/subway";
import { RatingSlider } from "./ratingSlider";

class StudioFilters extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="postings-filter">
                <div className="search-query-container">
                    <input onChange={e => this.props.onQueryChange(e.target.value)} id="search-query" placeholder="Поиск по названию" autoFocus={true} />
                    <button className="search-query-showfilters" id="show-filters">
                        <img src="/img/filter.svg" />
                    </button>
                    <button className="search-query-submit" type="submit">
                        <img src="/img/search.svg" />
                    </button>
                </div>

                <div id="postings-filters-form">
                    <select onChange={e => this.props.onStyleChange(e.target.value)} value="Направление">
                        <option>Направление</option>
                        <option>джаз</option>
                        <option>модерн</option>
                        <option>джаз-модерн</option>
                        <option>бачата</option>
                    </select>
                    <select onChange={e => this.props.onLocationChange(e.target.value)} value="Станция метро">
                        <option>Станция метро</option>
                        {
                            subwayMoscow.map((stationName, i) => <option key={i}>{stationName}</option>)
                        }
                    </select>
                    <RatingSlider onChange={v => this.props.onRatingChange(v)} />
                </div>
            </div>
        );
    }
}

export { StudioFilters };
