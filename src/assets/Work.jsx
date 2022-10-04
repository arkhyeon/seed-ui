import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import AsideCreator from '../components/AsideCreator';
import { DepthList1 } from './DepthMenuList';
import DataList from '../components/components/DataList';
import Pagination from '../components/components/Pagination';
import { TextInput } from '../components/components/InputComponent';
import Logo from './Logo';
import { BlackButton, WhiteButton } from '../components/Button/Button';

function Work() {
  const { pathname } = useLocation();
  const [state, setState] = useState({});

  const setDataListData = value => {
    setState({ id: value });
  };
  const data1 = [0, 1, 2, 3, 4];
  const data3 = ['a12', 'b34', 'c56', 'd67', 'e90'];
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

  const pageFunction = (currentPage, dataLength) => {
    console.log(currentPage);
    console.log(dataLength);
  };

  const componentClickFunc = () => {
    console.log('clicked');
  };

  const componentChangeFunc = value => {
    console.log(value);
  };

  const checkSubmit = e => {
    e.preventDefault();
    console.log('chekc');
    console.log(e);
  };

  return (
    <AsideCreator
      menuList={DepthList1}
      title="설정"
      logoSetting={{
        logo: <Logo />,
        logoLink: '/',
      }}
    >
      <PaginationWrap>
        <Pagination totalLength={22313} pageEvent={pageFunction} />
      </PaginationWrap>
      <DataList id="프로젝트" valueList={data2} setData={setDataListData} />
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
      <SearchWrapper>
        <label>DBMS 명 :</label>
        <DataList id="DBMS" valueList={data2} setData={setDataListData} />
        <label htmlFor="HEY">DBMS 명 :</label>
        <DataList id="HEY" valueList={data1} labelList={data3} setData={setDataListData} />

        <label htmlFor="hello">테이블 명 :</label>
        <TextInput
          id="hello"
          onClick={componentClickFunc}
          onChange={e => componentChangeFunc(e.target.value)}
        />
      </SearchWrapper>
      <BlackButton
        onClick={() => {
          console.log(state);
        }}
      >
        검색
      </BlackButton>
      <WhiteButton>검색</WhiteButton>
      <form
        onSubmit={e => {
          checkSubmit(e);
        }}
      >
        <input id="a1" type="text" />
        <input id="b1" type="text" />
        <button type="submit">hi</button>
      </form>
    </AsideCreator>
  );
}

const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 12px 0;
  gap: 12px;

  & label {
    min-width: 80px;
  }
`;

export default Work;
