import React from "react";

import { getCurrentUser } from "../util/sessionData";

class ProfileEditForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        getCurrentUser().then(data => this.setState(data));
    }

    handleUserpicChange(e) {
        const newUserpic = e.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            this.setState({
                userpic: newUserpic,
                userpicData: reader.result
            });
        };

        reader.readAsDataURL(newUserpic);
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        ['firstName', 'lastName', 'gender', 'birthDate', 'city', 'userpic'].forEach(k => {
            formData.append(k, this.state[k]);
        });

        fetch("/v1/profile", {
            method: "POST",
            body: formData
        }).then(response => {
            return response.json();
        }).then(data => {
            if(data.status === 'OK') {
                sessionStorage.removeItem('currentUser');
                location.reload();
            }
            else {
                console.log(data);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return <form action="/v1/profile" method="POST">
            <p>
                {/* TODO: this user's userpic */}
                <img style={{width: '256px', height: '256px'}} src={this.state.userpicData || `/v1/userpics/${this.state.email}`} /><br/>
                <input type="file" name="userpic" onChange={e => this.handleUserpicChange(e)} />
            </p>
            <p>
                Имя: <input name="firstName" value={this.state.firstName || ""} onChange={e => this.setState({ firstName: e.target.value })} />
            </p>
            <p>
                Фамилия: <input name="lastName" value={this.state.lastName || ""} onChange={e => this.setState({ lastName: e.target.value })}/>
            </p>
            <p>
                Пол:
                <radiogroup>
                    <label>
                        <input name="gender" checked={this.state.gender === 'male'} type="radio" onChange={() => this.setState({ gender: 'male' })}/>
                        Мужской
                    </label>
                    <label>
                        <input name="gender" checked={this.state.gender === 'female'} type="radio" onChange={() => this.setState({ gender: 'female' })}/>
                        Женский
                    </label>
                    <label>
                        <input name="gender" checked={this.state.gender === 'none' || !this.state.gender} type="radio" onChange={() => this.setState({ gender: 'none' })}/>
                        Предпочитаю не указывать
                    </label>
                </radiogroup>
            </p>
            <p>
                Дата рождения:
                <input type="date" name="birthDate" value={this.state.birthDate || ""} onChange={e => this.setState({ birthDate: e.target.value })}/>
            </p>
            <p>
                Город:
                <select name="city" value={this.state.city || ""} onChange={e => this.setState({ city: e.target.value })}>
                    <option value="los-angeles">Лос-Анджелес</option>
                    <option value="st-tropez">Сен-Тропе</option>
                    <option value="miami">Майами</option>
                    <option value="volzhsky">Волжский</option>
                    <option value="ivanovo">Иваново</option>
                </select>
            </p>
            <p>
                <button type="submit" onClick={e => this.handleSubmit(e)}>Сохранить изменения</button>
            </p>
            <pre>
                {JSON.stringify(this.state, null, 4)}
            </pre>
        </form>;
    }
}

export { ProfileEditForm };
