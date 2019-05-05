import React from 'react';

import styled from 'styled-components';

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
`;

class StudioSchedule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: []
        };
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

    render() {
        console.log("classes", this.state.classes);

        return <ScheduleDiv>
            <div className="calendar-bar">
                <div className="cal-left">
                    <img src="/img/circle-right.svg"/>
                </div>
                <div className="day day-past">
                    <span>Пн</span>
                    <span>6</span>
                </div>
                <div className="day day-current">
                    <span>Пн</span>
                    <span>6</span>
                </div>
                <div className="day">
                    <span>Пн</span>
                    <span>6</span>
                </div>
                <div className="day">
                    <span>Пн</span>
                    <span>6</span>
                </div>
                <div className="day">
                    <span>Пн</span>
                    <span>6</span>
                </div>
                <div className="day">
                    <span>Пн</span>
                    <span>6</span>
                </div>
                <div className="day">
                    <span>Пн</span>
                    <span>6</span>
                </div>
                <div className="cal-right">
                    <img src="/img/circle-right.svg"/>
                </div>
            </div>

            {
                this.state.classes.map(classInfo => {
                    return <div key={classInfo._id}>
                        <pre>{ JSON.stringify(classInfo, null, 4) }</pre>
                        <a href="#" onClick={e => this.handleEnroll(e, classInfo._id)}>Записаться!</a>
                    </div>;
                })
            }
        </ScheduleDiv>;
    }
}

export { StudioSchedule };
