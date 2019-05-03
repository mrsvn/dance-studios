import React from 'react';

class AdminInvitationsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            invitations: [],
            isSending: false
        };
    }

    loadInvitations() {
        fetch("/v1/invitations").then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                invitations: data.invitations
            });
        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.loadInvitations();
    }

    handleNewInvitationClick() {
        this.setState({isSending: true});

        fetch("/v1/invitations", { method: 'POST' }).then(response => {
            return response.json();
        }).then(() => {
            this.setState({isSending: false});
            this.loadInvitations();
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return <div className="card m-2">
            <h5 className="card-header">Ссылки-приглашения менеджерам</h5>
            <div className="card-body">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Ссылка</th>
                        <th scope="col">Создана</th>
                        <th scope="col">Действительна до</th>
                        <th scope="col">&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.invitations.map(invitation => {
                            return <tr key={invitation.secret}>
                                <td>
                                    <a href={`/invite/${invitation.secret}`} className="text-monospace">
                                        {invitation.secret}
                                    </a>
                                </td>
                                <td>{new Date(invitation.createdAt).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}</td>
                                <td>{new Date(invitation.expiresAt).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}</td>
                                <td className="p-2">
                                    <button className="btn btn-sm btn-danger" disabled={this.state.isSending}>Удалить</button>
                                </td>
                            </tr>;
                        })
                    }
                    </tbody>
                </table>

                <button className="btn btn-primary" onClick={() => this.handleNewInvitationClick()} disabled={this.state.isSending}>
                    Создать новое приглашение
                </button>
            </div>
        </div>;
    }
}

export { AdminInvitationsPage };
