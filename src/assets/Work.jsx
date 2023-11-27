import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { MdDangerous } from 'react-icons/all';
import _ from 'lodash';
import AsideCreator from '../components/Menu/AsideCreator';
import { DepthList1 } from './DepthMenuList';
import DataList from '../components/InputComp/DataList';
import Pagination from '../components/InputComp/Pagination';
import { TextInput } from '../components/InputComp/InputComponent';
import Logo from './Logo';
import { BlackButton, WhiteButton } from '../components/Button/Button';
import { Modal, Count, DatePicker, TimePicker, InputGrid } from '../components';
import Radio from '../components/Radio';
import { TabIconButton } from '../components/SideTabs/SideTabs';
import { alertStore } from '../R2wZustand';
import { toast } from '../components/Alert/Toast';
import ModalTestTemplate from '../ModalTestTemplate';

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
  const [timeData, setTimeData] = useState([]);
  const [modal, setModal] = useState(false);

  const setDataListData = value => {
    console.log(value);
    setState(value);
  };

  useEffect(() => {
    setTimeData(data4);
  }, []);
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

  const data4 = [
    {
      ie_id: -1,
      ie_name: '미지정 그룹',
      notes: '미지정 그룹',
    },
    {
      ie_id: 3,
      ie_name: '방주현업무그룹1',
      notes: '업무 그룹3',
    },
    {
      ie_id: 8,
      ie_name: '[방주현] 업무1',
      notes: '',
    },
    {
      ie_id: 9,
      ie_name: '[방주현] 업무3',
      notes: '',
    },
    {
      ie_id: 10,
      ie_name: '[방주현] 업무4',
      notes: '',
    },
    {
      ie_id: 11,
      ie_name: '[방주현] 업무5',
      notes: '',
    },
    {
      ie_id: 12,
      ie_name: '[방주현] 업무6',
      notes: '123',
    },
    {
      ie_id: 16,
      ie_name: 'cms',
      notes: 'cms',
    },
    {
      ie_id: 18,
      ie_name: '1234',
      notes: '13',
    },
    {
      ie_id: 25,
      ie_name: '1',
      notes: '1',
    },
    {
      ie_id: 26,
      ie_name: 'ㅁ',
      notes: 'ㅁ',
    },
    {
      ie_id: 27,
      ie_name: 'ㅁ',
      notes: 'ㅁ',
    },
    {
      ie_id: 30,
      ie_name: '[HEE] 거래 종료 추출 그룹',
      notes: '',
    },
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
  function leftPad(value) {
    if (value >= 10) {
      return value;
    }

    return `0${value}`;
  }
  const dateFormat = date => {
    const year = date.getFullYear();
    const month = leftPad(date.getMonth() + 1);
    const day = leftPad(date.getDate());

    return [year, month, day].join('-');
  };

  const handleModalBtn = () => {
    setModal(true);
  };

  const ChangeSelectDate = useCallback(e => {
    const { name, value } = e.target || e;
    setDate(prevState => {
      return { ...prevState, [name]: value };
    });
  }, []);

  const monthValueList = [...[...Array(61).keys()].map(key => key), 120];
  const dayValueList = [-1, 32].concat([...Array(32).keys()].map(key => key));
  const dayLabelList = ['', '말', '작업'].concat([...Array(31).keys()].map(key => key + 1));
  return (
    <AsideCreator
      menuList={DepthList1}
      title="설정"
      logoSetting={{
        logo: <Logo />,
        logoLink: '/',
      }}
    >
      {modal && (
        <ModalTestTemplate
          modalTitle="테스트"
          modalState={modal}
          handleClose={() => setModal(false)}
          buttonList={[<WhiteButton onClick={() => setModal(false)}>닫기</WhiteButton>]}
          width="500px"
        >
          <InputGridWrapper>
            <InputGrid
              list={[
                {
                  subject: '월',
                  content: (
                    <>
                      <DataList
                        setData={value => {
                          ChangeSelectDate({
                            name: 'std_m',
                            value,
                          });
                        }}
                        valueList={monthValueList}
                        select
                        defaultValue={date.std_m}
                      />
                      <p>개월 전</p>
                    </>
                  ),
                },
              ]}
            />
            <InputGrid
              list={[
                {
                  subject: '일',
                  content: (
                    <DataListWrapper>
                      <DataList
                        setData={value => {
                          ChangeSelectDate({
                            name: 'std_d',
                            value,
                          });
                        }}
                        labelList={dayLabelList}
                        valueList={dayValueList}
                        select
                        defaultValue={date.std_d}
                      />
                      <p>일</p>
                    </DataListWrapper>
                  ),
                },
              ]}
              location="bottom"
            />
          </InputGridWrapper>
        </ModalTestTemplate>
      )}
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
      <DataList
        id="aaa"
        valueList={_.map(timeData, 'ie_id')}
        // valueList={[-1, 0, 1, 2, 3]}
        // labelList={[0, 1, 2, 3, 4]}
        setData={setDataListData}
      />
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
      <Count />
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
      <DatePicker
        date={new Date('2019-11-02')}
        setDate={e => {
          console.log(dateFormat(e));
          setDate(dateFormat(e));
        }}
      />
      {/* <DatePicker date={new Date('2019-11-02')} setDate={setDate} /> */}
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
      <BlackButton onClick={handleModalBtn}>모달 버튼</BlackButton>
    </AsideCreator>
  );
}

const InputGridWrapper = styled.div`
  margin-bottom: 20px;
`;

const DataListWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  & > div:first-of-type {
    width: 233px;
  }
  & > div:nth-of-type(2) {
    & > div {
      width: 20px;
    }
  }
`;

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
