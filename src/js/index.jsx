
import React from "react";
import ReactDOM from "react-dom";

class LoginCorner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShown: false,
      email: "",
      password: ""
    };
  }

  showForm(e) {
    this.setState({
      isShown: true
    });

    e.preventDefault();
  }

  hideForm(e){
    this.setState({
      isShown: false
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

  render() {
    let formStyle;
    if (this.state.isShown) formStyle = {};
    else formStyle = {display: "none"};
    return (
        <div className="login-corner">
          <a href="#" onClick={e => this.showForm(e)}>Войти</a> / <a href="#">Зарегистрироваться</a>
          <div style={formStyle} className="login-form">
            <div onClick={e => this.hideForm(e) } style={{textAlign:"right"}}>X</div>
            <input value={this.state.email} onInput={e => this.handleEmailInput(e)} placeholder="E-mail"/><br/>
            <input value={this.state.password} onInput={e => this.handlePasswordInput(e)} type="password" placeholder="Пароль"/><br/>
                <button>Войти</button>
          </div>
        </div>
    );
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

            // data.forEach(x => {
            //     let q = p.cloneNode(true);
            //
            //     q.style.display = null;
            //
            //     q.querySelector('.p-title').textContent = x.title;
            //     q.querySelector('.p-thumbnail img').src = x.imgUrl;
            //     q.querySelector('.p-location').textContent = x.location;
            //
            //     let desc = q.querySelector('.p-description');
            //     desc.innerHTML = "";
            //
            //     x.description.forEach(line => {
            //         let descPart = document.createElement('p');
            //         descPart.textContent = line;
            //         desc.appendChild(descPart);
            //     });
            //
            //     let tags = q.querySelector('.p-tags p');
            //
            //     x.tags.forEach(tag => {
            //         let tagEl = document.createElement('a');
            //         tagEl.textContent = tag;
            //         tagEl.href = '#';
            //         tags.appendChild(tagEl);
            //
            //         tags.appendChild(document.createTextNode(" "));
            //     });
            //
            //     postings.appendChild(q);
            // })
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
