import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { DepthList1 } from './assets/DepthMenuList';
import { HeaderCreator } from './components';

function Index() {
  return (
    <>
      <HeaderCreator
        logoSetting={{
          logo: 'Seed UI Project',
          logoLink: '/',
          logoColor: '#eeeeee',
        }}
        menuList={DepthList1}
        useDepth
        userRole={3}
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
        <NavLink to="children">Children</NavLink>
      </HeaderCreator>
      <Outlet />
    </>
  );
}

export default Index;
