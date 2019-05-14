import React from 'react';

class ClassReviewForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            classTitle: "",
            rating: -1,
            reviewContent: ""

        };

        this.classId = this.props.match.params.classId;
    }

    componentDidMount() {
        fetch(`/v1/classes/${this.classId}`).then(response => {
            return response.json();
        }).then(data => {
            this.setState({
                classTitle: data.class.title,
                isLoading: false
            });
        });
    }

    handleSubmit(e) {
        e.preventDefault();


    }

    render() {
        return <div className="card m-2">
            <h4 className="card-header">
                Новый отзыв
            </h4>
            <div className="card-body">
                <form onSubmit={e => this.handleSubmit(e)} action="/v1/reviews" method="POST">
                    <div className="form-group row">
                        <span className="col-sm-2 col-form-label">Название</span>
                        <div className="col-sm-10 px-0">
                            <input type="text" readOnly className="form-control-plaintext" id="staticEmail"
                                   value={this.state.classTitle}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="exampleFormControlSelect1" className="col-sm-2 col-form-label">Оценка</label>
                        <select className="form-control col-sm-2"
                                id="exampleFormControlSelect1"
                                disabled={this.state.isLoading}
                                value={this.state.rating}
                                onChange={e => this.setState({ rating: e.target.value })}
                        >
                            <option value={-1}>Выберите оценку</option>
                            <option>0</option>
                            <option>0.5</option>
                            <option>1</option>
                            <option>1.5</option>
                            <option>2</option>
                            <option>2.5</option>
                            <option>3</option>
                            <option>3.5</option>
                            <option>4</option>
                            <option>4.5</option>
                            <option>5</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Текст отзыва <em>(необязательно)</em></label>
                        <textarea className="form-control"
                                  id="exampleFormControlTextarea1"
                                  disabled={this.state.isLoading}
                                  value={this.state.reviewContent}
                                  onChange={e => this.setState({ reviewContent: e.target.value })}
                                  rows={3}
                        />
                    </div>
                    <div className="form-group mb-0">
                        <button type="submit" className="btn btn-success" disabled={this.state.isLoading}>Оставить отзыв</button>
                        {
                            false && <span className="text-success ml-4">Спасибо за отзыв! ✓</span>
                        }
                    </div>
                </form>
            </div>
        </div>;
    }
}

export { ClassReviewForm };
