import React from "react";

import { RatingSlider } from "./ratingSlider";
import { tags } from "../util/tags";

class StudioFilters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tag: 'null',
            district: 'null'
        };
    }

    handleTagChange(e) {
        const v = e.target.value;

        this.props.onStyleChange(v === 'null' ? null : v);

        this.setState({
            tag: v
        });
    }

    handleDistrictChange(e) {
        const v = e.target.value;

        this.props.onLocationChange(v === 'null' ? null : v);

        this.setState({
            district: v
        });
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

                <div id="postings-filters-form" className="row">
                    <div className="col-4">
                        <select className="form-control form-control-sm" onChange={e => this.handleTagChange(e)} value={this.state.tag}>
                            <option value="null">Направление</option>
                            {
                                tags.map(tag => {
                                    return <option key={tag.id} value={tag.id}>{tag.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="col-4">
                        <select className="form-control form-control-sm" onChange={e => this.handleDistrictChange(e)} value={this.state.district}>
                            <option value="null">Район</option>
                            {
                                this.props.city.districts.map(district => {
                                    return <option key={district.id} value={district.id}>{district.name}</option>;
                                })
                            }
                        </select>
                    </div>
                    <div className="col-4">
                        <RatingSlider onChange={v => this.props.onRatingChange(v)} />
                    </div>
                </div>
            </div>
        );
    }
}

export { StudioFilters };
