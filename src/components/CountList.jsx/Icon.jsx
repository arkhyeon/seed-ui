import React from 'react';
import { MdLabelOutline } from 'react-icons/md';
import styled from '@emotion/styled';

function Icon({ ...rootDOMAttributes }) {
  return (
    <Button {...rootDOMAttributes}>
      <MdLabelOutline />
    </Button>
  );
}

const Button = styled.button`
  position: relative;
  background: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 28px;
    height: 28px;
  }
  cursor: pointer;
`;

export default Icon;
