import React from 'react';

import { FavouriteStudioItem } from "./favouriteStudioItem";

class FavouriteStudiosList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            favourites: []
        };
    }

    componentDidMount() {
        fetch("/v1/favourites").then(response => {
            return response.json();
        }).then(data => {
            if(data.status === 'OK') {
                this.setState({
                    favourites: data.favourites
                });
            }
            else {
                console.error(data);
            }
        }).catch(err => {
            console.error(err);
        });
    }

    render() {
        return <div>
            {
                this.state.favourites.map(favourite => {
                    return <FavouriteStudioItem key={favourite._id}
                                                urlBit={favourite.urlBit}
                                                title={favourite.title}
                                                id={favourite._id}/>;
                })
            }
        </div>;
    }
}

export { FavouriteStudiosList };
