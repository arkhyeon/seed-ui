import React from 'react';
import { ConfigMenus, DepthList1 } from './assets/DepthMenuList.jsx';
import { HeaderCreator } from './components';
import AsideCreator from './components/AsideCreator';
import { NavLink, Outlet } from 'react-router-dom';

function Index(props) {
  return (
    <>
      <HeaderCreator
        logoSetting={{
          logo: 'SQLCanvas Post',
          logoLink: '/',
          logoColor: '#eeeeee',
        }}
        menuList={DepthList1}
        useDepth={true}
        menuStyle={{
          headerColor: '#222831',
          bgColor: '#393E46',
          bgHoverColor: '#00ADB5',
          fontColor: '#EEEEEE',
          size: [5.5, 35],
          depthSize: [200, 40],
          gap: 20,
        }}
      >
        <div>HI</div>
      </HeaderCreator>
    </>
  );
}

export default Index;
