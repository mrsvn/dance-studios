import React from "react";

import { Link } from "react-router-dom";

import { LoginForm } from "../components/loginForm";
import { RegisterForm } from "../components/registerForm";
import { getCurrentUser } from "../util/sessionData";

class LoginCorner extends React.Component {
    constructor(props) {
        super(props);

        // TODO: purge auth data from localStorage if auth cookies are gone
        // TODO: delete the token on the server when logging out

        this.state = {
            formShown: null,
            inProgress: false,

            currentAuth: null,

            loginError: null,
            registerError: null
        };
    }

    componentDidMount() {
        getCurrentUser().then(data => this.setState({ currentAuth: data }));
    }

    setFormShown(newFormShown, e) {
        if(e) e.preventDefault();

        this.setState({ formShown: newFormShown });
    }

    handleLoginLinkClick(e) {
        e.preventDefault();

        if(this.state.formShown !== 'login') {
            this.setFormShown('login');
        }
        else {
            this.setFormShown(null);
        }
    }

    handleRegisterLinkClick(e) {
        e.preventDefault();

        if(this.state.formShown !== 'register') {
            this.setFormShown('register');
        }
        else {
            this.setFormShown(null);
        }
    }

    sendJsonPost(url, body) {
        return new Promise((resolve, reject) => {
            this.setState({ inProgress: true }, () => {
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    this.setState({ inProgress: false });

                    return response.json();
                }).then(resolve, reject);
            });
        });
    }

    rememberAuth(newAuth) {
        this.setState({
            currentAuth: newAuth,
            loginError: null,
            registerError: null
        }, () => {
            // localStorage.setItem('currentAuth', JSON.stringify(newAuth));
        });
    }

    handleLoginSubmit(email, password) {
        this.sendJsonPost("/login", { email, password }).then(data => {
            if(data.status === "OK") {
                this.rememberAuth({
                    email,
                    displayName: data.displayName,
                    userpic: data.userpic
                });
            }
            else if(data.status === "THROTTLED") {
                this.setState({ loginError: "Превышено ограничение на количество попыток входа" });
            }
            else {
                this.setState({ loginError: "Неправильный e-mail или пароль" });
            }
        }).catch(error => {
            console.log("Error logging in", error);
        });
    }

    handleRegisterSubmit(email, password) {
        this.sendJsonPost("/register", { email, password }).then(data => {
            if(data.status === "OK") {
                this.rememberAuth({
                    email,
                    displayName: data.displayName,
                    userpic: data.userpic
                });
            }
            else if(data.status === "THROTTLED") {
                this.setState({ registerError: "Превышено ограничение на количество попыток регистрации" });
            }
            else if(data.status === 'EMAIL_TAKEN') {
                this.setState({ registerError: "Такой e-mail уже зарегистрирован" });
            }
            else {
                this.setState({ registerError: "Неправильный e-mail или пароль" });
            }
        }).catch(error => {
            console.log("Error logging in", error);
        });
    }

    handleLogoutClick(e) {
        e.preventDefault();

        sessionStorage.removeItem('currentUser');
        document.cookie = "email=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "authToken=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        this.setState({ currentAuth: null });
    }

    renderAuthorized() {
        const { email } = this.state.currentAuth;

        return <div>
            { email }
            <img src={ `/v1/userpics/${email}` } style={{ height:"40px", borderRadius: "50%" }}/>
            <Link to="/profile">Профиль</Link>&nbsp;
            <Link to="/edit-studio">Студия</Link>&nbsp;
            <Link to="/admin/users">Админка</Link>&nbsp;
            <a href="#" onClick={e => this.handleLogoutClick(e)}>Выйти</a>
        </div>;
    }

    renderUnauthorized() {
        return <div className="login-corner">
            <a href="#" onClick={e => this.handleLoginLinkClick(e)}>
                Войти
            </a> / <a href="#" onClick={e => this.handleRegisterLinkClick(e)}>
            Зарегистрироваться
        </a>

            <LoginForm visible={this.state.formShown === 'login'}
                       errorStatus={this.state.loginError}
                       inProgress={this.state.inProgress}
                       onClose={() => this.setFormShown(null)}
                       onSubmit={(email, password) => this.handleLoginSubmit(email, password)} />

            <RegisterForm visible={this.state.formShown === 'register'}
                          errorStatus={this.state.registerError}
                          inProgress={this.state.inProgress}
                          onClose={() => this.setFormShown(null)}
                          onSubmit={(email, password) => this.handleRegisterSubmit(email, password)} />
        </div>;
    }

    render() {
        return this.state.currentAuth ? this.renderAuthorized() : this.renderUnauthorized();
    }
}

export { LoginCorner };
