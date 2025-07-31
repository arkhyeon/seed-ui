import React from 'react';
import styled from '@emotion/styled';
import DataList from '../../InputComp/DataList';
import { TextInput } from '../../InputComp/InputComponent';
import Count from '../../Count/Count';

function OptionCard({ config, option, setOption, children }) {
  const changeOption = value => {
    setOption(prevState =>
      prevState.map(pv => (pv.key === option.key ? { ...pv, val: value } : pv)),
    );
  };

  const card = () => {
    if (config.type === 'DataList') {
      return (
        <DataList
          select
          defaultValue={option.val}
          valueList={config.valueList}
          labelList={config.labelList}
          setData={value => changeOption(value)}
        />
      );
    }

    if (config.type === 'TextInput') {
      return (
        <TextInput
          name={config.key}
          defaultValue={option.val}
          onChange={({ target }) => changeOption(target.value)}
        />
      );
    }

    if (config.type === 'Count') {
      return (
        <Count
          value={option.val}
          onChange={value => changeOption(value)}
          min={config?.min}
          max={config?.max}
        />
      );
    }

    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle>{config.name}</CardTitle>
        <CardDesc>{config.desc}</CardDesc>
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

export default OptionCard;
