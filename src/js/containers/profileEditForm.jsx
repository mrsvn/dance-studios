import React from "react";

class ProfileEditForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        fetch("/v1/profile").then(response => {
            return response.json();
        }).then(profileData => {
            this.setState(profileData);
        }).catch(err => {});
    }

    handleUserpicChange(e) {
        this.setState({
            userpic: URL.createObjectURL(e.target.files[0])
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        fetch("/v1/profile", {
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
        return <form action="/v1/profile" method="POST">
            <p>
                <img style={{width: '164px', height: '164px'}} src={this.state.userpic || "http://placehold.jp/164x164.png"} /><br/>
                <input type="file" name="userpic" onChange={e => this.handleUserpicChange(e)} />
            </p>
            <p>
                Имя: <input name="firstName" value={this.state.firstName} onChange={e => this.setState({ firstName: e.target.value })} />
            </p>
            <p>
                Фамилия: <input name="lastName" value={this.state.lastName} onChange={e => this.setState({ lastName: e.target.value })}/>
            </p>
            <p>
                Пол:
                <select name="gender" value={this.state.gender} onChange={e => this.setState({ gender: e.target.value })}>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                    <option value="none">Предпочитаю не указывать</option>
                </select>
            </p>
            <p>
                Дата рождения:
                <input type="date" name="birthDate" value={this.state.birthDate} onChange={e => this.setState({ birthDate: e.target.value })}/>
            </p>
            <p>
                Город:
                <select name="city" value={this.state.city} onChange={e => this.setState({ city: e.target.value })}>
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
