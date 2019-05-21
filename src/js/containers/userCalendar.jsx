import React from "react";

import { Link } from "react-router-dom";

import styled from "styled-components";

const CalendarDiv = styled.div`
    display: flex;

    .day-column {
        border-right: 1px #dddddd solid;
        flex-grow: 1;

        .calendar-item {
          background: rgba(0, 0, 0, 0.05);
          position: absolute;
          width: 100%;

          border: 1px black solid;
          box-shadow: 1px 4px rgba(0, 0, 0, 0.1);
        }

        .calendar-past {
          background: transparent;
          border-style: dotted;
        }
    }

    #time-column > div {
        font-size: 10px;
        height: 60px;
        padding-right: 1ex;
    }

    .day-header, #time-column .day-header {
        height: 1.5em;
        font-size: 1.5em;
        text-align: center;
    }
`;

class UserCalendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            reviewedIds: []
        };
    }

    componentDidMount() {
        fetch("/v1/enrollments").then(response => {
            return response.json();
        }).then(data => {
            if(data.status === 'OK') {
                this.setState({
                    data: data.classes
                });
            }
        }).catch(error => {
            console.log(error);
        });

        fetch('/v1/profile/reviews').then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                reviewedIds: data.map(review => review.classId)
            });
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
                <div key={i} className="day-column">
                    <div className="day-header">{weekDayShortNames[day.getDay()]}, <strong>{day.getDate()}</strong></div>
                    <div style={{position: "relative"}}>
                        {
                            this.state.data.map(classInfo => {
                                const startDate = new Date(classInfo.startTime);
                                const endDate = new Date(classInfo.endTime);

                                const startTimeMinutes = startDate.getHours() * 60 + startDate.getMinutes();
                                const durationMinutes = (endDate.getHours() - startDate.getHours()) * 60 + (endDate.getMinutes() - startDate.getMinutes());

                                let className = "calendar-item";

                                if(endDate < new Date()) {
                                    className += " calendar-past";
                                }

                                const canLeaveReview = endDate < new Date() && !this.state.reviewedIds.includes(classInfo._id);

                                if (startDate.getDate() === day.getDate() && startDate.getMonth() === day.getMonth()) {
                                    return (
                                        <div key={classInfo._id} className={className} style={{
                                            top: startTimeMinutes + "px",
                                            height: durationMinutes + "px"
                                        }}>
                                            <div>
                                                {classInfo.title}
                                            </div>
                                            <div>
                                                {
                                                    canLeaveReview && (
                                                        <Link to={`/profile/reviews/new/${classInfo._id}`}>Оставить отзыв</Link>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }

                    </div>
                </div>
            );
            day.setDate(day.getDate() + 1);
        }

        return <CalendarDiv>
            {/*// <!--				<div class="calendar-modes">-->*/}
            {/*// <!--					<a href="#">месяц</a>-->*/}
            {/*// <!--					<a href="#">неделя</a>-->*/}
            {/*// <!--					<a href="#">списком</a>-->*/}
            {/*// <!--				</div>-->*/}
            {/*// <!--				<div style="height: 1000px; font-size: 40px; background: pink;">-->*/}
            {/*// <!--					календарь-->*/}
            {/*// <!--				</div>-->*/}
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
        </CalendarDiv>;
    }
}

export { UserCalendar };
