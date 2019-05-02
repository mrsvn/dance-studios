import React from 'react';

/**
 * TODO: validate
 * TODO: decide redirect location based on response
 */

class BigRegisterForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            passwordConfirm: "",
            agree: false,
            isSending: false
        };
    }

    handleSubmit(e) {
        e.preventDefault();

        fetch('/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                secret: this.props.secret
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if(data.status === 'OK') {
                sessionStorage.removeItem('currentUser');
                document.cookie = `email=${this.state.email}`;
                document.cookie = `authToken=${data.authToken}`;

                location.href = `/studios/${data.studioUrlBit}`;
            }
            else {
                console.log(data);
            }
        }).catch(err => {
            console.error(err);
        })
    }

    render() {
        return <form className="mx-auto" style={{maxWidth: "400px", marginTop: "100px"}}>
            <div className="form-group">
                <label htmlFor="reg-email">Адрес e-mail:</label>
                <input type="email" className="form-control" id="reg-email" placeholder="drankov@pavel.ru" value={this.state.email} onChange={e => this.setState({ email: e.target.value })}/>
                <small id="emailHelp" className="form-text text-muted">
                    Мы даже под фашистскими пытками не выдадим ваш e-mail!
                </small>
            </div>
            <div className="form-group">
                <label htmlFor="reg-password">Пароль:</label>
                <input type="password" className="form-control" id="reg-password" placeholder="qwerty123" value={this.state.password} onChange={e => this.setState({ password: e.target.value })}/>
            </div>
            <div className="form-group">
                <label htmlFor="reg-password-confirm">Подтверждение пароля:</label>
                <input type="password" className="form-control" id="reg-password-confirm" placeholder="qwerty123" value={this.state.passwordConfirm} onChange={e => this.setState({ passwordConfirm: e.target.value })}/>
            </div>
            <div className="form-group form-check">
                <label className="form-check-label">
                    <input type="checkbox" className="form-check-input" name="reg-accept" value={this.state.agree} onChange={e => this.setState({ agree: e.target.checked })} /> Я согласен с <a href="#">пользовательским соглашением</a>.
                </label>
            </div>
            {/*<input type="hidden" name="reg-secret" value="aba-caba"/>*/}
            <button type="submit" className="btn btn-primary" onClick={e => this.handleSubmit(e)} disabled={this.state.isSending}>
                Submit
            </button>
        </form>;
    }
}

export { BigRegisterForm };
