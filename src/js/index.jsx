
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

class RatingSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliderValue: 25
    };
  }

  sliderChange(newValue) {
    this.setState({
      sliderValue: newValue
    });

    this.props.onChange(newValue / 10);
  }

  render() {
    return (
        <span>
          <span>{(this.state.sliderValue / 10).toFixed(1)}</span>
          <input
              onChange={e => this.sliderChange(e.target.value)}
              type="range"
              min="0"
              max="50"
              value={this.state.sliderValue}
          />
        </span>
    );
  }
}

class ListingFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="postings-filter">
          <div className="search-query-container">
            <input onChange={e => this.props.onQueryChange(e.target.value)} id="search-query" placeholder="Поиск по названию" autoFocus={true} />
            <button className="search-query-showfilters" id="show-filters">
              <img src="img/filter.svg" />
            </button>
            <button className="search-query-submit" type="submit">
              <img src="img/search.svg" />
            </button>
          </div>

          <div id="postings-filters-form">
            {/*<div className="filter-location">*/}
              {/*<span className="caption">Метро:</span>*/}
              {/*<a href="#">Пердановская</a>*/}
              {/*<a href="#">Дристановская</a>*/}
              {/*<a href="#" className="current">Поносковский проспект</a>*/}
              {/*<a href="#">Малые обоссыши</a>*/}
            {/*</div>*/}
            {/*<div className="filter-tags">*/}
              {/*<span className="caption">Виды занятий:</span>*/}
              {/*<div className="filter-tags-container">*/}
                {/*<a href="#" className="chosen">пидор</a>*/}
                {/*<a href="#" className="chosen">пизда</a>*/}
                {/*<a href="#">туз</a>*/}
                {/*<a href="#">малафья</a>*/}
                {/*<a href="#" className="chosen">гомик</a>*/}
                {/*<a href="#">мудила</a>*/}
                {/*<a href="#">пилотка</a>*/}
                {/*<a href="#" className="chosen">манда</a>*/}
                {/*<a href="#">анус</a>*/}
                {/*<a href="#">вагина</a>*/}
                {/*<a href="#">путана</a>*/}
                {/*<a href="#">пидрила</a>*/}
                {/*<a href="#">шалава</a>*/}
                {/*<a href="#">хуила</a>*/}
                {/*<a href="#">мошонка</a>*/}
                {/*<a href="#">елда</a>*/}
              {/*</div>*/}
            {/*</div>*/}
            {/*<div className="filter-location">*/}
              {/*<span className="caption">Город:</span>*/}
              {/*<a href="#" className="current">Москва</a>*/}
              {/*<a href="#">Чернобыль</a>*/}
              {/*<a href="#">Могилев</a>*/}
            {/*</div>*/}
            <select onChange={e => this.props.onStyleChange(e.target.value)}>
              <option disabled={true} selected={true}>Направление</option>
              <option>пидор</option>
              <option>пизда</option>
              <option>туз</option>
              <option>малафья</option>
              <option>гомик</option>
              <option>мудила</option>
              <option>пилотка</option>
              <option>манда</option>
              <option>анус</option>
              <option>вагина</option>
              <option>путана</option>
              <option>пидрила</option>
              <option>шалава</option>
              <option>хуила</option>
              <option>мошонка</option>
              <option>елда</option>
            </select>
            <select onChange={e => this.props.onLocationChange(e.target.value)}>
              <option disabled={true} selected={true}>Станция метро</option>
              <option>Бульвар Рокоссовского</option>
              <option>Черкизовская</option>
              <option>Преображенская площадь</option>
              <option>Сокольники</option>
              <option>Красносельская</option>
              <option>Комсомольская</option>
              <option>Красные ворота</option>
              <option>Чистые пруды</option>
              <option>Лубянка</option>
              <option>Охотный ряд</option>
              <option>Кропоткинская</option>
              <option>Парк культуры</option>
              <option>Фрунзенская</option>
              <option>Спортивная</option>
              <option>Университет</option>
              <option>Проспект Вернадского</option>
              <option>Юго-Западная</option>
              <option>Румянцево</option>
              <option>Саларьево</option>
              <option>Алма-Атинская</option>
              <option>Красногвардейская</option>
              <option>Домодедовская</option>
              <option>Орехово</option>
              <option>Царицыно</option>
              <option>Кантемировская</option>
              <option>Каширская</option>
              <option>Коломенская</option>
              <option>Технопарк</option>
              <option>Автозаводская</option>
              <option>Павелецкая</option>
              <option>Новокузнецкая</option>
              <option>Театральная</option>
              <option>Тверская</option>
              <option>Маяковская</option>
              <option>Белорусская</option>
              <option>Динамо</option>
              <option>Аэропорт</option>
              <option>Сокол</option>
              <option>Войковская</option>
              <option>Водный стадион</option>
              <option>Речной вокзал</option>
              <option>Ховрино</option>
              <option>Первомайская</option>
              <option>Измайловская</option>
              <option>Партизанская</option>
              <option>Электрозаводская</option>
              <option>Бауманская</option>
              <option>Курская</option>
              <option>Арбатская</option>
              <option>Смоленская</option>
              <option>Киевская</option>
              <option>Парк Победы</option>
              <option>Славянский бульвар</option>
              <option>Кунцевская</option>
              <option>Крылатское</option>
              <option>Строгино</option>
              <option>Мякинино</option>
              <option>Волоколамская</option>
              <option>Митино</option>
              <option>Пятницкое шоссе</option>
              <option>Кунцевская</option>
              <option>Пионерская</option>
              <option>Филевский парк</option>
              <option>Багратионовская</option>
              <option>Фили</option>
              <option>Кутузовская</option>
              <option>Студенческая</option>
              <option>Киевская</option>
              <option>Смоленская</option>
              <option>Арбатская</option>
              <option>Александровский сад</option>
              <option>Выставочная</option>
              <option>Международная</option>
              <option>Октябрьская</option>
              <option>Добрынинская</option>
              <option>Павелецкая</option>
              <option>Таганская</option>
              <option>Курская</option>
              <option>Комсомольская</option>
              <option>Проспект Мира</option>
              <option>Новослободская</option>
              <option>Белорусская</option>
              <option>Краснопресненская</option>
              <option>Киевская</option>
              <option>Медведково</option>
              <option>Бабушкинская</option>
              <option>Свиблово</option>
              <option>Ботанический сад</option>
              <option>ВДНХ</option>
              <option>Алексеевская</option>
              <option>Рижская</option>
              <option>Проспект Мира</option>
              <option>Сухаревская</option>
              <option>Тургеневская</option>
              <option>Китай-город</option>
              <option>Третьяковская</option>
              <option>Октябрьская</option>
              <option>Шаболовская</option>
              <option>Ленинский проспект</option>
              <option>Академическая</option>
              <option>Профсоюзная</option>
              <option>Новые Черемушки</option>
              <option>Калужская</option>
              <option>Беляево</option>
              <option>Коньково</option>
              <option>Теплый Стан</option>
              <option>Ясенево</option>
              <option>Новоясеневская</option>
              <option>Планерная</option>
              <option>Сходненская</option>
              <option>Тушинская</option>
              <option>Спартак</option>
              <option>Щукинская</option>
              <option>Октябрьское поле</option>
              <option>Полежаевская</option>
              <option>Беговая</option>
              <option>Баррикадная</option>
              <option>Пушкинская</option>
              <option>Кузнецкий мост</option>
              <option>Китай-город</option>
              <option>Таганская</option>
              <option>Пролетарская</option>
              <option>Волгоградский проспект</option>
              <option>Текстильщики</option>
              <option>Кузьминки</option>
              <option>Рязанский проспект</option>
              <option>Выхино</option>
              <option>Лермонтовский проспект</option>
              <option>Жулебино</option>
              <option>Котельники</option>
              <option>Новокосино</option>
              <option>Новогиреево</option>
              <option>Перово</option>
              <option>Шоссе Энтузиастов</option>
              <option>Авиамоторная</option>
              <option>Площадь Ильича</option>
              <option>Марксистская</option>
              <option>Третьяковская</option>
              <option>Парк Победы</option>
              <option>Минская</option>
              <option>Ломоносовский проспект</option>
              <option>Раменки</option>
              <option>Мичуринский проспект</option>
              <option>Говорово</option>
              <option>Солнцево</option>
              <option>Боровское шоссе</option>
              <option>Новопеределкино</option>
              <option>Рассказовка</option>
              <option>Петровский парк</option>
              <option>ЦСКА</option>
              <option>Хорошевская</option>
              <option>Шелепиха</option>
              <option>Алтуфьево</option>
              <option>Бибирево</option>
              <option>Отрадное</option>
              <option>Владыкино</option>
              <option>Петровско-Разумовская</option>
              <option>Тимирязевская</option>
              <option>Дмитровская</option>
              <option>Савеловская</option>
              <option>Менделеевская</option>
              <option>Цветной бульвар</option>
              <option>Чеховская</option>
              <option>Боровицкая</option>
              <option>Полянка</option>
              <option>Серпуховская</option>
              <option>Тульская</option>
              <option>Нагатинская</option>
              <option>Нагорная</option>
              <option>Нахимовский проспект</option>
              <option>Севастопольская</option>
              <option>Чертановская</option>
              <option>Южная</option>
              <option>Пражская</option>
              <option>Улица Академика Янгеля</option>
              <option>Аннино</option>
              <option>Бульвар Дмитрия Донского</option>
              <option>Марьина Роща</option>
              <option>Достоевская</option>
              <option>Трубная</option>
              <option>Сретенский бульвар</option>
              <option>Чкаловская</option>
              <option>Римская</option>
              <option>Крестьянская застава</option>
              <option>Дубровка</option>
              <option>Кожуховская</option>
              <option>Печатники</option>
              <option>Волжская</option>
              <option>Люблино</option>
              <option>Братиславская</option>
              <option>Марьино</option>
              <option>Борисово</option>
              <option>Шипиловская</option>
              <option>Зябликово</option>
              <option>Бутырская</option>
              <option>Фонвизинская</option>
              <option>Петровско-Разумовская</option>
              <option>Окружная</option>
              <option>Верхние Лихоборы</option>
              <option>Селигерская</option>
              <option>Каширская</option>
              <option>Варшавская</option>
              <option>Каховская</option>
              <option>Битцевский парк</option>
              <option>Лесопарковая</option>
              <option>Улица Старокачаловская</option>
              <option>Улица Скобелевская</option>
              <option>Бульвар адмирала Ушакова</option>
              <option>Улица Горчакова</option>
              <option>Бунинская аллея</option>
              <option>Тимирязевская</option>
              <option>Телецентр</option>
              <option>Выставочный центр </option>
              <option>Андроновка</option>
              <option>Шоссе Энтузиастов</option>
              <option>Соколиная Гора</option>
              <option>Измайлово</option>
              <option>Локомотив</option>
              <option>Бульвар Рокоссовского</option>
              <option>Белокаменная</option>
              <option>Ростокино</option>
              <option>Ботанический сад</option>
              <option>Владыкино</option>
              <option>Окружная</option>
              <option>Лихоборы</option>
              <option>Коптево</option>
              <option>Балтийская</option>
              <option>Стрешнево</option>
              <option>Панфиловская</option>
              <option>Зорге</option>
              <option>Шелепиха</option>
              <option>Кутузовская</option>
              <option>Лужники</option>
              <option>Крымская</option>
              <option>Верхние Котлы</option>
              <option>ЗИЛ</option>
              <option>Автозаводская</option>
              <option>Дубровка</option>
              <option>Угрешская</option>
              <option>Новохохловская</option>
              <option>Нижегородская</option>
              <option>Петровский парк</option>
              <option>ЦСКА</option>
              <option>Хорошевская</option>
              <option>Шелепиха</option>
              <option>Деловой центр</option>
            </select>
            <RatingSlider onChange={v => this.props.onRatingChange(v)} />
          </div>
        </div>
    )
  }

}

class Listings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      searchQuery: "",
      filterLocation: null,
      filterStyle: null,
      filterRating: null
    };
  }

  handleQueryChange(newQuery) {
    this.setState({
      searchQuery: newQuery
    });
  }

  handleLocationChange(newLocation) {
    this.setState({
      filterLocation: newLocation
    });
  }

  handleStyleChange(newStyle) {
    this.setState({
      filterStyle: newStyle
    });
  }

  handleRatingChange(newRating) {
    this.setState({
      filterRating: newRating
    });
  }

  componentDidMount() {
    fetch("/dummy-data/los-angeles.json").then(response => {
      return response.json();
    }).then(data => {
      this.setState({
        data: data
      });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    let filteredData = [];

    this.state.data.forEach(item => {
      if (item.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())) {
        if (item.location === this.state.filterLocation || this.state.filterLocation === null) {
          if (item.tags.includes(this.state.filterStyle) || this.state.filterStyle === null) {
            if (item.rating >= this.state.filterRating) {
              filteredData.push(item);
            }
          }
        }
      }
    });

    return (
        <>
          <ListingFilter onQueryChange={q => this.handleQueryChange(q)}
                         onLocationChange={q => this.handleLocationChange(q)}
                         onStyleChange={q => this.handleStyleChange(q)}
                         onRatingChange={q => this.handleRatingChange(q)} />


          <div className="postings-count">
            Найдено <span>798</span> студий
          </div>

          <ListingsContainer data={filteredData}/>

          <div id="postings-more">
            <a href="#">Следующие 20</a>
          </div>
        </>
    )
  }
}

window.addEventListener('load', () => {
    ReactDOM.render(<LoginCorner/>, document.querySelector('#login-corner'));
    ReactDOM.render(<Listings/>, document.querySelector('#listings'));

    const gMapCanvas = document.getElementById('gmap_canvas');

    gMapCanvas.src = gMapCanvas.dataset.src;

    gMapCanvas.onload = () => {
        document.getElementById('gmap-spinner').style.display = 'none';
    };


    // document.querySelector('#postings-more').onclick = e => {
    //     e.preventDefault();
    //     loadData();
    // };

    // const locOptions = document.querySelector('.loc-options');
    // const locCurrent = locOptions.querySelector('.loc-opt-current');
    // const locDropdown = locOptions.querySelector('.loc-opt-dropdown')
    // const locVariants = Array.from(locOptions.querySelectorAll('a'));
    //
    // locOptions.querySelector('.loc-opt-current').onclick = e => {
    //     e.preventDefault();
    // };
    //
    // locOptions.querySelector('.loc-opt-current').onfocus = e => {
    //     locDropdown.style.display = null;
    // };
    //
    // locVariants.forEach(el => {
    //     if(el.dataset.locValue) {
    //         el.onclick = e => {
    //             e.preventDefault();
    //
    //             if(!locOptions.style.minWidth) {
    //                 locOptions.style.minWidth = e.target.clientWidth + 'px';
    //             }
    //
    //             locCurrent.textContent = el.textContent;
    //
    //             el.style.display = 'none';
    //
    //             locVariants.forEach(otherEl => {
    //                 otherEl.style.display = (el.dataset.locValue === otherEl.dataset.locValue) ? 'none' : null;
    //             });
    //         }
    //     }
    //
    //     el.onblur = e => {
    //         if(!e.relatedTarget || e.relatedTarget.parentNode !== locOptions.querySelector('.loc-opt-dropdown')) {
    //             locDropdown.style.display = 'none';
    //         }
    //     };
    //
    //     el.onkeydown = e => {
    //         if(e.key === 'Escape') {
    //             e.target.blur();
    //         }
    //     };
    // });
});
