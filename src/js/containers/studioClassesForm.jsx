import React from "react";

class AddClassForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        // TODO!: ...
        this.urlBit = "9-da-ja-nichego-net-net";
    }

    handleSubmit(e) {
        e.preventDefault();

        if(this.state.startTime === undefined /* TODO: other fields */) {
            console.error("Вы не ввели дранькова");
            return;
        }

        fetch(`/v1/studio/${this.urlBit}/classes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);

            if(data.status === 'OK') {
                // TODO: clear the form  vvv
                this.setState({
                    title: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    tags: undefined,
                    trainer: undefined,
                    capacity: undefined
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return <tr>
            <td>
                <input name="title" placeholder="Утренняя разминочка" value={this.state.title} onChange={e => this.setState({ trainer: e.target.title })}/>
            </td>
            <td>
                <input name="startTime" type="datetime-local" value={this.state.startTime} onChange={e => this.setState({ startTime: e.target.value })}/>
            </td>
            <td>
                <input name="endTime" type="datetime-local" value={this.state.endTime} onChange={e => this.setState({ endTime: e.target.value })}/>
            </td>
            <td>
                <select name="tags" value={this.state.tags} onChange={e => this.setState({ tags: e.target.value })}>
                    <option>Бачата</option>
                    <option>Бальные танцы</option>
                </select>
            </td>
            <td>
                <input name="trainer" placeholder="Иван Иванов" value={this.state.trainer} onChange={e => this.setState({ trainer: e.target.value })}/>
            </td>
            <td>
                <input name="capacity" type="number" value={this.state.capacity} onChange={e => this.setState({ capacity: e.target.value })}/>
            </td>
            <td>&nbsp;</td>
            <td colSpan="2">
                <a href="#" className="btn btn-sm btn-success" onClick={e => this.handleSubmit(e)}>
                    Добавить
                </a>
            </td>
        </tr>;
    }
}

class StudioClassesForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: []
        };

        // TODO!: ...
        this.urlBit = "9-da-ja-nichego-net-net";
    }

    componentDidMount() {
        fetch(`/v1/studio/${this.urlBit}/classes`).then(response => {
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
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return <div className="card">
            <h5 className="card-header">Расписание студии</h5>
            <div className="card-body">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Название</th>
                            <th scope="col">Начало</th>
                            <th scope="col">Окончание</th>
                            <th scope="col">Направление</th>
                            <th scope="col">Тренер</th>
                            <th scope="col">Вместимость</th>
                            <th scope="col">Записано</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.classes.map(classInfo => {
                            return <tr>
                                <td>{classInfo.title}</td>
                                <td>{ classInfo.startTime }</td>
                                <td>{ classInfo.endTime }</td>
                                <td>{ classInfo.tags }</td>
                                <td>{ classInfo.trainer }</td>
                                <td>{ classInfo.capacity }</td>
                                <td>{ classInfo.enrolledUsers.length }</td>
                                <td>
                                    <a href="#" className="btn btn-sm btn-primary">
                                        <i className="fa fa-edit"></i>
                                    </a>
                                </td>
                                <td>
                                    <a href="#" className="btn btn-sm btn-danger">
                                        <i className="fa fa-trash-alt"></i>
                                    </a>
                                </td>
                            </tr>;
                        })
                    }
                        {/*<tr style={{background: '#efe'}}>*/}
                        {/*    <td>*/}
                        {/*        <input value="Бачата с Павликом"/>*/}
                        {/*    </td>*/}
                        {/*    <td>*/}
                        {/*        <input type="datetime-local"/>*/}
                        {/*    </td>*/}
                        {/*    <td>*/}
                        {/*        <input type="datetime-local"/>*/}
                        {/*    </td>*/}
                        {/*    <td>*/}
                        {/*        <select>*/}
                        {/*            <option>Бачата</option>*/}
                        {/*            <option>Бальные танцы</option>*/}
                        {/*        </select>*/}
                        {/*    </td>*/}
                        {/*    <td>*/}
                        {/*        <input value="Драньков Павел"/>*/}
                        {/*    </td>*/}
                        {/*    <td>*/}
                        {/*        <input type="number" value="50"/>*/}
                        {/*    </td>*/}
                        {/*    <td>49</td>*/}
                        {/*    <td colSpan="2">*/}
                        {/*        <a href="#" className="btn btn-sm btn-primary">*/}
                        {/*            Сохранить*/}
                        {/*        </a>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                    </tbody>
                    <tbody style={{borderTop: "0.5em black solid"}}>
                        <AddClassForm/>
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

export { StudioClassesForm };
