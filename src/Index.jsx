import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { DepthList1 } from './assets/DepthMenuList';
import { HeaderCreator } from './components';

import Logo from './assets/Logo';
import AlertToast from './components/Alert/AlertToast';

function Index() {
  return (
    <div>
      <AlertToast />
      <HeaderCreator
        logoSetting={{
          logo: <Logo />,
          logoLink: '/',
        }}
        menuList={DepthList1}
        useDepth
        userRole={1}
      >
        <div>
          <NavLink to="children">Children</NavLink>
        </div>
      </HeaderCreator>
      <Outlet />
    </div>
  );
}

export default Index;
