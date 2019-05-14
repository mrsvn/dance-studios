import React from 'react';

class ClassReviewForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isInvalid: false,
            isSuccessful: false,
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

        if(this.state.rating === -1) {
            return this.setState({
                isInvalid: true
            });
        }

        this.setState({
            isLoading: true
        });

        fetch('/v1/reviews', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                classId: this.classId,
                rating: this.state.rating,
                reviewContent: this.state.reviewContent
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            if(data.status === 'OK') {
                this.setState({
                    isSuccessful: true
                });

                setTimeout(() => {
                    this.props.history.push({
                            pathname: '/profile/reviews'
                    });
                }, 1000);
            }
            else {
                console.log(data);

                this.setState({
                    isLoading: false
                });
            }
        });
    }

    updateRating(newRating) {
        this.setState({
            rating: newRating,
            isInvalid: newRating === -1
        });
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
                                style={this.state.isInvalid ? {border: '1px red solid'} : {}}
                                id="exampleFormControlSelect1"
                                disabled={this.state.isLoading}
                                value={this.state.rating}
                                onChange={e => this.updateRating(e.target.value) }
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
                        <button type="submit" className={"btn " + (this.state.isInvalid ? "btn-danger" : "btn-success")} disabled={this.state.isLoading}>Оставить отзыв</button>
                        {
                            this.state.isInvalid && <span className="text-danger ml-4">Поставьте оценку!</span>
                        }
                        {
                            this.state.isSuccessful && <span className="text-success ml-4">Спасибо за отзыв! ✓</span>
                        }
                    </div>
                </form>
            </div>
        </div>;
    }
}

export { ClassReviewForm };
