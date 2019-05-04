import React from "react";

import cities from '../util/cities';

class StudioProfileEditForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        fetch("/v1/studio/" + this.props.urlBit).then(response => {
            return response.json();
        }).then(data => {
            this.setState(data.studio);
        }).catch(error => {
            console.log(error);
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        fetch(`/v1/studio/${this.props.urlBit}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        let cityData = { districts: [] };

        cities.forEach(city => {
            if(city.id === this.state.city) {
                cityData = city;
            }
        });

        return <div className="card">
            <h5 className="card-header">Профиль студии</h5>
            <div className="card-body">
                <form onSubmit={e => this.handleSubmit(e)}>
                    <div className="input-group my-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Название:</span>
                        </div>
                        <input className="form-control" value={ this.state.title || "" } onChange={e => this.setState({ title: e.target.value })}/>
                    </div>

                    <div className="input-group my-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Заглавная картинка:</span>
                        </div>
                        <input className="form-control" value={ this.state.imgUrl || "" } onChange={e => this.setState({ imgUrl: e.target.value })}/>
                    </div>

                    <div className="input-group my-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Город:</span>
                        </div>
                        <select className="form-control" value={ this.state.city || "" } onChange={e => this.setState({ city: e.target.value })}>
                            <option>Выберите город</option>
                            {
                                cities.map(city => {
                                    return <option key={city.id} value={city.id}>{city.name}</option>
                                })
                            }
                        </select>
                    </div>

                    <div className="input-group my-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Район:</span>
                        </div>
                        <select className="form-control" value={ this.state.district || "" } onChange={e => this.setState({ district: e.target.value })}>
                            {
                                cityData.districts.map(district => {
                                    return <option key={district.id} value={district.id}>{district.name}</option>
                                })
                            }
                        </select>
                    </div>

                    <div className="input-group my-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">URL:</span>
                        </div>
                        <input className="form-control" value={ this.state.urlBit || "" } onChange={e => this.setState({ urlBit: e.target.value })}/>
                    </div>

                    <p>
                        <button className="btn btn-primary" onClick={e => this.handleSubmit(e)}>
                            Сохранить изменения
                        </button>
                    </p>
                </form>
            </div>
        </div>;
    }
}

export { StudioProfileEditForm };
