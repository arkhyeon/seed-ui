import React from 'react';
import { useLocation } from 'react-router-dom';
import AsideCreator from '../components/AsideCreator';
import { DepthList1 } from './DepthMenuList';

function Work(props) {
  return (
    <AsideCreator menus={DepthList1} title={'설정'}>
      Hello Work!@
    </AsideCreator>
  );
}

export default Work;
