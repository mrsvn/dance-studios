import React from "react";

import { ClassDateSelector } from "../components/classDateSelector";
import { ClassesTable } from "../components/classesTable";

class ClassesTablePage extends React.Component {
    render() {
        return <main>
            <div id="class-filters">
                <div>
                    <h3>Время начала</h3>
                    <div>
                        <input value="00:00"/>
                        <input value="12:00"/>
                    </div>
                </div>
                <div>
                    <h3>Вид занятий</h3>
                    <div>
                        <select>
                            <option>Йога</option>
                        </select>
                    </div>
                </div>
                <div>
                    <h3>Метро</h3>
                    <div>
                        <select>
                            <option>Сокол</option>
                        </select>
                    </div>
                </div>
            </div>

            <ClassDateSelector/>

            <div style={{textAlign: 'center'}}>
                Выбранная дата: 15 февраля
            </div>

            <table style={{width: '100%'}}>
                <tbody>
                    <tr>
                        <th>Занятие</th>
                        <th>Метро</th>
                        <th>Студия</th>
                        <th>Направление</th>
                        <th>Время</th>
                        <th>Инструктор</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>Бачата</td>
                        <td>Сокол</td>
                        <td>
                            <a href="#">танцы Мытищи</a>
                        </td>
                        <td>Танцы</td>
                        <td>12:30 - 13:30</td>
                        <td>Драньков</td>
                        <td><a href="#">Записаться</a> </td>
                    </tr>
                    <tr>
                        <td>Бачата</td>
                        <td>Сокол</td>
                        <td>
                            <a href="#">танцы Мытищи</a>
                        </td>
                        <td>Танцы</td>
                        <td>12:30 - 13:30</td>
                        <td>Драньков</td>
                        <td><em>мест нет</em></td>
                    </tr>
                    <tr>
                        <td>Бачата</td>
                        <td>Сокол</td>
                        <td>
                            <a href="#">танцы Мытищи</a>
                        </td>
                        <td>Танцы</td>
                        <td>12:30 - 13:30</td>
                        <td>Драньков</td>
                        <td><a href="#">Записаться</a> </td>
                    </tr>
                </tbody>
            </table>

        </main>;
    }
}

export { ClassesTablePage };
