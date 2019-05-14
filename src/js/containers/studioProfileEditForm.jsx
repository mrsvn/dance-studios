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

        return <div className="card m-2">
            <h5 className="card-header">Профиль студии</h5>
            <div className="card-body">
                <form onSubmit={e => this.handleSubmit(e)}>
                    <div className="form-group">
                        <label>Название:</label>
                        <input className="form-control" value={ this.state.title || "" } onChange={e => this.setState({ title: e.target.value })}/>
                    </div>

                    <div className="form-group">
                        <label>Заглавная картинка:</label>
                        <input className="form-control" value={ this.state.imgUrl || "" } onChange={e => this.setState({ imgUrl: e.target.value })}/>
                        <div className="form-text text-muted">
                            TODO: загрузка картинок.
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

                    <div className="form-group">
                        <label>Адрес и координаты:</label>
                        <input className="form-control" value={ "ул. Уважаемых Ветеранов, д.14" }/>
                    </div>

                    <div className="form-group">
                        <label>URL:</label>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">{ location.host }/studios/</span>
                            </div>
                            <input className="form-control text-monospace" value={ this.state.urlBit || "" } onChange={e => this.setState({ urlBit: e.target.value })}/>
                        </div>
                        <div className="form-text text-muted">
                            TODO: после смены URL перенаправлять на новый со старого.
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Направления:</label>
                        <input className="form-control" value={ this.state.tags && this.state.tags.join(', ') }/>
                        <div className="form-text text-muted">
                            TODO: элемент выбора тэгов с автодополнением.
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Описание:</label>
                        <textarea className="form-control" rows={8} value={this.state.description && this.state.description.join('\n\n')}/>
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
