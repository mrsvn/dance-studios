
import React from "react";

import styled from "styled-components";

const DivSpinner = styled.div`
  position: absolute;
  background: rgba(255,255,255,0.5);
  top: 0;
  width: 100%;
  left: 0;
  height: 100%;

  & > img {
    width: 120px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
`;

export const FormSpinner = ({ src }) => {
    return <DivSpinner>
        <img alt="Loading..." src={src} />
    </DivSpinner>;
};
