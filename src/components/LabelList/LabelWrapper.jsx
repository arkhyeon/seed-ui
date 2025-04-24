import React from 'react';
import styled from '@emotion/styled';
import { MdOutlineNewLabel } from 'react-icons/md';
import Label from './Label';
import DividingLine from '../Line/DividingLine';

function LabelWrapper({ dataList, setSelectedValueList, selectedValueList, createFunction, unit }) {
  return (
    <LabelSelectorWrap className="label-selector">
      <Title>{unit} 관리</Title>
      <DividingLine />
      <LabelWrap>
        {dataList.map(data => (
          <Label
            key={`label-${data.value}`}
            data={data}
            setSelectedValueList={setSelectedValueList}
            selectedValueList={selectedValueList}
          />
        ))}
      </LabelWrap>
      {createFunction && (
        <>
          <DividingLine />
          <LabelButton onClick={createFunction}>
            <MdOutlineNewLabel />
            {unit} 추가
          </LabelButton>
        </>
      )}
    </LabelSelectorWrap>
  );
}

const LabelSelectorWrap = styled.div`
  position: absolute;
  width: 250px;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background: white;
  z-index: 998;
`;

const Title = styled.div`
  padding: 12.5px 15px;
  font-size: 14px;
`;

const LabelWrap = styled.div`
  height: 320px;
  overflow-y: auto;
  user-select: none;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d3d3d3;
    border-radius: 10px;
  }
`;

const LabelButton = styled.div`
  cursor: pointer;
  padding: 8px 15px;
  font-size: 14px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
    font-size: 15px;
  }

  :hover {
    background: #3e3e3e;
    color: white;
  }
`;

export default LabelWrapper;
