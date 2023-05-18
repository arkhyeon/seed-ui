import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { MdDangerous } from 'react-icons/all';
import AsideCreator from '../components/Menu/AsideCreator';
import { DepthList1 } from './DepthMenuList';
import DataList from '../components/InputComp/DataList';
import Pagination from '../components/InputComp/Pagination';
import { TextInput } from '../components/InputComp/InputComponent';
import Logo from './Logo';
import { BlackButton, WhiteButton } from '../components/Button/Button';
import { DatePicker, TimePicker } from '../components';
import Radio from '../components/Radio';
import { TabIconButton } from '../components/SideTabs/SideTabs';
import { alertStore } from '../R2wZustand';
import { toast } from '../components/Alert/Toast';

function Work() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const { pathname } = useLocation();
  const [state, setState] = useState({});
  const [check, setCheck] = useState(false);
  const [time, setTime] = useState();
  const [isNull, setIsNull] = useState('y');
  const [date, setDate] = useState(new Date());
  const setDataListData = value => {
    setState(value);
  };
  const { setAlertList } = alertStore();
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

  const onSubmit = data => {
    console.log(data);
  };

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
      <Radio
        checkColor="rgb(64, 64, 64)"
        value={isNull}
        setValue={() => {
          setIsNull(prevState => (prevState === 'y' ? 'n' : 'y'));
        }}
        list={[
          { label: 'NULL', value: 'y' },
          { label: 'NOT NULL', value: 'n' },
        ]}
        type="border"
      />
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
        <DataList id="DBMS" valueList={check ? data1 : data2} setData={setDataListData} />
        <label htmlFor="HEY">DBMS 명 :</label>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DataList
            id="HEY"
            valueList={data1}
            labelList={data3}
            setData={setDataListData}
            control={control}
          />
          <input type="submit" />
        </form>

        <label htmlFor="hello">테이블 명 :</label>
        <TextInput
          id="hello"
          onClick={componentClickFunc}
          onChange={e => componentChangeFunc(e.target.value)}
          placeHolder="helloss"
        />
      </SearchWrapper>
      <BlackButton
        onClick={() => {
          console.log(check);
          console.log(typeof check);
          setCheck(!check);
        }}
      >
        검색
      </BlackButton>
      <WhiteButton onClick={() => {}}>검색</WhiteButton>
      <WhiteButton
        onClick={() => {
          toast('r2ware');
        }}
      >
        알람
      </WhiteButton>
      <WhiteButton
        onClick={() => {
          setAlertList('hello');
        }}
      >
        알람
      </WhiteButton>
      <WhiteButton
        onClick={() => {
          setAlertList('cococococo');
        }}
      >
        알람
      </WhiteButton>
      <WhiteButton
        onClick={() => {
          setAlertList('makel');
        }}
      >
        알람
      </WhiteButton>
      <form
        onSubmit={e => {
          checkSubmit(e);
        }}
      >
        <input id="a1" type="text" />
        <input id="b1" type="text" />
        <button type="submit">hi</button>
      </form>
      <TimePicker time={time} setTime={setTime} />
      <DatePicker date={date} setDate={setDate} />
      <TextInput />
      <TextBox>
        <label htmlFor="ice-cream-choice">Choose a flavor:</label>
        <input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice" />

        <datalist id="ice-cream-flavors">
          <option value="Chocolate" />
          <option value="Coconut" />
          <option value="Mint" />
          <option value="Strawberry" />
          <option value="Vanilla" />
        </datalist>
      </TextBox>
      <TabIconButton>
        <MdDangerous />
        hi
      </TabIconButton>
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

const TextBox = styled.div`
  & option {
    width: 200px;
  }
`;

export default Work;
