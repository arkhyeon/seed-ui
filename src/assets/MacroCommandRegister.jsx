import React from 'react';
import { useLocation } from 'react-router-dom';
import { AsideCreator } from '../components';
import { DepthList1 } from './DepthMenuList';
import Logo from './Logo';

function MacroCommandRegister() {
  const { pathname } = useLocation();
  return (
    <AsideCreator
      menuList={DepthList1}
      title="설정"
      logoSetting={{
        logo: <Logo />,
        logoLink: '/',
      }}
    >
      Hello MacroCommandRegister <br /> <br /> path : {pathname}
    </AsideCreator>
  );
}

export default MacroCommandRegister;
