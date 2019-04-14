import React from "react";

class ClassTableRow extends React.Component {
    render() {

        let enrollLink;

        if (this.props.content.num_vacancies > 0) {
            enrollLink = <a href="#">Записаться</a>;
        }
        else {
            enrollLink = <em>мест нет</em>;
        }


        return (
            <tr>
                <td>{this.props.content.title}</td>
                <td>{this.props.content.subway_station}</td>
                <td>
                    <a href={"/studios/" + this.props.content.studio}>танцы Мытищи</a>
                </td>
                <td>{this.props.content.tag}</td>
                <td>{this.props.content.t_start[0] + ":" + this.props.content.t_start[1] + " — " + this.props.content.t_end[0] + ":" + this.props.content.t_end[1] }</td>
                <td>{this.props.content.trainer}</td>
                <td>{enrollLink}</td>
            </tr>
        )
    }
}

export { ClassTableRow };
