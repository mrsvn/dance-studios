import React from "react";

import { ClassTableRow } from "./classTableRow";
import { ClassDateSelector } from "./classDateSelector";

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
            classesRows.push(<ClassTableRow key={i} content={datum} />);
        });


        return <>
            <ClassDateSelector/>

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
        </>;
    }
}

export { ClassesTable };
