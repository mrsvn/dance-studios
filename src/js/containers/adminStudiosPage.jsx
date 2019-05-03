import React from 'react';

class AdminStudiosPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            studios: []
        }
    }

    loadStudios() {
        fetch("/v1/studios").then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                studios: data.studios
            });
        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.loadStudios();
    }

    render() {
        return <div className="card m-2">
            <h5 className="card-header">Студии</h5>
            <div className="card-body">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Название</th>
                        <th scope="col">Менеджер</th>
                        <th scope="col">URL</th>
                        <th scope="col">Город</th>
                        <th scope="col">Отображается</th>
                        <th scope="col">&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.studios.map(studio => {
                            return <tr key={studio.urlBit}>
                                <td>{studio.title}</td>
                                <td>—</td>
                                <td>/{studio.urlBit}</td>
                                <td>{studio.city}</td>
                                <td>{studio.isShown ? "да" : "нет"}</td>
                                <td className="p-2">
                                    <a href="#" className="btn btn-sm btn-primary">Редактировать</a>
                                    &nbsp;
                                    <a href="#" className="btn btn-sm btn-danger">Удалить</a>
                                </td>
                            </tr>;
                        })
                    }
                    </tbody>
                </table>

                <a href="#" className="btn btn-primary">Создать новую студию</a>
            </div>
        </div>;
    }
}

export { AdminStudiosPage };
