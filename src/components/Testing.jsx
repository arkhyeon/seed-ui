import React, { memo, useEffect, useState } from 'react';
import DatePicker from './DateTime/DatePicker';
import DataList from './InputComp/DataList';

function Testing() {
  const [index, setIndex] = useState('');
  const [index2, setIndex2] = useState('');
  const [date, setDate] = useState(new Date());
  const [peopleNames, setPeopleNames] = useState(name);
  const [key, setKey] = useState(num);
  const [test, setTest] = useState(0);
  useEffect(() => {
    console.log(date);
  }, [date]);

  return (
    <>
      <DatePicker
        date={date}
        setDate={value => setDate(value)}
        // startDate={new Date('2022-4-12')}
        // endDate={new Date('2023-11-11')}
      />
      <DataList
        name="ptype"
        labelList={peopleNames}
        valueList={key}
        setData={value => setTest(value)}
        defaultValue={test}
      />
      <Greeting index={index} setIndex={setIndex} />
      <Greeting index={index2} setIndex={setIndex2} />
      <button onClick={() => console.log(test)}>확인</button>
    </>
  );
}

const Greeting = memo(function Greeting({ index, setIndex }) {
  return (
    <>
      {index}
      <br />
      <input type="text" value={index} onChange={e => setIndex(e.target.value)} />
    </>
  );
});

export default Testing;

const name = [
  '김지연',
  '이민준',
  '박서영',
  '정은지',
  '홍성민',
  '이지현',
  '박예은',
  '김서현',
  '장민지',
  '송지윤',
  '이가은',
  '최다은',
  '한승현',
  '윤주원',
  '김도현',
  '임현우',
  '정영재',
  '배시우',
  '강민석',
  '이주원',
  '김민서',
  '장하은',
  '송준호',
  '임지원',
  '황지민',
  '최서영',
  '유승현',
  '강가은',
  '서민준',
  '임주현',
  '한예린',
  '박지우',
  '최승민',
  '이아름',
  '김동현',
  '신지민',
  '오준호',
  '조서연',
  '나현우',
  '정수진',
  '이예원',
  '강예림',
  '박진우',
  '임세영',
  '최준서',
  '손예진',
  '김진우',
  '이하윤',
  '유승준',
  '서예지',
  '임세진',
  '한승주',
  '신예은',
  '조하린',
  '김태윤',
  '강현우',
  '임지안',
  '최다인',
  '이유진',
  '장태호',
  '한가온',
  '박세은',
  '신재원',
  '최지윤',
  '김승우',
  '이혜진',
  '정예린',
  '황승민',
  '서정우',
  '김하늘',
  '강동우',
  '손수빈',
  '이하진',
  '정진우',
  '임다온',
  '최민서',
  '박승호',
  '신유빈',
  '홍은지',
  '이태민',
  '정시우',
  '김수빈',
  '서민서',
  '조하영',
  '박지민',
  '신현우',
  '강민서',
  '임동현',
  '이윤서',
  '최현우',
];

const num = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
  75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
  99,
];
