import React from 'react';
import { useLocation } from 'react-router-dom';
import { DepthList1 } from './DepthMenuList';
import AsideCreator from '../components/Menu/AsideCreator';

function Config() {
  const { pathname } = useLocation();
  return (
    <AsideCreator menuList={DepthList1} title="설정">
      Hello config <br /> <br /> path : {pathname}
    </AsideCreator>
  );
}

export default Config;
