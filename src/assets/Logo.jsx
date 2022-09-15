import React from 'react';
import styled from '@emotion/styled';

function Logo() {
  return (
    <LogoWrap>
      <LogoText>SQLCanvas</LogoText>
      <LogoPoint>CLM</LogoPoint>
    </LogoWrap>
  );
}

const LogoWrap = styled.div`
  width: 275px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: bold;

  & * {
    font-family: 'GmarketSans' !important;
  }
`;

const LogoText = styled.div`
  font-size: 23px;
  font-family: 'GmarketSans' !important;
`;

const LogoPoint = styled.span`
  padding: 7px 12px;
  background-color: #fb5b5b;
  border-radius: 5px;
  font-size: 20px;
  font-family: 'GmarketSans' !important;
`;

export default Logo;
