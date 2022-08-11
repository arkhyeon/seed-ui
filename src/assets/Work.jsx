import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AsideCreator from '../components/AsideCreator';
import { DepthList1 } from './DepthMenuList';
import Datalist from '../components/components/Datalist';

function Work() {
  const { pathname } = useLocation();
  const [state, setState] = useState({});

  const setDataListData = value => {
    setState({ id: value });
  };
  const data1 = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30,
  ];
  const data2 = [
    'Andi',
    'Stern',
    'Andrea',
    'Ezra',
    'Romy',
    'Shaw',
    'Derek',
    'Yvonne',
    'Nils',
    'Janeen',
    'Hendrik',
    'Lucina',
    'Levi',
    'Nial',
    'Bunni',
    'Sally',
    'Broddy',
    'Francklyn',
    'Hayley',
    'Erasmus',
    'Leo',
    'Lezley',
    'Merrily',
    'Leyla',
    'Brose',
    'Pearline',
    'Sherline',
    'Letitia',
    'Marianne',
    'Dael',
  ];
  return (
    <AsideCreator menuList={DepthList1} title="설정">
      <Datalist id="ice" valueList={data2} setData={setDataListData} />
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
