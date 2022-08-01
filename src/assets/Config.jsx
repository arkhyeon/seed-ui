import React from 'react';
import { DepthList1 } from './DepthMenuList';
import AsideCreator from '../components/AsideCreator';
import { useLocation } from 'react-router-dom';

function Config(props) {
  const { pathname } = useLocation();
  return (
    <AsideCreator menuList={DepthList1} title={'설정'}>
      Hello config <br /> <br /> path : {pathname}
    </AsideCreator>
  );
}

export default Config;
