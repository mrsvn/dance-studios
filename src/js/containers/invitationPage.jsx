import React from 'react';

import styled from 'styled-components';
import { BigRegisterForm } from "./bigRegisterForm";

const SpinnerDiv = styled.div`
  margin: 250px auto 0;
  width: 150px;
  
  & > img {
    width: 150px;
  }
`;

const ErrorDiv = styled.div`
  margin: 250px auto 0;
  max-width: 450px;
  
  color: red;
`;

class InvitationPage extends React.Component {
    constructor(props) {
        super(props);

        this.secret = this.props.match.params.secret;

        this.state = {
            status: 'LOADING'
        };
    }

    componentDidMount() {
        fetch(`/v1/invitations/${this.secret}`).then(response => {
            return response.json();
        }).then(data => {
            if(data.status === 'ACTIVE') {
                this.setState({ status: 'VALID' });
            }
            else {
                this.setState({ status: 'ERROR', errorType: data.status });
            }
        }).catch(err => {
            console.error(err);
        });
    }

    render() {
        const { status } = this.state;

        if(status === 'LOADING') {
            return <SpinnerDiv>
                {/*<img alt="Загрузка..." src="/img/spinner-large.svg"/>*/}
                <img alt="Загрузка..." src="/img/spinner-cat.gif"/>
            </SpinnerDiv>;
        }
        else if(status === 'ERROR') {
            return <BigRegisterForm secretError={this.state.errorType}/>;
        }
        else if(status === 'VALID') {
            return <BigRegisterForm secret={this.secret}/>;
        }
    }
}

export { InvitationPage };
