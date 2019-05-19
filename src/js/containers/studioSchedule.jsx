import React from 'react';

import styled from 'styled-components';

import { weekDayShortNames } from "../util/dateStrings";
import { getCurrentUser } from "../util/sessionData";
import leftPad from "../util/leftPad";
import { tagNameById } from "../util/tags";

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

      span:first-child {
        font-size: 0.875em;
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

const dMinutes = (start, end) => {
    return ((end - start) / 1000 / 60).toFixed(0);
};

class StudioSchedule extends React.Component {
    constructor(props) {
        super(props);

        const monday = new Date();

        while(monday.getDay() !== 1) {
            monday.setDate(monday.getDate() - 1);
        }

        monday.setHours(0);
        monday.setMinutes(0);
        monday.setSeconds(0);

        this.state = {
            classes: [],
            weekMonday: monday,
            currentUserId: null
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

    loadClasses() {
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

    componentDidMount() {
        this.loadClasses();

        getCurrentUser().then(user => {
            if(user) {
                this.setState({
                    currentUserId: user._id
                });
            }
        });
    }

    handleEnroll(classId) {
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
            if(data.status !== 'OK') {
                console.log(data);
            }

            this.loadClasses();
        }).catch(err => {
            console.log(err);
        });
    }

    handleUnenroll(classId) {
        fetch(`/v1/enrollments/${classId}`, {
            method: "DELETE"
        }).then(response => {
            return response.json();
        }).then(data => {
            if(data.status !== 'OK') {
                console.log(data);
            }

            this.loadClasses();
        }).catch(err => {
            console.log(err);
        });
    }

    shiftWeek(d) {
        const anotherMonday = new Date(this.state.weekMonday);
        anotherMonday.setDate(anotherMonday.getDate() + d * 7);

        this.setState({
            weekMonday: anotherMonday
        });
    }

    classesThisWeek() {
        const nextMonday = new Date(this.state.weekMonday);
        nextMonday.setDate(nextMonday.getDate() + 7);

        return this.state.classes.filter(classInfo => {
            const startDate = new Date(classInfo.startTime);

            return (this.state.weekMonday < startDate && startDate < nextMonday) && new Date() < startDate;
        });
    }

    renderHoursMins(mins) {
        if(mins < 60) {
            return <>{mins} мин</>;
        }

        const h = parseInt(mins / 60), m = mins % 60;

        if(m !== 0) {
            return <>{h} ч {m} мин</>;
        }

        return <>{h} ч</>;
    }

    render() {
        const classes = this.classesThisWeek();

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

                        return <div className={className} key={date.toString()}>
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
                    classes.length !== 0 ? classes.map(classInfo => {
                        // TODO: add rows denoting dates

                        const startDate = new Date(classInfo.startTime);
                        const endDate = new Date(classInfo.endTime);

                        const isEnrolled = this.state.currentUserId && classInfo.enrolledUsers.includes(this.state.currentUserId);

                        return <tr key={classInfo._id}>
                            <td className="class-time">
                                <div>{startDate.getHours()}:{leftPad(startDate.getMinutes(), 2)}</div>
                                <div>{ this.renderHoursMins(dMinutes(startDate, endDate)) }</div>
                            </td>
                            <td className="class-id">
                                <div>{classInfo.title}</div>
                                <div>{classInfo.trainer}</div>
                            </td>
                            <td className="class-tag">
                                { tagNameById(classInfo.tags) }
                                {/*<pre>{ JSON.stringify(classInfo, null, 4) }</pre>*/}
                            </td>
                            <td className="class-join">
                                <div>
                                    {
                                        isEnrolled ? (
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => this.handleUnenroll(classInfo._id)}>Отписаться</button>
                                        ) : (
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => this.handleEnroll(classInfo._id)} disabled={classInfo.enrolledUsers.length == classInfo.capacity}>Записаться</button>
                                        )
                                    }
                                </div>
                                <div className="spots-left">
                                    Осталось { classInfo.capacity - classInfo.enrolledUsers.length } мест
                                </div>
                            </td>
                        </tr>;
                    }) : <div>Занятий на этой неделе нет</div>
                }
                </tbody>
            </table>


        </ScheduleDiv>;
    }
}

export { StudioSchedule };
