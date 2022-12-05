import React, { useState } from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import LabelList from '../components/LabelList/LabelList';
import { DatePicker } from '../components';
import TimePicker from '../olderComponent/TimePicker/TimePicker';
import TestTimePicker from '../components/DateTime/TimePicker';

function Project() {
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
  ];

  const data1 = [
    {
      gid: 1,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 2,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 3,
      gname: 'group3',
      notes: null,
    },
    {
      gid: 4,
      gname: 'group4',
      notes: null,
    },
    {
      gid: 5,
      gname: 'group5',
      notes: null,
    },
    {
      gid: 6,
      gname: 'group6',
      notes: null,
    },
    {
      gid: 7,
      gname: 'group7',
      notes: null,
    },
    {
      gid: 8,
      gname: 'group8',
      notes: null,
    },
    {
      gid: 9,
      gname: 'group9',
      notes: null,
    },
    {
      gid: 10,
      gname: 'group10',
      notes: null,
    },
  ];

  const [labelList, setLabelList] = useState([
    '그룹 1이름이 무지막지하게 길어버리는거야 그럼 어떻게 할거야?',
    '그룹 2',
  ]);
  const [valueArr, setValueArr] = useState(['그룹 1']);

  const createLabel = () => {
    setLabelList(labelList.concat('test 그룹'));
  };

  const [selectedValueList, setSelectedValueList] = useState([1, 2]);

  const getGroupList = () => {
    console.log(selectedValueList);
  };

  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date('2023-3-14'));
  const [time, setTime] = useState('17:53');
  const [time2, setTime2] = useState('17:53');
  return (
    <Wrap>
      <button onClick={getGroupList}>검사</button>
      <Wrapper>
        <DatePicker
          date={date}
          setDate={setDate}
          startDate={new Date('2022-11-10')}
          endDate={endDate}
        />
        <DatePicker date={endDate} setDate={setEndDate} startDate={date} />
        <TimePicker time={time} setTime={setTime} />
        <TestTimePicker onChange={val => setTime2(val)} time={time2} />
        {/* <LabelList */}
        {/*  labelList={_.map(data1, 'gname')} */}
        {/*  valueList={_.map(data1, 'gid')} */}
        {/*  setSelectedValueList={setSelectedValueList} */}
        {/*  selectedValueList={selectedValueList} */}
        {/*  createFunction={createLabel} */}
        {/* /> */}
      </Wrapper>
      <input type="text" />
    </Wrap>
  );
}

export default Project;

const Wrap = styled.div`
  display: flex;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 920px;
  margin: 16px 0;
  display: flex;
  justify-content: flex-end;
`;
