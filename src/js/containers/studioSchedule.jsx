import React from 'react';

class StudioSchedule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: []
        };
    }

    componentDidMount() {
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
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        console.log("classes", this.state.classes);

        return <div>
            {
                this.state.classes.map(classInfo => {
                    return <div key={classInfo._id}>
                        <pre>{ JSON.stringify(classInfo, null, 4) }</pre>
                        <a href="#" onClick={e => this.handleEnroll(e, classInfo._id)}>Записаться!</a>
                    </div>;
                })
            }
        </div>;
    }
}

export { StudioSchedule };
