import React, { useState } from 'react';
import styled from '@emotion/styled';
import LabelList from '../components/LabelList/LabelList';
import _ from 'lodash';

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

  return (
    <Wrap>
      <Wrapper>
        <LabelList
          labelList={_.map(data1, 'gname')}
          valueList={_.map(data1, 'gid')}
          setSelectedValueList={setSelectedValueList}
          selectedValueList={selectedValueList}
          createFunction={createLabel}
        />
      </Wrapper>
    </Wrap>
  );
}

export default Project;

const Wrap = styled.div`
  display: flex;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 720px;
  margin: 16px 0;
  display: flex;
  justify-content: flex-end;
`;
