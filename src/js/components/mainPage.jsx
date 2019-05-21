import React from 'react';

import styled from 'styled-components';

const MainPageDiv = styled.div`
  h1 {
    font-size: 4rem;
    font-weight: 100;
  }
`;

class MainPage extends React.Component {
    render() {
        return <MainPageDiv>
            <h1>Under construction ⏱</h1>
        </MainPageDiv>;
    }
}

export { MainPage };
