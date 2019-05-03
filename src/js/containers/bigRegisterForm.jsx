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
            agreeStudio: false,
            isSending: false
        };
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({
            isSending: true
        });

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
                this.setState({ isSending: false });
                console.log(data);
            }
        }).catch(err => {
            this.setState({ isSending: false });
            console.error(err);
        })
    }

    allowSubmission() {
        return !this.state.isSending && this.state.agree && this.state.agreeStudio;
    }

    renderStatusMsg() {
        if(this.props.secret) {
            return <div className="alert alert-success">
                <h4 className="alert-heading">Регистрация новой студии</h4>
                <p>Вы пошли по уникальной ссылке для регистрации новой студии.</p>
                <p className="mb-0">Заполните нижеследующую форму, чтобы создать учетную запись менеджера.</p>
            </div>;
        }
        else if(this.props.secretError === 'USED') {
            return <div className="alert alert-danger">
                <h4 className="alert-heading">Ссылка уже использована</h4>
                <p>Ссылка для регистрации студии, по которой вы прошли, уже была использована. Для управления созданной студией войдите в аккаунт менеджера, используя данные, использованные при регистрации.</p>
                <p className="mb-0">Если вы хотите зарегистрировать еще одну студию, свяжитесь с администрацией по адресу <a href="#">partners@dancer.mrsvn.com</a>.</p>
            </div>;
        }
        else if(this.props.secretError === 'EXPIRED') {
            return <div className="alert alert-danger">
                <h4 className="alert-heading">Действие ссылки истекло</h4>
                <p>Срок действия ссылки для регистрации студии, по которой вы прошли, окончился.</p>
                <p className="mb-0">Если вы хотите зарегистрировать новую студию, свяжитесь с администрацией по адресу <a href="#">partners@dancer.mrsvn.com</a>.</p>
            </div>;
        }
        else if(this.props.secretError === 'NOT_FOUND') {
            return <div className="alert alert-danger">
                <h4 className="alert-heading">Ссылка недействительна</h4>
                <p className="mb-0">Ссылка для регистрации студии, по которой вы прошли, битая. Обратитесь туда, где вы ее взяли, или свяжитесь с администрацией по адресу <a href="#">partners@dancer.mrsvn.com</a>.</p>
            </div>;
        }
    }

    render() {
        // TODO: continuously validate errors after first submission attempt

        return <>
            { this.renderStatusMsg() }
            <form className="mx-auto" style={{maxWidth: "400px", marginTop: "100px"}} onSubmit={e => this.handleSubmit(e)}>
                <div className="form-group">
                    <label htmlFor="reg-email">Адрес e-mail:</label>
                    <input type="email" className="form-control" id="reg-email" placeholder="drankov@pavel.ru" value={this.state.email} onChange={e => this.setState({ email: e.target.value })}/>
                    <small className="form-text text-muted">
                        Мы не выдадим его даже под фашистскими пытками!
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
                <div className="form-group">
                    <small className="form-text text-muted">
                        Вы регистрируетесь в качестве представителя студии.
                    </small>
                    <label className="form-check-label form-check">
                        <input type="checkbox" className="form-check-input" name="reg-accept-studio" value={this.state.agreeStudio} onChange={e => this.setState({ agreeStudio: e.target.checked })} /> Я согласен с <a href="#">партнерским соглашением</a>.
                    </label>
                </div>
                {/*<input type="hidden" name="reg-secret" value="aba-caba"/>*/}
                <button type="submit" className="btn btn-primary" disabled={!this.allowSubmission()}>
                    Зарегистрироваться
                </button>
            </form>
        </>;
    }
}

export { BigRegisterForm };
