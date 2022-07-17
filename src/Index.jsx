import React from 'react';
import HeaderCreator from './HeaderCreator.jsx';
import styled from '@emotion/styled';
import { DepthList1 } from './DepthMenuList.jsx';

function Index(props) {
  return (
    <>
      <HeaderCreator
        logoSetting={{
          logo: 'SQLCanvas Post',
          logoLink: '/',
          logoColor: '#a8455e',
        }}
        menuList={DepthList1}
        useDepth={true}
        menuStyle={{
          headerColor: 'rebeccapurple',
          bgColor: 'red',
          bgHoverColor: 'blue',
          fontColor: 'aqua',
          size: [5.5, 35],
          depthSize: [200, 40],
          gap: 20,
        }}
      >
        <MenuInfo>d</MenuInfo>
      </HeaderCreator>
      <Holy>|</Holy>
    </>
  );
}

const Holy = styled.div`
  position: fixed;
  width: 200px;
  height: 200px;
  background-color: rebeccapurple;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 180px;
`;

const MenuInfo = styled.div`
  width: 300px;
  height: 60px;
  background-color: cornflowerblue;
`;

export default Index;
