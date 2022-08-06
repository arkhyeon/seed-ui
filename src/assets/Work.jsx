import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AsideCreator from '../components/AsideCreator';
import { DepthList1 } from './DepthMenuList';
import Datalist from '../components/components/Datalist';

function Work() {
  const { pathname } = useLocation();
  const [state, setState] = useState({});

  const setDataListData = value => {
    setState({ ...state, value });
  };

  return (
    <AsideCreator menuList={DepthList1} title="설정">
      <Datalist id="ice" setData={setDataListData} />
      <br />
      Hello Work! <br /> <br /> path : {pathname}
      <button
        type="button"
        onClick={() => {
          console.log(state);
        }}
      >
        버튼
      </button>
    </AsideCreator>
  );
}

export default Work;
