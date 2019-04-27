import React from 'react';
import styled from 'styled-components';

import { ProfileEditForm } from "./profileEditForm";

const ProfileMain = styled.main`
  display: flex;

  .calendar-modes {
    text-align: right;
  }

  .dashboard-main {
    flex-grow: 1;
  }
`;

class ProfilePage extends React.Component {
    render() {
        return (
            <ProfileMain>
                <nav>
                    <ul>
                        <li><a href="#">Расписание</a></li>
                        <li><a href="#">Избранные студии</a></li>
                        <li><a href="#">Редактировать профиль</a></li>
                        <li><a href="#">Выход</a></li>
                    </ul>
                </nav>
                <div className="dashboard-main">
                    {/*// <!--				<div class="calendar-modes">-->*/}
                    {/*// <!--					<a href="#">месяц</a>-->*/}
                    {/*// <!--					<a href="#">неделя</a>-->*/}
                    {/*// <!--					<a href="#">списком</a>-->*/}
                    {/*// <!--				</div>-->*/}
                    {/*// <!--				<div style="height: 1000px; font-size: 40px; background: pink;">-->*/}
                    {/*// <!--					календарь-->*/}
                    {/*// <!--				</div>-->*/}

                    <ProfileEditForm/>
                </div>
            </ProfileMain>
        );
    }
}

export { ProfilePage };
