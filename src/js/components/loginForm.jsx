import React from "react";

import {FormSpinner} from "./formSpinner";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };

        this.emailField = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.visible && this.props.visible) {
            this.emailField.current.focus();
        }
    }

    hasEmptyFields() {
        return !this.state.email || !this.state.password;
    }

    handleCloseClick(e) {
        e.preventDefault();

        this.props.onClose();
    }

    handleSubmit(e) {
        e.preventDefault();

        // TODO: validate
        this.props.onSubmit(this.state.email, this.state.password);

        return false;
    }

    render() {
        const style = this.props.visible ? { position:"relative" } : { display: "none" };
        const formDisabled = this.props.inProgress || !this.props.visible;

        return <form style={style} className="login-form" onSubmit={e => this.handleSubmit(e)}>
            <div onClick={e => this.handleCloseClick(e)} style={{textAlign: "right"}}>X</div>
            <input value={this.state.email} disabled={formDisabled}
                   onChange={e => this.setState({ email: e.target.value })}
                   placeholder="E-mail" ref={this.emailField} /><br/>
            <input value={this.state.password} disabled={formDisabled}
                   onChange={e => this.setState({ password: e.target.value })}
                   type="password" placeholder="Пароль"/><br/>
            <button type="submit" disabled={formDisabled || this.hasEmptyFields()}>
                Войти
            </button>
            {
                this.props.inProgress && <FormSpinner src="/img/spinner-cat.gif" />
            } {
            this.props.errorStatus && <div style={{color: "red"}}>{ this.props.errorStatus }</div>
        }
        </form>;
    }
}

export { LoginForm };
