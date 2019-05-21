import React from 'react';

import { Link } from "react-router-dom";
import styled from "styled-components";

const UserDropdownDiv = styled.div`
    position: relative;

    vertical-align: bottom;

    min-width: 10em;

    &::after {
        content: "";
        display: inline-block;

        width: 0;
    }
    
    .list-header {
      display: block;
      text-align: right;

      cursor: pointer;
      user-select: none;
    }

    .loc-opt-current {
        padding: 0 2px;
        border: 1px transparent solid;

        text-decoration: none;

        color: black;
        opacity: .75;
    }

    .loc-opt-current:hover {
        color: black;
        border: 1px black dotted;
    }

    .loc-opt-current::after {
        content: "";
        display: inline-block;

        width: 0;
        height: 0;

        margin-left: .25em;
        margin-right: .25em;

        vertical-align: middle;

        opacity: .75;
    }

    .loc-opt-dropdown {
        position: absolute;
        z-index: 10;

        background: white;
        border: 1px solid rgba(0, 0, 0, .15);
        border-radius: 5px;

        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .loc-opt-dropdown a {
        padding: 1ex 0;
        padding-left: 2px;

        //color: black;
        //text-decoration: none;
    }

    .loc-opt-dropdown a:hover {
        background: rgba(0, 0, 0, .05);
    }
`;

class UserDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false
        };
    }

    handleLogoutClick(e) {
        e.preventDefault();

        this.props.onLogout();
    }

    handleHeaderClick(e) {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    handleOptionClick(e) {
        this.setState({ isExpanded: false });
    }

    render() {
        const { email, managedStudio, isAdmin } = this.props.auth;

        return <UserDropdownDiv>
            <div className="list-header" onClick={e => this.handleHeaderClick(e)}>
                <img src={ `/v1/userpics/${email}` } style={{ height:"40px", borderRadius: "50%" }}/>
                &nbsp;
                { email }
                &nbsp;
                ▾
            </div>
            <div className="loc-opt-dropdown"
                 style={{ display: this.state.isExpanded ? 'flex' : 'none' }}
                 onClick={e => this.handleOptionClick(e)}>
                <Link to="/profile">Профиль</Link>
                {
                    managedStudio && <>
                        <Link to={`/studios/${managedStudio}/manage`}>Студия</Link>
                    </>
                } {
                    isAdmin && <>
                        <Link to="/admin">Админка</Link>
                    </>
                }
                <a href="#" onClick={e => this.handleLogoutClick(e)}>Выйти</a>
            </div>
        </UserDropdownDiv>;
    }
}

export { UserDropdown };
