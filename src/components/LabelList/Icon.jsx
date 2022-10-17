import React from 'react';
import { MdLabelOutline } from 'react-icons/md';
import styled from '@emotion/styled';
import LabelSelector from './LabelSelector';

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
    width: 25px;
    height: 25px;
  }
  cursor: pointer;
`;

export default Icon;
