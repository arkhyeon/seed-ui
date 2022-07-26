import React from 'react';
import { DepthList1 } from './DepthMenuList';
import AsideCreator from '../components/AsideCreator';

function Config(props) {
  return (
    <AsideCreator menus={DepthList1} title={'설정'}>
      Hello Work!@
    </AsideCreator>
  );
}

export default Config;
