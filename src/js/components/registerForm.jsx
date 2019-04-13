import React from "react";

import {FormSpinner} from "./formSpinner";

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            passwordConfirm: "",
            agree: false
        };

        this.emailField = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.visible && this.props.visible) {
            this.emailField.current.focus();
        }
    }

    hasEmptyFields() {
        return !this.state.email || !this.state.password || !this.state.passwordConfirm;
    }

    handleCloseClick(e) {
        e.preventDefault();

        this.props.onClose();
    }

    handleSubmit(e) {
        e.preventDefault();

        // TODO: validate
        const { email, password, passwordConfirm, agree } = this.state;

        if(password === passwordConfirm && agree) {
            this.props.onSubmit(this.state.email, this.state.password);
        }

        return false;
    }

    render() {
        const style = this.props.visible ? { position: 'relative' } : { display: "none" };
        const formDisabled = this.props.inProgress || !this.props.visible;

        return <form style={style} className="registration-form" onSubmit={e => this.handleSubmit(e)}>
            <div onClick={e => this.handleCloseClick(e)} style={{textAlign: "right", cursor: "pointer"}}>X</div>
            <input value={this.state.email} disabled={formDisabled}
                   onChange={e => this.setState({ email: e.target.value })}
                   placeholder="E-mail" ref={this.emailField} /><br/>
            <input value={this.state.password} disabled={formDisabled}
                   onChange={e => this.setState({ password: e.target.value })}
                   type="password" placeholder="Пароль"/><br/>
            <input value={this.state.passwordConfirm} disabled={formDisabled}
                   onChange={e => this.setState({ passwordConfirm: e.target.value })}
                   type="password" placeholder="Ещё раз пароль"/><br/>
            <label>
                <input checked={this.state.agree} disabled={formDisabled}
                       onChange={e => this.setState({ agree: e.target.checked })}
                       type="checkbox" /> Согласен
            </label><br/>
            <button type="submit" disabled={formDisabled || this.hasEmptyFields()}>
                Зарегистрироваться
            </button>
            {
                this.props.inProgress && <FormSpinner src="/img/spinner-cat.gif" />
            } {
            this.props.errorStatus && <div style={{color: "red"}}>{ this.props.errorStatus }</div>
        }
        </form>;
    }
}

export { RegisterForm };
