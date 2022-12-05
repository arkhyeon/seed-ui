import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import DataList from './components/DataList';
import { TextInput } from './components/InputComponent';

function Card({ idx, common, action, data, list }) {
  const card = useCallback(() => {
    let content;

    switch (common.type) {
      case 'DataList':
        content = (
          <DataList
            valueList={common.valueList}
            labelList={common.labelList}
            setData={value => {
              const dataList = list;
              dataList[idx].val = value;
              action(dataList);
            }}
            select
            defaultValue={data.val}
          />
        );
        break;
      case 'TextInput':
        content = (
          <TextInput
            name={common.key}
            defaultValue={data.val}
            onChange={({ target }) => {
              const dataList = list;
              dataList[idx].val = target.value;
              action(dataList);
            }}
          />
        );
        break;
      default:
        content = '';
        break;
    }
    return content;
  }, [common, idx, action, data, list]);

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle>{common.name}</CardTitle>
        <CardDesc>{common.desc}</CardDesc>
      </CardHeader>
      <CardContent>{card()}</CardContent>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  display: flex;
  background-color: #eee;
  padding: 0.5em;
  margin-bottom: 0.5em;
  border-radius: 0.5em;
`;

const CardHeader = styled.div`
  display: grid;
  width: 80%;
`;

const CardTitle = styled.div`
  display: flex;
  font-weight: 600;
  padding: 0.3em;
`;

const CardDesc = styled.div`
  display: flex;
  padding: 0.3em;
`;

const CardContent = styled.div`
  display: flex;
  width: 20%;
  align-items: center;
  justify-content: flex-end;
`;

export default Card;
