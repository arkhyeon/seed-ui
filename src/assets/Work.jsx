import React from 'react';
import { useLocation } from 'react-router-dom';
import AsideCreator from '../components/AsideCreator';
import { DepthList1 } from './DepthMenuList';

function Work() {
  const { pathname } = useLocation();
  return (
    <AsideCreator menuList={DepthList1} title="설정">
      Hello Work! <br /> <br /> path : {pathname}
    </AsideCreator>
  );
}

export default Work;
