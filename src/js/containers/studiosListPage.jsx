import React from "react";

import { YMaps, Map, Placemark } from 'react-yandex-maps';

import { StudioFilters } from "../components/studioFilters";
import { StudioListing } from "../components/studioListing";

import { cityById } from "../util/cities";

class StudiosListPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            numTotal: null,
            searchQuery: "",
            loadedCity: null,
            filterCity: null,
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

    static getDerivedStateFromProps(props, state) {
        return Object.assign({}, state, { filterCity: props.city || 'moscow' });
    }

    loadStudios() {
        const city = this.state.filterCity;

        fetch(`/v1/studios/${city}`).then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                data: data.studios,
                numTotal: data.numTotal,
                loadedCity: city
            });
        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.loadStudios();
    }

    componentDidUpdate() {
        if(this.state.loadedCity !== this.state.filterCity) {
            this.loadStudios();
        }
    }

    render() {
        let filteredData = [];

        this.state.data.forEach(item => {
            if (item.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
                if (item.district === this.state.filterLocation || this.state.filterLocation === null) {
                    if (item.tags.includes(this.state.filterStyle) || this.state.filterStyle === null) {
                        if (item.rating >= this.state.filterRating) {
                            filteredData.push(item);
                        }
                    }
                }
            }
        });

        // TODO: center map automatically; move it when switching cities
        const city = cityById(this.state.filterCity);

        return <>
            <div style={{minHeight: '350px'}}>
                <YMaps>
                    <Map className="map-top" defaultState={{ center: city && city.map.center, zoom: city && city.map.zoom }}>
                        {
                            filteredData.map(studio => {
                                return <Placemark key={studio._id}
                                                  geometry={{
                                                      type: 'Point',
                                                      coordinates: studio.mapCoords
                                                  }}
                                                  modules={["geoObject.addon.balloon"]}
                                                  properties={{
                                                      balloonContentHeader: studio.title,
                                                      balloonContentBody: `<a href="#">Перейти &rarr;</a>`
                                                  }}
                                                  onClick={() => console.log(studio)}
                                />;
                            })
                        }
                    </Map>
                </YMaps>
            </div>

            <main id="listings">
                <StudioFilters onQueryChange={q => this.handleQueryChange(q)}
                               onLocationChange={q => this.handleLocationChange(q)}
                               onStyleChange={q => this.handleStyleChange(q)}
                               onRatingChange={q => this.handleRatingChange(q)} />

                <div className="postings-count">
                    {
                        (filteredData.length === this.state.numTotal) ? <>
                            Найдено <span>{ this.state.numTotal }</span> студий
                        </> : <>
                            Отображено <span>{ filteredData.length }</span> из <span>{ this.state.numTotal }</span> студий
                        </>
                    }
                </div>


                <div className={'postings-container'}>
                    { filteredData.map(datum => <StudioListing key={datum._id} content={datum} />) }
                </div>

                <div id="postings-more">
                    <a href="#">Следующие 20</a>
                </div>
            </main>
        </>;
    }
}

export { StudiosListPage };
