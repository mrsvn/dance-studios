import React from "react";

import { Link } from "react-router-dom";

import { AddClassForm } from "./addClassForm";

class StudioClassesForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: []
        };
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
        }).catch(err => {
            console.log(err);
        });
    }

    componentDidMount() {
        this.loadClasses();
    }

    render() {
        // TODO: class edit form

        return <div className="card m-2">
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
                            return <tr key={classInfo._id}>
                                <td>
                                    <Link to={`/studios/${this.props.urlBit}/manage/classes/${classInfo._id}`}>
                                        { classInfo.title }
                                    </Link>
                                </td>
                                <td style={{fontSize: '0.75em'}}>{ classInfo.startTime }</td>
                                <td style={{fontSize: '0.75em'}}>{ classInfo.endTime }</td>
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
                    </tbody>
                    <tbody style={{borderTop: "0.5em black solid"}}>
                        <AddClassForm urlBit={this.props.urlBit} onNewClass={() => this.loadClasses()}/>
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

export { StudioClassesForm };
