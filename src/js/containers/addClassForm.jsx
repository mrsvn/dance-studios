import React from "react";

import leftPad from '../util/leftPad';
import { tags } from "../util/tags";

class AddClassForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.initialState();
    }

    initialState() {
        const startTime = new Date();
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + 60);

        return {
            title: "",
            date: startTime.toISOString().split('T')[0],
            startTime: startTime.getHours() + ':' + leftPad(startTime.getMinutes(), 2),
            endTime: endTime.getHours() + ':' + leftPad(endTime.getMinutes(), 2),
            tags: "Бачата",
            trainer: "",
            capacity: ""
        };
    }

    handleSubmit(e) {
        e.preventDefault();

        // TODO: validate input

        const startTime = new Date(this.state.date + 'T' + this.state.startTime);
        const endTime = new Date(this.state.date + 'T' + this.state.endTime);

        if(endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1);
        }

        fetch(`/v1/studio/${this.props.urlBit}/classes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: this.state.title,
                startTime: startTime,
                endTime: endTime,
                tags: this.state.tags,
                trainer: this.state.trainer,
                capacity: this.state.capacity
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);

            if(data.status === 'OK') {
                // TODO: clear the form  vvv
                this.setState(this.initialState());

                this.props.onNewClass();
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        // TODO: display the resulting class length to the user

        return <tr>
            <td>
                <input name="title" placeholder="Утренняя разминочка" value={this.state.title} onChange={e => this.setState({ title: e.target.value })}/>
            </td>
            <td colSpan={2}>
                <input type="date" value={this.state.date} onChange={e => this.setState({ date: e.target.value })}/>
                <input type="time" value={this.state.startTime} onChange={e => this.setState({ startTime: e.target.value })}/>
                <input type="time" value={this.state.endTime} onChange={e => this.setState({ endTime: e.target.value })}/>
            </td>
            <td>
                <select name="tags" value={this.state.tags} onChange={e => this.setState({ tags: e.target.value })}>
                    {
                        tags.map(tag => {
                            return <option value={tag.id}>{ tag.name }</option>;
                        })
                    }
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

export { AddClassForm };
