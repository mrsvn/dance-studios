
import React from "react";
import ReactDOM from "react-dom";

class LoginCorner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginFormIsShown: false,
      registrationFormIsShown: false,
      email: "",
      password: "",
      passwordForChecking:"",
      agreeToConditions: false,
      username: null,
      errorMessage: null,
      requestInProgress: false
    };
  }

  showForm(e) {
    this.setState({
      loginFormIsShown: true
    });

    e.preventDefault();
  }

  showRegistrationForm(e) {
    this.setState({
      registrationFormIsShown: true
    });

    e.preventDefault();
  }

  hideForm(e){
    this.setState({
      loginFormIsShown: false
        });
  }

  hideRegistrationForm (e) {
    this.setState({
      registrationFormIsShown: false
    });
  }

  handleEmailInput(e) {
    this.setState({
        email: e.target.value
    });
  }

  handlePasswordInput(e) {
    this.setState({
        password: e.target.value
    });
  }

  handlePasswordForCheckingInput(e) {
    this.setState({
      passwordForChecking: e.target.value
    });
  }

  handleAgreeToConditions(e) {
    this.setState({
      agreeToConditions: true
    });
}

  loadData() {
    this.setState({
      requestInProgress: true
    });

    fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email: this.state.email, password: this.state.password})
    }).then(response => {
      this.setState({
        requestInProgress: false
      });
      return response.json();
    }).then(data => {
      console.log(data);
      if (data.status === "OK")
        this.setState({username: data.username, userpic: data.userpic})
      else if (data.status === "THROTTLED") this.setState({errorMessage: "Превышено ограничение на количество попыток входа"})
      else this.setState({errorMessage: "Неправильный e-mail или пароль"})

    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    let formStyle;
    if (this.state.loginFormIsShown) formStyle = {position:"relative"};
    else formStyle = {display: "none"};

    let registrationFormStyle;
    if (this.state.registrationFormIsShown) registrationFormStyle = {};
    else registrationFormStyle = {display: "none"};


    if (this.state.username === null) {
      return (
          <div className="login-corner">
            <a href="#" onClick={e => this.showForm(e)}>Войти</a> / <a href="#" onClick={e => this.showRegistrationForm(e)}>Зарегистрироваться</a>

            <div style={formStyle} className="login-form">
              <div onClick={e => this.hideForm(e)} style={{textAlign: "right"}}>X</div>
              <input value={this.state.email} onChange={e => this.handleEmailInput(e)} placeholder="E-mail"/><br/>
              <input value={this.state.password} onChange={e => this.handlePasswordInput(e)} type="password"
                     placeholder="Пароль"/><br/>
              <button disabled={(this.state.requestInProgress)} onClick={e => this.loadData(e)}>Войти</button>
              {(this.state.requestInProgress) ? (
                  <div style={{
                    position: "absolute",
                    background: "rgba(255,255,255,0.5)",
                    top: "0",
                    width: "100%",
                    left: "0",
                    height: "100%"
                  }}>
                    <img style={{
                      width:"120px",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translateX(-50%) translateY(-50%)"
                    }} src={"/img/spinner-cat.gif"} />
                  </div>
              ) : null}

              {(this.state.errorMessage === null) ? null : <div style={{color: "red"}}>{this.state.errorMessage}</div>}
              {/*{ this.state.errorMessage && <div style={{color: "red"}}>Ошибка: {this.state.errorMessage}</div> }*/}

            </div>


              <div style={registrationFormStyle} className="registration-form">
                <div onClick={e => this.hideRegistrationForm(e)} style={{textAlign: "right", cursor: "pointer"}}>X</div>
                <input value={this.state.email} onChange={e => this.handleEmailInput(e)} placeholder="E-mail"/><br/>
                <input value={this.state.password} onChange={e => this.handlePasswordInput(e)} type="password"
                       placeholder="Пароль"/><br/>
                <input value={this.state.passwordForChecking} onChange={e => this.handlePasswordForCheckingInput(e)} type="password"
                       placeholder="Ещё раз пароль"/><br/>
                <label>Согласен <input type="checkbox" checked={this.state.agreeToConditions} onChange={e => this.handleAgreeToConditions(e)} /></label>
                <button>Зарегистрироваться</button>
            </div>

          </div>
      );
    }
    else {
      return (
          <div>{this.state.username}
          <img src={this.state.userpic} style={{height:"40px", borderRadius: "50%"}}/></div>
      )
    }
  }
}
class ListingsContainer extends React.Component {
    render() {
        const listingComponents = [];

        this.props.data.forEach(datum => {
            listingComponents.push(<Listing content={datum} />);
        });

        return (
            <div className={'postings-container'}>
                {listingComponents}
            </div>
        )
    }
}

class Listing extends React.Component {
    render() {
        const content = this.props.content;

        let tag_links = [];

        content.tags.forEach(tag => {
            tag_links.push(<>
                <a href='#'>{tag}</a>
                &nbsp;
            </>);
        });

        return (
            <div className={'posting'}>
                <div className={'p-thumbnail'}>
                  <img src={content.imgUrl}>
                  </img>
                </div>
              <div className={'p-body'}>
                <div className={'p-details'}>
                <h3 className={'p-title'}>{ content.title }</h3>

                  <div className={'p-tags'}>
                      <p>{ tag_links }</p>
                  </div>
                  <div className={'p-row'}>
                    <b>Расположение:</b> <span> м. { content.location } </span>
                  </div>
                  <div className={'p-description'}>
                    <p>{ content.description }</p>
                  </div>
                </div>
                <div className={ 'p-link' }>
                  <a href="#">Подробнее &rarr;</a>
                </div>
              </div>
            </div>
        );
    }
}

window.addEventListener('load', () => {
    ReactDOM.render(<LoginCorner/>, document.querySelector('#login-corner'));

    const gMapCanvas = document.getElementById('gmap_canvas');

    gMapCanvas.src = gMapCanvas.dataset.src;

    gMapCanvas.onload = () => {
        document.getElementById('gmap-spinner').style.display = 'none';
    };

    const postings = document.getElementById('postings');

    let p = document.getElementById('t_posting');

    function loadData() {
        fetch("/dummy-data/los-angeles.json").then(response => {
            return response.json();
        }).then(data => {
            ReactDOM.render(<ListingsContainer data={data}/>, document.querySelector('#postings'));
        }).catch(error => {
            console.log(error);
        });
    }

    loadData();

    document.querySelector('#postings-more').onclick = e => {
        e.preventDefault();
        loadData();
    };

    const locOptions = document.querySelector('.loc-options');
    const locCurrent = locOptions.querySelector('.loc-opt-current');
    const locDropdown = locOptions.querySelector('.loc-opt-dropdown')
    const locVariants = Array.from(locOptions.querySelectorAll('a'));

    locOptions.querySelector('.loc-opt-current').onclick = e => {
        e.preventDefault();
    };

    locOptions.querySelector('.loc-opt-current').onfocus = e => {
        locDropdown.style.display = null;
    };

    locVariants.forEach(el => {
        if(el.dataset.locValue) {
            el.onclick = e => {
                e.preventDefault();

                if(!locOptions.style.minWidth) {
                    locOptions.style.minWidth = e.target.clientWidth + 'px';
                }

                locCurrent.textContent = el.textContent;

                el.style.display = 'none';

                locVariants.forEach(otherEl => {
                    otherEl.style.display = (el.dataset.locValue === otherEl.dataset.locValue) ? 'none' : null;
                });
            }
        }

        el.onblur = e => {
            if(!e.relatedTarget || e.relatedTarget.parentNode !== locOptions.querySelector('.loc-opt-dropdown')) {
                locDropdown.style.display = 'none';
            }
        };

        el.onkeydown = e => {
            if(e.key === 'Escape') {
                e.target.blur();
            }
        };
    });
});
