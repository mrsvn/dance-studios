
import React from "react";
import ReactDOM from "react-dom";

class DateSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date()
    };
  }
  render() {

    const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const weekDayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    const weekDayShortNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

    const today = new Date();
    const selectableDates = [];

    for (let i = 0; i<=14; i++) {
      let day = new Date();
      day.setDate(day.getDate() + i);
      selectableDates.push(day);
    }

    return (
        <div id="date-selector">
          <div>
            <p>Сегодня</p>
            <p>{today.getDate()} {monthNames[today.getMonth()]}</p>
            <p>{weekDayNames[today.getDay()]}</p>
          </div>
          <div id="classes-calendar">
            {
              selectableDates.map(date => {
                let className;
                if (date.getDay() === 0 || date.getDay() === 6) {
                  className = "classes-date classes-date-weekend";
                }
                else {
                  className = "classes-date";
                }

                if (this.state.selectedDate.getDate() === date.getDate() && this.state.selectedDate.getMonth() === date.getMonth()) {
                  className += " classes-date-selected";
                }

                return (
                    <div key={date} className={className} onClick={e => this.setState({selectedDate: date})}>
                      <div>{date.getDate()}</div>
                      <div>{weekDayShortNames[date.getDay()]}</div>
                    </div>
                )
              })
            }
          </div>
        </div>
    );
  }
}

class ClassRow extends React.Component {
  render() {

    let enrollLink;

    if (this.props.content.num_vacancies > 0) {
      enrollLink = <a href="#">Записаться</a>;
    }
    else {
      enrollLink = <em>мест нет</em>;
    }


    return (
        <tr>
          <td>{this.props.content.title}</td>
          <td>{this.props.content.subway_station}</td>
          <td>
            <a href={"/studios/" + this.props.content.studio}>танцы Мытищи</a>
          </td>
          <td>{this.props.content.tag}</td>
          <td>{this.props.content.t_start[0] + ":" + this.props.content.t_start[1] + " — " + this.props.content.t_end[0] + ":" + this.props.content.t_end[1] }</td>
          <td>{this.props.content.trainer}</td>
          <td>{enrollLink}</td>
        </tr>
    )
  }
}

class ClassesTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }


  componentDidMount() {
    fetch("/dummy-data/vacancies-la.json").then(response => {
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
    const classesRows = [];

    this.state.data.forEach((datum, i) => {
      classesRows.push(<ClassRow key={i} content={datum} />);
    });


    return (

        <table>
          <thead><tr>
            <th>Занятие</th>
            <th>Метро</th>
            <th>Студия</th>
            <th>Направление</th>
            <th>Время</th>
            <th>Инструктор</th>
            <th></th>
          </tr></thead>
          <tbody>
          {classesRows}
          </tbody>
        </table>

    )
  }
}

ReactDOM.render(<DateSelector/>, document.querySelector('#date-selector-container'));
ReactDOM.render(<ClassesTable/>, document.querySelector('#classes-table-container'));
