import React from 'react';
import styled from '@emotion/styled';

function WhiteButton({ ...rootDOMAttributes }) {
  return <Button {...rootDOMAttributes} />;
}

const Button = styled.button`
  box-sizing: border-box !important;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #ffffff;
  background: #212529;
  border-radius: 5px;
  border: 2px solid #ffffff;
  padding: 8px 13px;

  :hover {
    background: #ffffff;
    border: 2px solid #ffffff;
  }

  :active {
    background: #ffffff;
    border: 2px solid #ffffff;
  }
`;

export default WhiteButton;
