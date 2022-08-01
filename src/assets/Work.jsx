import React from 'react';
import AsideCreator from '../components/AsideCreator';
import { DepthList1 } from './DepthMenuList';
import { useLocation } from 'react-router-dom';

function Work(props) {
  const { pathname } = useLocation();
  return (
    <>
      <AsideCreator menuList={DepthList1} title={'설정'}>
        Hello Work! <br /> <br /> path : {pathname}
      </AsideCreator>
    </>
  );
}

export default Work;
