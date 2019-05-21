import React from "react";

import cities, { cityById } from '../util/cities';

class StudioProfileEditForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.urlBit = this.props.match.params.urlBit;
    }

    componentDidMount() {
        fetch("/v1/studio/" + this.urlBit).then(response => {
            return response.json();
        }).then(data => {
            this.setState(data.studio);
        }).catch(error => {
            console.log(error);
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(this.state).map(([k, v]) => {
            if(k === 'description') {
                formData.append(k, v.join('\n\n'));
            }
            else {
                formData.append(k, v);
            }
        });

        fetch(`/v1/studio/${this.urlBit}`, {
            method: "POST",
            body: formData
        }).then(response => {
            return response.json();
        }).then(data => {
            if(data.status === 'OK') {
                if(this.state.urlBit !== this.urlBit) {
                    this.props.history.push({
                        pathname: `/studios/${this.state.urlBit}/manage`
                    });

                    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

                    if(currentUser.managedStudio === this.urlBit) {
                        currentUser.managedStudio = this.state.urlBit;
                        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                        // TODO: make the updated value show up in LoginCorner
                    }
                }
            }
            else {
                console.log(data);
            }

        }).catch(err => {
            console.log(err);
        });
    }

    handleDescriptionChange(newDescription) {
        this.setState({
            description: newDescription.split('\n\n')
        });
    }

    updateMapCoords() {
        const apiKey = "0ca1104f-7293-4f9c-84e6-7ae602db62f6";

        let query = this.state.streetAddress;

        const city = cityById(this.state.city);

        if(city) {
            query = city.name + ", " + query;
        }

        fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${query}`).then(response => {
            return response.json();
        }).then(data => {
            const objects = data.response.GeoObjectCollection.featureMember;

            if(objects.length !== 0) {
                const coords = objects[0].GeoObject.Point.pos.split(' ');

                this.setState({
                    mapCoords: [parseFloat(coords[1]), parseFloat(coords[0])]
                });
            }
        });
    }

    handleTagsChange(newTags) {
        this.setState({
            tags: newTags.split(', ')
        });
    }

    render() {
        let cityData = { districts: [] };

        cities.forEach(city => {
            if(city.id === this.state.city) {
                cityData = city;
            }
        });

        return <div className="card m-2">
            <h5 className="card-header">Профиль студии</h5>
            <div className="card-body">
                <form onSubmit={e => this.handleSubmit(e)}>
                    <div className="form-group">
                        <label>Название:</label>
                        <input className="form-control" value={ this.state.title || "" }
                               onChange={e => this.setState({ title: e.target.value })}/>
                    </div>

                    <div className="form-group">
                        <div className="form-check">
                            <label className="form-check-label">
                                <input className="form-check-input" type="checkbox" checked={this.state.isShown}
                                       onChange={e => this.setState({ isShown: e.target.checked })}/>
                                Отображать студию в поиске
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Заглавная картинка:</label>
                        <input type="file" className="form-control"
                               onChange={e => this.setState({ studiopic: e.target.files[0] })} />
                        <div className="form-text text-muted">
                            {/*TODO: человеческая загрузка картинок здесь и в профиле.*/}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col">
                            <label>Город:</label>
                            <select className="form-control" value={ this.state.city || "" } onChange={e => this.setState({ city: e.target.value })}>
                                <option>Выберите город</option>
                                {
                                    cities.map(city => {
                                        return <option key={city.id} value={city.id}>{city.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group col">
                            <label>Район:</label>
                            <select className="form-control" value={ this.state.district || "" } onChange={e => this.setState({ district: e.target.value })}>
                                {
                                    cityData.districts.map(district => {
                                        return <option key={district.id} value={district.id}>{district.name}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-8">
                            <label>Адрес:</label>
                            <input className="form-control"
                                   value={ this.state.streetAddress }
                                   onChange={e => this.setState({ streetAddress: e.target.value })}
                                   onBlur={() => this.updateMapCoords()}/>
                        </div>
                        <div className="form-group col-4">
                            <label>Координаты:</label>
                            <div className="form-row">
                                <input className="form-control col" disabled value={this.state.mapCoords && this.state.mapCoords[0]}/>
                                <input className="form-control col" disabled value={this.state.mapCoords && this.state.mapCoords[1]}/>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>URL:</label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">{ location.host }/studios/</span>
                            </div>
                            <input className="form-control text-monospace" value={ this.state.urlBit || "" } onChange={e => this.setState({ urlBit: e.target.value })}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Направления:</label>
                        <input className="form-control"
                               value={ this.state.tags && this.state.tags.join(', ') }
                               onChange={e => this.handleTagsChange(e.target.value)}/>
                        <div className="form-text text-muted">
                            TODO: элемент выбора тэгов с автодополнением.
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Описание:</label>
                        <textarea className="form-control" rows={8}
                                  value={this.state.description && this.state.description.join('\n\n')}
                                  onChange={e => this.handleDescriptionChange(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary" onClick={e => this.handleSubmit(e)}>
                            Сохранить изменения
                        </button>
                    </div>
                </form>
            </div>
        </div>;
    }
}

export { StudioProfileEditForm };
