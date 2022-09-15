import React from 'react';
import { useLocation } from 'react-router-dom';
import { DepthList1 } from './DepthMenuList';
import { AsideCreator } from '../components';
import Logo from './Logo';

function MacroCommandSetting() {
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
      Hello MacroCommandSetting <br /> <br /> path : {pathname}
    </AsideCreator>
  );
}

export default MacroCommandSetting;
