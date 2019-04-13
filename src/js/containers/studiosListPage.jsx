import React from "react";

import { StudioFilters } from "../components/studioFilters";
import { StudioListing } from "../components/studioListing";

class StudiosListPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            numTotal: null,
            searchQuery: "",
            filterLocation: null,
            filterStyle: null,
            filterRating: null
        };
    }

    handleQueryChange(newQuery) {
        this.setState({
            searchQuery: newQuery
        });
    }

    handleLocationChange(newLocation) {
        this.setState({
            filterLocation: newLocation
        });
    }

    handleStyleChange(newStyle) {
        this.setState({
            filterStyle: newStyle
        });
    }

    handleRatingChange(newRating) {
        this.setState({
            filterRating: newRating
        });
    }

    componentDidMount() {
        fetch("/v1/studios/los-angeles").then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                data: data.studios,
                numTotal: data.numTotal
            });
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        let filteredData = [];

        this.state.data.forEach(item => {
            if (item.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
                if (item.location === this.state.filterLocation || this.state.filterLocation === null) {
                    if (item.tags.includes(this.state.filterStyle) || this.state.filterStyle === null) {
                        if (item.rating >= this.state.filterRating) {
                            filteredData.push(item);
                        }
                    }
                }
            }
        });

        return (
            <>
                <div className="map-top" id="ymap" style={{background: 'pink'}}></div>

                <main id="listings">
                    <StudioFilters onQueryChange={q => this.handleQueryChange(q)}
                                   onLocationChange={q => this.handleLocationChange(q)}
                                   onStyleChange={q => this.handleStyleChange(q)}
                                   onRatingChange={q => this.handleRatingChange(q)} />


                    <div className="postings-count">
                        Найдено <span>{ this.state.numTotal }</span> студий
                    </div>


                    <div className={'postings-container'}>
                        { filteredData.map(datum => <StudioListing content={datum} />) }
                    </div>

                    <div id="postings-more">
                        <a href="#">Следующие 20</a>
                    </div>
                </main>
            </>
        )
    }
}

export { StudiosListPage };
