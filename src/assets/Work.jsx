import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { MdDangerous } from 'react-icons/md';
import _ from 'lodash';
import axios from 'axios';
import AsideCreator from '../components/Menu/AsideCreator';
import { DepthList1 } from './DepthMenuList';
import DataList from '../components/InputComp/DataList';
import Pagination from '../components/InputComp/Pagination';
import { PasswordInput, TextInput } from '../components/InputComp/InputComponent';
import Logo from './Logo';
import { BlackButton, WhiteButton } from '../components/Button/Button';
import { Modal, Count, DatePicker, TimePicker, InputGrid } from '../components';
import Radio from '../components/Radio';
import { TabIconButton } from '../components/SideTabs/SideTabs';
import { alertStore } from '../R2wZustand';
import { toast } from '../components/Alert/Toast';
import ModalTestTemplate from '../ModalTestTemplate';
import Counter from '../components/Counter/Counter';

function Work() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const { pathname } = useLocation();
  const [state, setState] = useState('');
  const [check, setCheck] = useState(false);
  const [time, setTime] = useState();
  const [isNull, setIsNull] = useState('y');
  const [date, setDate] = useState(new Date());
  const [timeData, setTimeData] = useState([]);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState(24);
  const setDataListData = value => {
    console.log(value);
    setState(value);
  };

  useEffect(() => {
    getServerList();
    setTimeData(data4);
  }, []);
  const { setAlertList } = alertStore();
  const data1 = [0, 1, 2, 3, 4];
  const data3 = ['a12', 'b34', 'c56', 'd67', 'e90'];
  const labelList = Array(30)
    .fill(0)
    .map((e, i) => i);
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

  // 1000 100 100000 큰건 이만큼 걸린다
  // 200 100 20000 작은건 이만큼 걸린다

  // 작은 것에 비해 큰것은 숫자도 5배

  const [isDisabled, setIsDisabled] = useState(true);

  // 버튼 클릭 시 실행되는 함수
  const handleClick = () => {
    if (isDisabled) {
      // 버튼이 disabled 상태일 때 알림창 표시
      window.alert('버튼이 비활성화되어 있습니다.');
    } else {
      // 버튼이 활성화 상태일 때 실행할 로직
      console.log('버튼이 활성화되어 있습니다.');
    }
  };
  const [srcServerList, setSrcServerList] = useState([]);
  const [dstServerList, setDstServerList] = useState([]);
  const [serverTest, setServerTest] = useState(56);

  const getServerList = () => {
    axios.defaults.headers.common.authorization =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyMndhcmVUb2tlbiIsInVpZCI6ImFkbWluIiwiZXhwIjoxNzEzMzQyNzUxfQ.R4eZa02QTa50gr_R_u-ZfQo_HjiAQare0ajabN0pekhMrqdVVSVIRpJQ7zVRLQZz4y1OW_zUJROJs-ZNtfhyMg';
    axios
      .all([
        axios.get('http://192.168.10.26:8686/CLM30/find/dbms/src'),
        axios.get('http://192.168.10.26:8686/CLM30/find/dbms/dst'),
      ])
      .then(
        axios.spread((src, dst) => {
          setSrcServerList(src.data.data);
          setDstServerList(dst.data.data);
        }),
      )
      .catch(err => console.log(err));
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
      <DataList
        valueList={labelList}
        labelList={data2}
        value={name}
        setData={e => {
          console.log(e);
          setName(e);
        }}
        select
      />
      <DataList
        valueList={_.map(srcServerList, 'serverid_src')}
        labelList={_.map(srcServerList, 'server_name')}
        value={serverTest}
        setData={setServerTest}
        select
      />
      <DataList
        valueList={_.map(srcServerList, 'serverid_src')}
        labelList={_.map(srcServerList, 'server_name')}
        value={serverTest}
        setData={setServerTest}
      />
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
      <BlackButton disabled={isDisabled}>고장난 버튼</BlackButton>
      <BlackButton
        onClick={() => {
          window.alert('working!');
        }}
        permission={2}
      >
        작동 가능 버튼
      </BlackButton>
      <Counter targetValue={500} time={100 / (500 / 100)} />
      <Counter targetValue={100} time={100} />
    </AsideCreator>
  );
}
// 기본 설정 시간 /  (카운트 /최소 카운트)

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
