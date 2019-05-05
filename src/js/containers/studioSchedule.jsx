import React from 'react';

import styled from 'styled-components';

import { weekDayShortNames } from "../util/dateStrings";

const ScheduleDiv = styled.div`


  .calendar-bar {
    display: flex;
    align-items: center;

    height: 4em;

    padding: 0.5em 0;
    border-top: 1px #f0f0f0 solid;
    border-bottom: 1px #f0f0f0 solid;

    .cal-left {
      padding-right: 5em;
    }

    .cal-right {
      padding-left: 5em;
    }

    .cal-left img, .cal-right img {
      height: 2.5em;
      cursor: pointer;
    }

    .cal-left img {
      transform: rotate(180deg);
    }

    .day {
      flex-grow: 1;
      text-align: center;

      font-size: 1.25em;
      font-weight: 100;

      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      span {
        cursor: pointer;
      }

      &.day-current {
        color: #007bff;
        font-weight: 300;
      }

      &.day-past {
        color: #bababa;
      }
    }
  }

  .class-entries {
    width: 100%;

    margin-top: 2em;

    td {
      padding: 0.5em 0;
    }

    .class-join {
      width: 8em;
    }

    .spots-left {
      font-size: 0.625em;
    }
  }
`;

class StudioSchedule extends React.Component {
    constructor(props) {
        super(props);

        const monday = new Date();

        while(monday.getDay() !== 1) {
            monday.setDate(monday.getDate() - 1);
        }

        this.state = {
            classes: [],
            weekMonday: monday
        };
    }

    weekDays() {
        const weekDays = [];

        for(let i = 0; i < 7; i++) {
            const weekDay = new Date(this.state.weekMonday); // copy the object

            weekDay.setDate(weekDay.getDate() + i);

            weekDays.push(weekDay);
        }

        return weekDays;
    }

    componentDidMount() {
        fetch(`/v1/studio/${this.props.urlBit}/classes`).then(response => {
            return response.json();
        }).then(data => {
            if(data.status === 'OK') {
                this.setState({
                    classes: data.classes
                });
            }
            else {
                console.log(data);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    handleEnroll(e, classId) {
        e.preventDefault();

        fetch("/v1/enrollments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                classId: classId
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
    }

    shiftWeek(d) {
        const weekDay = new Date(this.state.weekMonday);
        weekDay.setDate(weekDay.getDate() + d * 7);

        this.setState({weekMonday: weekDay});
    }

    render() {
        console.log("classes", this.state.classes);

        return <ScheduleDiv>
            <div className="calendar-bar">
                <div className="cal-left" onClick={() => this.shiftWeek(-1)}>
                    <img src="/img/circle-right.svg"/>
                </div>
                {
                    this.weekDays().map(date => {
                        let className = "day";

                        if(date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
                            className += " day-current";
                        }
                        else if(date < new Date()) {
                            className += " day-past";
                        }

                        return <div className={className}>
                            <span>{ weekDayShortNames[date.getDay()] }</span>
                            <span>{ date.getDate() }</span>
                        </div>;
                    })
                }
                <div className="cal-right" onClick={() => this.shiftWeek(1)}>
                    <img src="/img/circle-right.svg"/>
                </div>
            </div>

            <table className="class-entries">
                <tbody>
                {
                    this.state.classes.map(classInfo => {
                        return <tr key={classInfo._id}>
                            <td className="class-time">
                                <div>9:05</div>
                                <div>55 минут</div>
                            </td>
                            <td className="class-id">
                                <div>{classInfo.title}</div>
                                <div>{classInfo.trainer}</div>
                            </td>
                            <td className="class-tag">
                                {classInfo.tag}
                                {/*<pre>{ JSON.stringify(classInfo, null, 4) }</pre>*/}
                            </td>
                            <td className="class-join">
                                <div>
                                    <button className="btn btn-sm btn-link btn-primary" onClick={e => this.handleEnroll(e, classInfo._id)}>Записаться</button>
                                </div>
                                <div className="spots-left">Осталось 7 мест</div>
                            </td>
                        </tr>;
                    })
                }
                </tbody>
            </table>


        </ScheduleDiv>;
    }
}

export { StudioSchedule };
