import React from 'react';
import styled from '@emotion/styled';
import { GiHamburgerMenu } from 'react-icons/gi';

function Head({ title, handleShow }) {
  return (
    <Wrapper>
      <div>{title}</div>
      <Icon>
        <GiHamburgerMenu onClick={handleShow} />
      </Icon>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  position: relative;
`;

const Icon = styled.div`
  cursor: pointer;
  position: absolute;
  right: 10px;
`;

export default Head;
