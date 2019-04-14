import React from "react";

class ClassDateSelector extends React.Component {
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

export { ClassDateSelector };
