import React from "react";

class StudioProfileEditForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // TODO!: ...
        this.urlBit = "9-da-ja-nichego-net-net";
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

        fetch("/v1/studio/" + this.urlBit, {
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
        return <div className="card">
            <h5 className="card-header">Профиль студии</h5>
            <div className="card-body">
                <form onSubmit={e => this.handleSubmit(e)}>
                    <p>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Название:</span>
                            </div>
                            <input className="form-control" value={ this.state.title } onChange={e => this.setState({ title: e.target.value })}/>
                        </div>
                    </p>

                    <p>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Заглавная картинка:</span>
                            </div>
                            <input className="form-control" value={ this.state.imgUrl } onChange={e => this.setState({ imgUrl: e.target.value })}/>
                        </div>
                    </p>

                    <p>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Город:</span>
                            </div>
                            <select className="form-control" value={ this.state.city } onChange={e => this.setState({ city: e.target.value })}>
                                <option>los-angeles</option>
                                <option>miami</option>
                                <option>ivanovo</option>
                            </select>
                        </div>
                    </p>

                    <p>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Район:</span>
                            </div>
                            <input className="form-control" value={ this.state.district } onChange={e => this.setState({ district: e.target.value })}/>
                        </div>
                    </p>

                    <p>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">URL:</span>
                            </div>
                            <input className="form-control" value={ this.state.urlBit } onChange={e => this.setState({ urlBit: e.target.value })}/>
                        </div>
                    </p>

                    <p>
                        <button className="btn btn-lg btn-primary" onClick={e => this.handleSubmit(e)}>
                            Сохранить изменения
                        </button>
                    </p>
                </form>
            </div>
        </div>;
    }
}

export { StudioProfileEditForm };
