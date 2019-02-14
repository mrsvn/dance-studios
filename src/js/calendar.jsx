
import React from "react";
import ReactDOM from "react-dom";

class UserCalendar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    fetch("/dummy-data/user-schedule.json").then(response => {
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
    const weekDayShortNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

    let day = new Date();

    while (day.getDay() !== 1) {
      day.setDate(day.getDate() - 1);
    }

    let dayColumns = [];

    for (let i = 0; i < 7; i++) {
      dayColumns.push(
          <div  key={i} className="day-column">
            <div className="day-header">{weekDayShortNames[day.getDay()]}, <strong>{day.getDate()}</strong></div>
            <div style={{position: "relative"}}>
              {
                this.state.data.map(datum => {
                  const datumDate = new Date(datum.date);

                  if (datumDate.getDate() === day.getDate() && datumDate.getMonth() === day.getMonth()) {
                    return (
                        <div style={{
                          position: "absolute",
                          background: "plum",
                          opacity: "0.5",
                          top: (datum.tStart[0] + "" + datum.tStart[1]) + "px",
                          height: (datum.tDuration[0] + "" + datum.tDuration[1]) + "px",
                          width: "100%"
                        }}>{datum.classTitle}</div>
                    )
                  }
                })
              }

            </div>
          </div>
      );
      day.setDate(day.getDate() + 1);
    }

    return (
    <div id="calendar">
      <div id="time-column">
        <div className="day-header"> </div>
        <div>00:00</div>
        <div>01:00</div>
        <div>02:00</div>
        <div>03:00</div>
        <div>04:00</div>
        <div>05:00</div>
        <div>06:00</div>
        <div>07:00</div>
        <div>08:00</div>
        <div>09:00</div>
        <div>10:00</div>
        <div>11:00</div>
        <div>12:00</div>
        <div>13:00</div>
        <div>14:00</div>
        <div>15:00</div>
        <div>16:00</div>
        <div>17:00</div>
        <div>18:00</div>
        <div>19:00</div>
        <div>20:00</div>
        <div>21:00</div>
        <div>22:00</div>
        <div>23:00</div>
      </div>

      {dayColumns}

    </div>
    )
  }
}
ReactDOM.render(<UserCalendar/>, document.querySelector('#calendar-container'));
