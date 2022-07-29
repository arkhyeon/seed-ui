import React from 'react';
import { useLocation } from 'react-router-dom';
import { AsideCreator } from '../components';
import { DepthList1 } from './DepthMenuList';

function MacroCommandRegister(props) {
  const { pathname } = useLocation();
  return (
    <AsideCreator menuList={DepthList1} title={'설정'}>
      Hello MacroCommandRegister <br /> <br /> path : {pathname}
    </AsideCreator>
  );
}

export default MacroCommandRegister;
