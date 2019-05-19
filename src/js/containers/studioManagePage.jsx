import React from "react";

import { Link, NavLink, Route } from "react-router-dom";

import { StudioProfileEditForm } from "../containers/studioProfileEditForm";
import { StudioClassesForm } from "../containers/studioClassesForm";
import { EnrolledUsersForm } from "./enrolledUsersForm";
import { ClassCard } from "./classCard";

class StudioManagePage extends React.Component {
    constructor(props) {
        super(props);

        this.urlBit = this.props.match.params.urlBit;
        console.log("EDITING", this.urlBit);
    }

    render() {
        return <>
            {/* TODO: implement this navigation (& mark the "back" link better" */}
            <ul className="nav nav-pills nav-fill m-2">
                <li className="nav-item">
                    <Link exact="true" to={`/studios/${this.urlBit}`} className="nav-link">&larr; назад</Link>
                </li>
                <li className="nav-item">
                    <NavLink exact to={`/studios/${this.urlBit}/manage`} className="nav-link" activeClassName="active">Профиль</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink exact to={`/studios/${this.urlBit}/manage/schedule`} className="nav-link" activeClassName="active">Расписание</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink exact to={`/studios/${this.urlBit}/manage/enrolledUsers`} className="nav-link" activeClassName="active">Записавшиеся</NavLink>
                </li>
            </ul>

            <Route exact path={`/studios/${this.urlBit}/manage`} render={() => <StudioProfileEditForm urlBit={this.urlBit}/>}/>
            <Route exact path={`/studios/${this.urlBit}/manage/schedule`} render={() => <StudioClassesForm urlBit={this.urlBit}/>}/>
            <Route exact path={`/studios/${this.urlBit}/manage/enrolledUsers`} render={() => <EnrolledUsersForm urlBit={this.urlBit}/>}/>
            <Route exact path={`/studios/${this.urlBit}/manage/classes/:classId`} component={ClassCard}/>
        </>;
    }
}

export { StudioManagePage };

