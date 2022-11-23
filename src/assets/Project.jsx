import React, { useState } from 'react';
import styled from '@emotion/styled';
import LabelList from '../components/LabelList/LabelList';

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
      gname: 'group2',
      notes: null,
    },
    {
      gid: 2,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 3,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 4,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 5,
      gname: 'group2',
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
  return (
    <Wrap>
      <Wrapper>
        <LabelList
          labelList={labelList}
          createFunction={createLabel}
          valueArr={valueArr}
          setValueArr={setValueArr}
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
